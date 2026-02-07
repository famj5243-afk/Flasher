# EduNotify Sim - API Documentation

Base URL: `http://localhost:4000/api/v1` (development)

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Tokens expire after 15 minutes. Use the refresh endpoint to get new tokens.

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe" // optional
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "clxyz123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Login

**POST** `/auth/login`

Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clxyz123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Refresh Token

**POST** `/auth/refresh`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Get Current User

**GET** `/auth/me`

Get authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "clxyz123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "emailVerified": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLoginAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Templates Endpoints

### List Templates

**GET** `/templates`

Get all templates accessible to the user (own + public).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `category` (optional): Filter by category (CRYPTO_EDUCATION, ECOMMERCE, BANKING, LOGISTICS, CUSTOM)
- `isPublic` (optional): Filter by public status (true/false)

**Response:** `200 OK`
```json
[
  {
    "id": "clxyz123",
    "name": "Crypto Deposit Notification",
    "description": "Educational simulation of crypto deposit",
    "category": "CRYPTO_EDUCATION",
    "subject": "Crypto Deposit Received - {{amount}} {{currency}}",
    "htmlBody": "<!DOCTYPE html>...",
    "textBody": "Crypto Deposit: {{amount}} {{currency}}...",
    "variables": ["name", "amount", "currency", "date", "reference_id"],
    "isActive": true,
    "isPublic": true,
    "usageCount": 15,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "clxyz456",
      "name": "Demo User",
      "email": "demo@edunotifysim.com"
    }
  }
]
```

---

### Get Template

**GET** `/templates/:id`

Get a specific template by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "clxyz123",
  "name": "Crypto Deposit Notification",
  "description": "Educational simulation of crypto deposit",
  "category": "CRYPTO_EDUCATION",
  "subject": "Crypto Deposit Received - {{amount}} {{currency}}",
  "htmlBody": "<!DOCTYPE html>...",
  "textBody": "Crypto Deposit: {{amount}} {{currency}}...",
  "variables": ["name", "amount", "currency", "date", "reference_id"],
  "isActive": true,
  "isPublic": true,
  "usageCount": 15,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "clxyz456",
    "name": "Demo User",
    "email": "demo@edunotifysim.com"
  }
}
```

---

### Create Template

**POST** `/templates`

Create a new email template.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Order Confirmation",
  "description": "E-commerce order confirmation simulation",
  "category": "ECOMMERCE",
  "subject": "Order #{{order_number}} Confirmed",
  "htmlBody": "<!DOCTYPE html><html>...",
  "textBody": "Order #{{order_number}} confirmed..."
}
```

**Response:** `201 Created`
```json
{
  "id": "clxyz789",
  "name": "Order Confirmation",
  "description": "E-commerce order confirmation simulation",
  "category": "ECOMMERCE",
  "subject": "Order #{{order_number}} Confirmed",
  "htmlBody": "<!DOCTYPE html><html>...",
  "textBody": "Order #{{order_number}} confirmed...",
  "variables": ["order_number"],
  "isActive": true,
  "isPublic": false,
  "usageCount": 0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Update Template

**PATCH** `/templates/:id`

Update an existing template.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Order Confirmation",
  "description": "Updated description",
  "isActive": true,
  "isPublic": false
}
```

**Response:** `200 OK`
```json
{
  "id": "clxyz789",
  "name": "Updated Order Confirmation",
  // ... updated fields
}
```

---

### Delete Template

**DELETE** `/templates/:id`

Delete a template.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Template deleted successfully"
}
```

---

## Emails Endpoints

### Send Email

**POST** `/emails/send`

Send an email using a template.

**Headers:** `Authorization: Bearer <token>`

**Rate Limit:** 10 requests per minute

**Request Body:**
```json
{
  "templateId": "clxyz123",
  "recipientEmail": "recipient@example.com",
  "variables": {
    "name": "John Doe",
    "amount": "1.5",
    "currency": "BTC",
    "date": "2024-01-15",
    "reference_id": "TX123456789"
  },
  "replyToEmail": "support@example.com" // optional
}
```

**Response:** `200 OK`
```json
{
  "id": "clxyz999",
  "status": "QUEUED",
  "message": "Email queued for sending"
}
```

**Error Responses:**
- `400 Bad Request`: Missing required variables
- `404 Not Found`: Template not found
- `429 Too Many Requests`: Rate limit exceeded

---

### Get Email Statistics

**GET** `/emails/stats`

Get email sending statistics for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "total": 125,
  "sent": 120,
  "failed": 3,
  "pending": 2,
  "successRate": "96.00"
}
```

---

## Logs Endpoints

### List Email Logs

**GET** `/logs`

