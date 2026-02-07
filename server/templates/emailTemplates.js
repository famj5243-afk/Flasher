/**
 * Educational Email Templates
 * 
 * These templates are for learning about email structure and design.
 * All templates include educational disclaimers.
 */

const templates = {
  welcome: {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'A simple welcome email template for educational purposes',
    subject: 'Welcome to Our Educational Platform',
    text: `Hello {{name}},

Welcome to our educational platform! We're excited to have you here.

This is a sample welcome email that demonstrates how notification emails are structured.

Best regards,
The Educational Team`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome!</h1>
    </div>
    <div class="content">
      <h2>Hello {{name}},</h2>
      <p>Welcome to our educational platform! We're excited to have you here.</p>
      <p>This is a sample welcome email that demonstrates how notification emails are structured.</p>
      <p style="text-align: center;">
        <a href="#" class="button">Get Started (Simulation Only)</a>
      </p>
      <p>Best regards,<br>The Educational Team</p>
    </div>
  </div>
</body>
</html>
    `
  },

  notification: {
    id: 'notification',
    name: 'Generic Notification',
    description: 'A general notification template for educational purposes',
    subject: 'Educational Notification: {{title}}',
    text: `Hello,

{{message}}

This is a simulated notification email for educational purposes.

Thank you,
Educational Platform`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .notification-box { background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📬 Notification</h1>
    </div>
    <div class="content">
      <h2>{{title}}</h2>
      <div class="notification-box">
        <p>{{message}}</p>
      </div>
      <p>This is a simulated notification email for educational purposes.</p>
      <p>Thank you,<br>Educational Platform</p>
    </div>
  </div>
</body>
</html>
    `
  },

  reminder: {
    id: 'reminder',
    name: 'Reminder Email',
    description: 'A reminder template for educational purposes',
    subject: 'Reminder: {{event}}',
    text: `Hello {{name}},

This is a friendly reminder about: {{event}}

Date: {{date}}
Time: {{time}}

This is a simulated reminder email for educational purposes.

Best regards,
Educational Platform`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .reminder-box { background-color: #fff3e0; border: 2px solid #FF9800; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .detail { margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Reminder</h1>
    </div>
    <div class="content">
      <h2>Hello {{name}},</h2>
      <p>This is a friendly reminder about:</p>
      <div class="reminder-box">
        <h3>{{event}}</h3>
        <div class="detail"><strong>Date:</strong> {{date}}</div>
        <div class="detail"><strong>Time:</strong> {{time}}</div>
      </div>
      <p>This is a simulated reminder email for educational purposes.</p>
      <p>Best regards,<br>Educational Platform</p>
    </div>
  </div>
</body>
</html>
    `
  }
};

/**
 * Replace template variables with actual values
 */
function renderTemplate(template, variables) {
  let rendered = {
    subject: template.subject,
    text: template.text,
    html: template.html
  };

  // Replace all {{variable}} placeholders
  Object.keys(variables).forEach(key => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    rendered.subject = rendered.subject.replace(placeholder, variables[key]);
    rendered.text = rendered.text.replace(placeholder, variables[key]);
    rendered.html = rendered.html.replace(placeholder, variables[key]);
  });

  return rendered;
}

module.exports = {
  templates,
  renderTemplate
};
