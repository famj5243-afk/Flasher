# API Documentation - Flasher Educational Platform

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API is open (no authentication required). Consider adding authentication before production deployment.

## Rate Limiting
- **Window:** 15 minutes (configurable)
- **Max Requests:** 100 per IP (configurable)
- **Response when exceeded:** HTTP 429 with error message

## Response Format

All responses include an educational disclaimer:

```json
{
  "message": "Response message",
  "data": {},
  "disclaimer": "This is a simulation for educational purposes only."
}
```

## Endpoints

### General

#### Health Check
Get system health status.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "disclaimer": "This is a simulation for educational purposes only."
}
```

#### Platform Information
Get platform information and available endpoints.

**Endpoint:** `GET /`

**Response:**
```json
{
  "message": "Flasher - Educational Email Simulation Platform",
  "version": "1.0.0",
  "disclaimer": "This is a simulation for educational purposes only.",
  "warning": "This platform is strictly for educational and testing purposes...",
  "endpoints": {
    "health": "/api/health",
    "emails": "/api/emails",
    "templates": "/api/templates"
  }
}
```

---

### Email Operations

#### Send Email
Send a simulated educational email.

**Endpoint:** `POST /api/emails/send`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "student@example.com",
  "subject": "Welcome to our platform",
  "text": "Plain text email content",
  "html": "<html>HTML email content</html>",
  "from": "optional@sender.com"
}
```

**Validation Rules:**
- `to`: Required, valid email format
- `subject`: Required, minimum 5 characters, maximum 200 characters
- `text` or `html`: At least one required
- `text`: Minimum 10 characters, maximum 5000 characters
- `html`: Maximum 10000 characters
- `from`: Optional, valid email format

**Content Restrictions:**
The API validates content to prevent:
- Impersonation of real companies (PayPal, Amazon, banks, etc.)
- Fraudulent keywords (account suspended, verify account, etc.)
- Short or misleading subjects

**Success Response (200):**
```json
{
  "message": "Educational simulation email sent successfully",
  "data": {
    "success": true,
    "messageId": "<unique-id>",
    "previewUrl": "https://ethereal.email/message/...",
    "disclaimer": "This is a simulation for educational purposes only."
  },
  "disclaimer": "This is a simulation for educational purposes only."
}
```

**Error Response (400):**
```json
{
  "error": "Validation failed: Content contains forbidden keyword...",
  "disclaimer": "This is a simulation for educational purposes only."
}
```

**Email Modifications:**
All sent emails are automatically modified:
1. Subject prefixed with `[SIMULATION]`
2. Educational disclaimer footer appended
3. Warning banner added to HTML emails

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/emails/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "student@example.com",
    "subject": "Welcome Message",
    "text": "This is a test email for learning purposes."
  }'
```

#### Get Email Service Status
Get the status of the email service.

**Endpoint:** `GET /api/emails/status`

**Response:**
```json
{
  "status": "operational",
  "service": "Educational Email Simulation",
  "disclaimer": "This is a simulation for educational purposes only.",
  "features": [
    "Customizable email templates",
    "Educational disclaimers on all emails",
    "Content validation to prevent fraud",
    "Rate limiting for security"
  ]
}
```

---

### Template Operations

#### Get All Templates
List all available email templates.

**Endpoint:** `GET /api/templates`

**Response:**
```json
{
  "message": "Available educational email templates",
  "templates": [
    {
      "id": "welcome",
      "name": "Welcome Email",
      "description": "A simple welcome email template for educational purposes"
    },
    {
      "id": "notification",
      "name": "Generic Notification",
      "description": "A general notification template for educational purposes"
    },
    {
      "id": "reminder",
      "name": "Reminder Email",
      "description": "A reminder template for educational purposes"
    }
  ],
  "disclaimer": "This is a simulation for educational purposes only."
}
```

#### Get Template by ID
Get details of a specific template.

**Endpoint:** `GET /api/templates/:id`

**Path Parameters:**
- `id`: Template ID (welcome, notification, reminder)

**Response:**
```json
{
  "message": "Template retrieved successfully",
  "template": {
    "id": "welcome",
    "name": "Welcome Email",
    "description": "A simple welcome email template for educational purposes",
    "subject": "Welcome to Our Educational Platform",
    "text": "Hello {{name}}...",
    "html": "<!DOCTYPE html>..."
  },
  "disclaimer": "This is a simulation for educational purposes only."
}
```

**Error Response (404):**
```json
{
  "error": "Template not found",
  "availableTemplates": ["welcome", "notification", "reminder"],
  "disclaimer": "This is a simulation for educational purposes only."
}
```

#### Render Template
Render a template with provided variables.

**Endpoint:** `POST /api/templates/:id/render`

**Path Parameters:**
- `id`: Template ID

**Request Body:**
```json
{
  "name": "John Doe",
  "event": "Workshop",
  "date": "2024-01-15",
  "time": "10:00 AM"
}
```

**Response:**
```json
{
  "message": "Template rendered successfully",
  "rendered": {
    "subject": "Welcome to Our Educational Platform",
    "text": "Hello John Doe...",
    "html": "<!DOCTYPE html>..."
  },
  "disclaimer": "This is a simulation for educational purposes only."
}
```

---

## Template Variables

### Welcome Template
- `{{name}}`: Recipient name

### Notification Template
- `{{title}}`: Notification title
- `{{message}}`: Notification message

### Reminder Template
- `{{name}}`: Recipient name
- `{{event}}`: Event name
- `{{date}}`: Event date
- `{{time}}`: Event time

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request (validation failed, forbidden content) |
| 404  | Not Found (template doesn't exist) |
| 429  | Too Many Requests (rate limit exceeded) |
| 500  | Internal Server Error |

---

## Security Headers

All responses include:
- `X-Educational-Platform: true`
- `X-Disclaimer: This is a simulation for educational purposes only`

Plus standard security headers from Helmet.js:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security (in production)

---

## Example Workflows

### Workflow 1: Send Simple Email
```bash
# 1. Check health
curl http://localhost:5000/api/health

# 2. Send email
curl -X POST http://localhost:5000/api/emails/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "student@example.com",
    "subject": "Test Email",
    "text": "This is a test for learning purposes."
  }'
```

### Workflow 2: Use Template
```bash
# 1. List templates
curl http://localhost:5000/api/templates

# 2. Get template details
curl http://localhost:5000/api/templates/welcome

# 3. Render template with variables
curl -X POST http://localhost:5000/api/templates/welcome/render \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe"}'

# 4. Send rendered email
curl -X POST http://localhost:5000/api/emails/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "student@example.com",
    "subject": "Welcome to Our Educational Platform",
    "text": "Hello Jane Doe, Welcome to our platform..."
  }'
```

---

## Rate Limiting Example

After 100 requests in 15 minutes:

```bash
curl http://localhost:5000/api/health
```

**Response (429):**
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## Testing with Postman

Import this collection structure:

```json
{
  "info": {
    "name": "Flasher Educational API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/health"
      }
    },
    {
      "name": "List Templates",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/templates"
      }
    },
    {
      "name": "Send Email",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": "http://localhost:5000/api/emails/send",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"to\": \"student@example.com\",\n  \"subject\": \"Test\",\n  \"text\": \"Test message\"\n}"
        }
      }
    }
  ]
}
```

---

**Remember: This is a simulation for educational purposes only.**
