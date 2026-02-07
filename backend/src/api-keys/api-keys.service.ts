import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createHash, randomBytes } from 'crypto';
import { CreateApiKeyDto } from './dto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate a new API key
   */
  async create(userId: string, dto: CreateApiKeyDto) {
    // Generate random API key
    const apiKey = `edunotify_${randomBytes(32).toString('hex')}`;
    const keyHash = this.hashApiKey(apiKey);
    const keyPrefix = apiKey.substring(0, 16); // For display purposes

    const createdKey = await this.prisma.apiKey.create({
      data: {
        userId,
        name: dto.name,
        keyHash,
        keyPrefix,
        permissions: dto.permissions || ['send_email', 'read_logs'],
        rateLimit: dto.rateLimit || 50,
      },
    });

    // Return the plain API key ONLY ONCE
    return {
      ...createdKey,
      apiKey, // Plain key returned only once
      keyHash: undefined, // Don't expose hash
    };
  }

  /**
   * List all API keys for a user (without plain keys)
   */
  async findAll(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        permissions: true,
        rateLimit: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
      },
    });
  }

  /**
   * Revoke an API key
   */
  async revoke(id: string, userId: string) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    if (apiKey.userId !== userId) {
      throw new ForbiddenException('You can only revoke your own API keys');
    }

    return this.prisma.apiKey.update({
      where: { id },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Validate API key and return user info
   */
  async validateApiKey(apiKey: string) {
    const keyHash = this.hashApiKey(apiKey);

    const key = await this.prisma.apiKey.findUnique({
      where: { keyHash },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!key || !key.isActive) {
      return null;
    }

    // Check expiration
    if (key.expiresAt && key.expiresAt < new Date()) {
      return null;
    }

    // Update last used timestamp
    await this.prisma.apiKey.update({
      where: { id: key.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      keyId: key.id,
      userId: key.userId,
      permissions: key.permissions,
      rateLimit: key.rateLimit,
      user: key.user,
    };
  }

  /**
   * Hash API key using SHA-256
   */
  private hashApiKey(apiKey: string): string {
    return createHash('sha256').update(apiKey).digest('hex');
  }
}
