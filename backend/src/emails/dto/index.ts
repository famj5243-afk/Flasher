import { IsString, IsEmail, IsObject, IsOptional } from 'class-validator';

export class SendEmailDto {
  @IsString()
  templateId: string;

  @IsEmail()
  recipientEmail: string;

  @IsObject()
  @IsOptional()
  variables?: Record<string, any>;

  @IsEmail()
  @IsOptional()
  replyToEmail?: string;
}
