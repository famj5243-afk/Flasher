const emailService = require('../utils/emailService');

/**
 * Email Controller - Handles email sending operations
 */
class EmailController {
  /**
   * Send a simulated educational email
   */
  async sendEmail(req, res) {
    try {
      const { to, subject, text, html, from } = req.body;

      const result = await emailService.sendEmail({
        to,
        subject,
        text,
        html,
        from
      });

      res.status(200).json({
        message: 'Educational simulation email sent successfully',
        data: result,
        disclaimer: 'This is a simulation for educational purposes only.'
      });
    } catch (error) {
      console.error('Error sending email:', error.message);
      res.status(400).json({
        error: error.message,
        disclaimer: 'This is a simulation for educational purposes only.'
      });
    }
  }

  /**
   * Get email sending status/info
   */
  async getStatus(req, res) {
    res.json({
      status: 'operational',
      service: 'Educational Email Simulation',
      disclaimer: 'This is a simulation for educational purposes only.',
      features: [
        'Customizable email templates',
        'Educational disclaimers on all emails',
        'Content validation to prevent fraud',
        'Rate limiting for security'
      ]
    });
  }
}

module.exports = new EmailController();
