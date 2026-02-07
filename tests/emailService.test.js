const emailService = require('../server/utils/emailService');

describe('Email Service', () => {
  describe('validateEmailOptions', () => {
    test('should reject emails with forbidden keywords', () => {
      const options = {
        to: 'test@example.com',
        subject: 'PayPal Account Verification',
        text: 'Click here to verify your account'
      };
      
      const errors = emailService.validateEmailOptions(options);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('forbidden keyword'))).toBe(true);
    });

    test('should accept educational content', () => {
      const options = {
        to: 'student@example.com',
        subject: 'Welcome to our educational platform',
        text: 'This is a test email for learning purposes'
      };
      
      const errors = emailService.validateEmailOptions(options);
      expect(errors).toEqual([]);
    });

    test('should reject short subjects', () => {
      const options = {
        to: 'test@example.com',
        subject: 'Hi',
        text: 'Test message'
      };
      
      const errors = emailService.validateEmailOptions(options);
      expect(errors.some(e => e.includes('at least 5 characters'))).toBe(true);
    });
  });

  describe('addEducationalFooter', () => {
    test('should add disclaimer footer to HTML', () => {
      const html = '<p>Test email</p>';
      const result = emailService.addEducationalFooter(html);
      
      expect(result).toContain('This is a simulation for educational purposes only');
      expect(result).toContain(html);
    });
  });
});
