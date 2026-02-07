import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailQueueProcessor } from './email-queue.processor';
import { EmailSenderService } from './email-sender.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  providers: [EmailQueueProcessor, EmailSenderService],
  exports: [EmailSenderService],
})
export class QueueModule {}
