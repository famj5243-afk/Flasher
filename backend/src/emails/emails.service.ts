import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { TemplatesService } from '../templates/templates.service';
import { SendEmailDto } from './dto';
import { renderEmail, validateVariables } from '../common/utils/template-renderer';

@Injectable()
export class EmailsService {
  constructor(
    private prisma: PrismaService,
    private templatesService: TemplatesService,
    @InjectQueue('email-queue') private emailQueue: Queue,
  ) {}

  /**
   * Send email using a template
   */
  async sendEmail(userId: string, dto: SendEmailDto, apiKeyId?: string) {
    // Get template
    const template = await this.templatesService.findOne(dto.templateId, userId);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    if (!template.isActive) {
      throw new BadRequestException('Template is not active');
    }

    // Validate variables
    const validation = validateVariables(
      template.subject + template.htmlBody,
      dto.variables || {},
    );

    if (!validation.valid) {
      throw new BadRequestException(
        `Missing required variables: ${validation.missing.join(', ')}`,
      );
    }

    // Render email with variables and disclaimer
    const { renderedHtml, renderedSubject } = renderEmail(
      template.htmlBody,
      template.subject,
      dto.variables || {},
    );

    // Create email log entry
    const emailLog = await this.prisma.emailLog.create({
      data: {
        userId,
        templateId: template.id,
        apiKeyId,
        recipientEmail: dto.recipientEmail,
        subject: renderedSubject,
        htmlBody: renderedHtml,
        textBody: template.textBody,
        variables: dto.variables || {},
        fromEmail: process.env.EMAIL_FROM || 'noreply@edunotifysim.com',
        replyToEmail: dto.replyToEmail,
        status: 'QUEUED',
      },
    });

    // Add job to queue
    await this.emailQueue.add(
      'send-email',
      {
        emailLogId: emailLog.id,
        recipientEmail: dto.recipientEmail,
        subject: renderedSubject,
        htmlBody: renderedHtml,
        textBody: template.textBody,
        fromEmail: emailLog.fromEmail,
        replyToEmail: dto.replyToEmail,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    );

    // Increment template usage
    await this.templatesService.incrementUsage(template.id);

    return {
      id: emailLog.id,
      status: 'QUEUED',
      message: 'Email queued for sending',
    };
  }

  /**
   * Get email analytics/stats for user
   */
  async getStats(userId: string) {
    const [total, sent, failed, pending] = await Promise.all([
      this.prisma.emailLog.count({ where: { userId } }),
      this.prisma.emailLog.count({ where: { userId, status: 'SENT' } }),
      this.prisma.emailLog.count({ where: { userId, status: 'FAILED' } }),
      this.prisma.emailLog.count({ where: { userId, status: { in: ['PENDING', 'QUEUED'] } } }),
    ]);

    return {
      total,
      sent,
      failed,
      pending,
      successRate: total > 0 ? ((sent / total) * 100).toFixed(2) : 0,
    };
  }
}
