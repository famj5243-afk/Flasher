# 📧 Flasher - Educational Email Simulation Platform

## ⚠️ IMPORTANT DISCLAIMER

**This platform is strictly for educational and testing purposes only.**

- ✅ **Intended Use:** Learning about email systems, web development, and notification design
- ❌ **NOT for:** Impersonating real companies, simulating real financial transactions, or enabling fraud
- 🔒 **Required:** All emails include an educational disclaimer footer

## Overview

Flasher is a complete web platform for sending customizable, simulated notification emails for educational purposes. It helps students learn about:
- Email system architecture
- Web application development (full-stack)
- API design and implementation
- Frontend/backend integration
- Security best practices

## Features

### 🎓 Educational Focus
- **Automatic Disclaimers:** All emails include "This is a simulation for educational purposes only."
- **Content Validation:** Prevents impersonation of real companies and fraudulent content
- **Security Headers:** All API responses include educational disclaimer headers
- **Rate Limiting:** Prevents abuse with configurable rate limits

### 📧 Email Capabilities
- Pre-built email templates (Welcome, Notification, Reminder)
- Customizable email content (text and HTML)
- Template variable substitution
- Preview URLs for testing (using Ethereal Email)

### 🛠 Technical Features
- **Backend:** Node.js + Express REST API
- **Frontend:** React with modern UI components
- **Email Service:** Nodemailer with Ethereal for testing
- **Security:** Helmet, CORS, rate limiting, input validation
- **Validation:** Joi schema validation

## Installation

### Prerequisites
- Node.js 14+ and npm
- Git

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/famj5243-afk/Flasher.git
cd Flasher
```

2. **Install backend dependencies:**
```bash
npm install
```

3. **Install frontend dependencies:**
```bash
cd client
npm install
cd ..
```

4. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration (optional - works with defaults)
```

5. **Start the backend server:**
```bash
npm start
# Server runs on http://localhost:5000
```

6. **In a new terminal, start the frontend:**
```bash
cd client
npm start
# React app runs on http://localhost:3000
```

## Usage

### Web Interface

1. Open your browser to `http://localhost:3000`
2. Select an email template from the list
3. Customize the email content:
   - Enter recipient email (use your own for testing)
   - Modify subject and content
   - Add HTML formatting (optional)
4. Click "Send Simulation Email"
5. View the preview URL to see the email (Ethereal Email)

### API Endpoints

#### Email Operations

**Send Email**
```bash
POST /api/emails/send
Content-Type: application/json

{
  "to": "student@example.com",
  "subject": "Test Email",
  "text": "This is a test email",
  "html": "<p>This is a test email</p>"
}
```

**Get Email Service Status**
```bash
GET /api/emails/status
```

#### Template Operations

**Get All Templates**
```bash
GET /api/templates
```

**Get Specific Template**
```bash
GET /api/templates/:id
```

**Render Template with Variables**
```bash
POST /api/templates/:id/render
Content-Type: application/json

{
  "name": "John",
  "event": "Workshop",
  "date": "2024-01-15"
}
```

## Project Structure

```
Flasher/
├── server/
│   ├── index.js                 # Express server setup
│   ├── controllers/
│   │   ├── emailController.js   # Email operations
│   │   └── templateController.js # Template operations
│   ├── routes/
│   │   ├── emailRoutes.js       # Email API routes
│   │   └── templateRoutes.js    # Template API routes
│   ├── templates/
│   │   └── emailTemplates.js    # Email templates
│   └── utils/
│       ├── emailService.js      # Email sending logic
│       └── validation.js        # Input validation
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── EmailForm.js     # Email form component
│       │   └── TemplateList.js  # Template list component
│       ├── services/
│       │   └── api.js           # API client
│       ├── App.js               # Main app component
│       └── App.css              # Styles
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Security Features

### Content Validation
The platform validates all email content to prevent:
- Impersonation of real companies (PayPal, Amazon, etc.)
- Fraudulent keywords (account suspended, verify account, etc.)
- Suspicious domain targeting
- Misleading subject lines

### Mandatory Disclaimers
All emails automatically include:
- `[SIMULATION]` prefix in subject line
- Educational disclaimer footer in email body
- Warning banner in HTML emails
- HTTP headers indicating educational platform

### Rate Limiting
- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables
- Prevents abuse and spam

## Environment Variables

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-email@ethereal.email
EMAIL_PASS=your-password

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Educational Disclaimer (DO NOT MODIFY)
EDUCATIONAL_FOOTER="This is a simulation for educational purposes only."
```

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
# Build frontend
cd client
npm run build

# The build folder will contain production-ready files
```

## Educational Use Cases

1. **Web Development Courses:** Learn full-stack development with a real-world project
2. **Email Marketing Classes:** Understand email structure and design principles
3. **Security Training:** Study email validation and security best practices
4. **API Development:** Practice RESTful API design and implementation
5. **Testing & QA:** Learn about testing email systems without real mail servers

## Contributing

This is an educational project. Contributions that enhance its educational value are welcome:
- Additional email templates
- Improved documentation
- Better validation logic
- UI/UX improvements
- Test coverage

## License

MIT License - See LICENSE file for details

## Support

For questions or issues, please open a GitHub issue.

## Acknowledgments

- Built with Node.js, Express, and React
- Email testing powered by Ethereal Email
- Created for educational purposes only

---

**Remember:** This is a simulation for educational purposes only. Do not use for real communications or to impersonate real entities. 
