import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';
import { TemplatesModule } from './templates/templates.module';
import { EmailsModule } from './emails/emails.module';
import { LogsModule } from './logs/logs.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    
    // Redis/Bull queue
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
    
    // Application modules
    PrismaModule,
    AuthModule,
    TemplatesModule,
    EmailsModule,
    LogsModule,
    ApiKeysModule,
    QueueModule,
  ],
})
export class AppModule {}