Get paginated email logs.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status (PENDING, QUEUED, SENT, DELIVERED, FAILED, BOUNCED)
- `templateId` (optional): Filter by template ID

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "clxyz111",
      "recipientEmail": "recipient@example.com",
      "subject": "[SIMULATION] Crypto Deposit Received - 1.5 BTC",
      "status": "SENT",
      "variables": {
        "name": "John Doe",
        "amount": "1.5",
        "currency": "BTC"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "sentAt": "2024-01-15T10:30:15.000Z",
      "template": {
        "id": "clxyz123",
        "name": "Crypto Deposit Notification",
        "category": "CRYPTO_EDUCATION"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 125,
    "totalPages": 7
  }
}
```

---

### Get Recent Activity

**GET** `/logs/recent`

Get recent email activity.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional): Number of items (default: 10, max: 50)

**Response:** `200 OK`
```json
[
  {
    "id": "clxyz111",
    "recipientEmail": "recipient@example.com",
    "subject": "[SIMULATION] Crypto Deposit Received",
    "status": "SENT",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "template": {
      "name": "Crypto Deposit Notification",
      "category": "CRYPTO_EDUCATION"
    }
  }
]
```

---

### Get Log Details

**GET** `/logs/:id`

Get detailed information about a specific email log.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "clxyz111",
  "recipientEmail": "recipient@example.com",
  "subject": "[SIMULATION] Crypto Deposit Received - 1.5 BTC",
  "htmlBody": "<!DOCTYPE html>...",
  "textBody": "Crypto Deposit: 1.5 BTC...",
  "variables": {
    "name": "John Doe",
    "amount": "1.5",
    "currency": "BTC",
    "date": "2024-01-15",
    "reference_id": "TX123456789"
  },
  "fromEmail": "noreply@edunotifysim.com",
  "replyToEmail": null,
  "status": "SENT",
  "errorMessage": null,
  "externalId": "sg-123456789",
  "deliveredAt": "2024-01-15T10:30:20.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "sentAt": "2024-01-15T10:30:15.000Z",
  "template": {
    "id": "clxyz123",
    "name": "Crypto Deposit Notification",
    "category": "CRYPTO_EDUCATION"
  }
}
```

---

## API Keys Endpoints

### List API Keys

**GET** `/api-keys`

Get all API keys for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": "clxyz222",
    "name": "Production API Key",
    "keyPrefix": "edunotify_1234",
    "permissions": ["send_email", "read_logs"],
    "rateLimit": 50,
    "isActive": true,
    "lastUsedAt": "2024-01-15T10:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": null
  }
]
```

---

### Create API Key

**POST** `/api-keys`

Generate a new API key.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Production API Key",
  "permissions": ["send_email", "read_logs"], // optional
  "rateLimit": 50 // optional, emails per hour
}
```

**Response:** `201 Created`
```json
{
  "id": "clxyz222",
  "name": "Production API Key",
  "apiKey": "edunotify_1234567890abcdef...", // ⚠️ ONLY SHOWN ONCE
  "keyPrefix": "edunotify_1234",
  "permissions": ["send_email", "read_logs"],
  "rateLimit": 50,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**⚠️ Important:** The full API key is only returned once. Store it securely.

---

### Revoke API Key

**PATCH** `/api-keys/:id/revoke`

Revoke an API key.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "clxyz222",
  "isActive": false,
  "revokedAt": "2024-01-15T10:35:00.000Z"
}
```

---

## Using API Keys

To use an API key for authentication, include it in the `X-API-Key` header:

```bash
curl -X POST http://localhost:4000/api/v1/emails/send \
  -H "X-API-Key: edunotify_1234567890abcdef..." \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "clxyz123",
    "recipientEmail": "test@example.com",
    "variables": {
      "name": "John Doe",
      "amount": "1.5"
    }
  }'
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "message": "Too many requests",
  "error": "Too Many Requests"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Rate Limits

- **Authentication endpoints**: No rate limit
- **Email sending**: 10 requests per minute per user
- **Other endpoints**: 100 requests per minute per user
- **API key endpoints**: Based on key's configured rate limit

---

## Educational Disclaimer

All emails sent through this API automatically include:

1. **[SIMULATION] prefix** in the subject line
2. **Mandatory disclaimer footer** in the email body:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ⚠️ EDUCATIONAL SIMULATION
   This email is a simulation for educational purposes only 
   and does not represent a real transaction.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

These cannot be removed or modified.

---

## Example Usage

### Complete Email Sending Flow

```bash
# 1. Register user
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "name": "Test User"
  }'

# Response includes accessToken

# 2. List available templates
curl -X GET http://localhost:4000/api/v1/templates \
  -H "Authorization: Bearer <access_token>"

# 3. Send email with template
curl -X POST http://localhost:4000/api/v1/emails/send \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "clxyz123",
    "recipientEmail": "recipient@example.com",
    "variables": {
      "name": "John Doe",
      "amount": "1000.00",
      "date": "2024-01-15"
    }
  }'

# 4. Check email logs
curl -X GET "http://localhost:4000/api/v1/logs?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

---

**For support and questions:** Open an issue on GitHub
