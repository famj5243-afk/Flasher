import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

interface EmailOptions {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailSenderService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('SENDGRID_API_KEY');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
  }

  /**
   * Send email via SendGrid
   */
  async send(options: EmailOptions): Promise<{ messageId: string }> {
    try {
      // Check if SendGrid is configured
      const apiKey = this.configService.get('SENDGRID_API_KEY');
      if (!apiKey) {
        console.warn('⚠️ SendGrid API key not configured. Email not actually sent.');
        // In development, simulate success
        return { messageId: `mock-${Date.now()}` };
      }

      const msg = {
        to: options.to,
        from: {
          email: options.from,
          name: this.configService.get('EMAIL_FROM_NAME') || 'EduNotify Sim',
        },
        replyTo: options.replyTo,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const [response] = await sgMail.send(msg);

      return {
        messageId: response.headers['x-message-id'] || `sg-${Date.now()}`,
      };
    } catch (error) {
      console.error('SendGrid error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Alternative: Send via Mailgun (if configured instead of SendGrid)
   */
  async sendViaMailgun(options: EmailOptions): Promise<{ messageId: string }> {
    // Mailgun implementation would go here
    // For now, this is a placeholder
    throw new Error('Mailgun not implemented. Use SendGrid.');
  }
}
