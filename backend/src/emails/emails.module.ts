import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { TemplatesModule } from '../templates/templates.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-queue',
    }),
    TemplatesModule,
  ],
  controllers: [EmailsController],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
