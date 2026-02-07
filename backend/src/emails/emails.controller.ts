import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { SendEmailDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('emails')
@UseGuards(JwtAuthGuard)
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('send')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async send(@Req() req, @Body() dto: SendEmailDto) {
    return this.emailsService.sendEmail(req.user.userId, dto);
  }

  @Get('stats')
  async getStats(@Req() req) {
    return this.emailsService.getStats(req.user.userId);
  }
}
