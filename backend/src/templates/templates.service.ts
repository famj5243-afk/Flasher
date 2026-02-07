import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto';
import { extractVariables } from '../common/utils/template-renderer';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new email template
   */
  async create(userId: string, dto: CreateTemplateDto) {
    // Extract variables from subject and body
    const subjectVars = extractVariables(dto.subject);
    const bodyVars = extractVariables(dto.htmlBody);
    const allVariables = [...new Set([...subjectVars, ...bodyVars])];

    const template = await this.prisma.emailTemplate.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        subject: dto.subject,
        htmlBody: dto.htmlBody,
        textBody: dto.textBody,
        variables: allVariables,
      },
    });

    return template;
  }

  /**
   * Get all templates for a user
   */
  async findAll(userId: string, category?: string, isPublic?: boolean) {
    const where: any = {
      OR: [{ userId }, { isPublic: true }],
    };

    if (category) {
      where.category = category;
    }

    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }

    return this.prisma.emailTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get a single template by ID
   */
  async findOne(id: string, userId: string) {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check if user has access
    if (template.userId !== userId && !template.isPublic) {
      throw new ForbiddenException('Access denied');
    }

    return template;
  }

  /**
   * Update a template
   */
  async update(id: string, userId: string, dto: UpdateTemplateDto) {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    if (template.userId !== userId) {
      throw new ForbiddenException('You can only update your own templates');
    }

    // Re-extract variables if content changed
    let variables = template.variables;
    if (dto.subject || dto.htmlBody) {
      const subjectVars = extractVariables(dto.subject || template.subject);
      const bodyVars = extractVariables(dto.htmlBody || template.htmlBody);
      variables = [...new Set([...subjectVars, ...bodyVars])];
    }

    return this.prisma.emailTemplate.update({
      where: { id },
      data: {
        ...dto,
        variables,
      },
    });
  }

  /**
   * Delete a template
   */
  async remove(id: string, userId: string) {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    if (template.userId !== userId) {
      throw new ForbiddenException('You can only delete your own templates');
    }

    await this.prisma.emailTemplate.delete({
      where: { id },
    });

    return { message: 'Template deleted successfully' };
  }

  /**
   * Increment usage count
   */
  async incrementUsage(id: string) {
    return this.prisma.emailTemplate.update({
      where: { id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }
}
