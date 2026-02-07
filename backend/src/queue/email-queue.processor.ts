import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailSenderService } from './email-sender.service';

interface EmailJob {
  emailLogId: string;
  recipientEmail: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  fromEmail: string;
  replyToEmail?: string;
}

@Injectable()
@Processor('email-queue')
export class EmailQueueProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private emailSender: EmailSenderService,
  ) {
    super();
  }

  async process(job: Job<EmailJob>): Promise<any> {
    console.log(`Processing email job ${job.id} for log ${job.data.emailLogId}`);

    try {
      // Update status to PENDING
      await this.prisma.emailLog.update({
        where: { id: job.data.emailLogId },
        data: { status: 'PENDING' },
      });

      // Send email via email provider
      const result = await this.emailSender.send({
        to: job.data.recipientEmail,
        from: job.data.fromEmail,
        replyTo: job.data.replyToEmail,
        subject: job.data.subject,
        html: job.data.htmlBody,
        text: job.data.textBody,
      });

      // Update log with success
      await this.prisma.emailLog.update({
        where: { id: job.data.emailLogId },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          externalId: result.messageId,
        },
      });

      console.log(`✅ Email sent successfully: ${job.data.emailLogId}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(`❌ Failed to send email ${job.data.emailLogId}:`, error);

      // Update log with failure
      await this.prisma.emailLog.update({
        where: { id: job.data.emailLogId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });

      throw error; // Re-throw to trigger retry
    }
  }
}
