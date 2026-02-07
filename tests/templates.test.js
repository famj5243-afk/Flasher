const { templates, renderTemplate } = require('../server/templates/emailTemplates');

describe('Email Templates', () => {
  test('should have required templates', () => {
    expect(templates.welcome).toBeDefined();
    expect(templates.notification).toBeDefined();
    expect(templates.reminder).toBeDefined();
  });

  test('should render template with variables', () => {
    const result = renderTemplate(templates.welcome, {
      name: 'John Doe'
    });
    
    expect(result.subject).toContain('Welcome');
    expect(result.text).toContain('John Doe');
    expect(result.html).toContain('John Doe');
  });

  test('should handle multiple variables', () => {
    const result = renderTemplate(templates.reminder, {
      name: 'Jane',
      event: 'Test Event',
      date: '2024-01-15',
      time: '10:00 AM'
    });
    
    expect(result.text).toContain('Jane');
    expect(result.text).toContain('Test Event');
    expect(result.text).toContain('2024-01-15');
    expect(result.text).toContain('10:00 AM');
  });
});
