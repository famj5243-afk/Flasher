# EduNotify Sim - Educational Email Notification Platform

A complete SaaS platform for sending simulated, educational notification emails for testing and learning purposes. **All emails include mandatory disclaimers and are strictly for educational use.**

> 🎉 **STATUS: FULLY FUNCTIONAL & PRODUCTION-READY**  
> All planned features have been implemented! See [WHAT_NEXT.md](./WHAT_NEXT.md) for deployment and enhancement options.

## ✅ Complete Feature Set

**Frontend (12 Pages)**
- ✅ Landing page with features showcase
- ✅ Authentication (Login, Register)
- ✅ Dashboard with statistics and recent activity
- ✅ Templates management (List, Create, Edit, View)
- ✅ Send Email with live preview
- ✅ Email Logs with filtering and export
- ✅ Settings (Profile, API Keys)

**Backend (6 Modules)**
- ✅ Authentication with JWT and refresh tokens
- ✅ Email templates CRUD with categories
- ✅ Email sending with BullMQ queue
- ✅ Activity logging with pagination
- ✅ API key management
- ✅ Rate limiting and security

**Infrastructure**
- ✅ PostgreSQL database with Prisma ORM
- ✅ Redis + BullMQ for job processing
- ✅ SendGrid email integration
- ✅ Docker Compose for development
- ✅ Complete documentation (11 files)

## 🎯 Features

### Core Features
- ✅ **User Authentication**: Register, login, JWT-based auth with refresh tokens
- ✅ **Template Management**: Full CRUD with categories, variables, and preview
- ✅ **Email Sending**: Interactive form with live preview and variable filling
- ✅ **Activity Logs**: Searchable history with filtering and CSV export
- ✅ **API Keys**: Generate, manage, and revoke keys for external integrations
- ✅ **Queue System**: Redis + BullMQ for reliable email delivery
- ✅ **Rate Limiting**: Prevent abuse with configurable rate limits
- ✅ **Dark/Light Mode**: Full theme support across all pages
- ✅ **Responsive Design**: Works on mobile, tablet, and desktop
- ✅ **Security**: Argon2 password hashing, JWT tokens, input validation
- ✅ **Educational Disclaimers**: All emails automatically include simulation warnings

### Email Categories
- Crypto Education
- E-commerce
- Banking
- Logistics
- Custom

## 🏗️ Architecture

```
Frontend (Next.js) ←→ Backend (NestJS) ←→ PostgreSQL
                            ↓
                       Redis + BullMQ
                            ↓
                      Email Provider (SendGrid)
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (recommended)
- PostgreSQL 15+ (if not using Docker)
- Redis 7+ (if not using Docker)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/famj5243-afk/Flasher.git
cd Flasher

# Start all services
docker-compose up -d

# Backend will be available at http://localhost:4000
# Frontend will be available at http://localhost:3000
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run start:dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

## 📁 Project Structure

```
├── backend/                 # NestJS backend
│   ├── prisma/             # Database schema
│   │   └── schema.prisma
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── templates/      # Email templates module
│   │   ├── emails/         # Email sending module
│   │   ├── logs/           # Activity logs module
│   │   ├── api-keys/       # API key management
│   │   ├── queue/          # BullMQ queue processor
│   │   └── common/         # Shared utilities
│   └── package.json
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities
│   └── package.json
│
├── docker-compose.yml     # Docker services config
└── ARCHITECTURE.md        # System architecture docs
```

## 🎨 Brand Colors

- **Primary**: #2563EB (blue-600) - Buttons, links
- **Primary Hover**: #1D4ED8 (blue-700)
- **Secondary**: #10B981 (emerald-500) - Success states
- **Background**: #0B1120 (dark) / #F9FAFB (light)
- **Danger**: #EF4444 (red-500)

## 🔐 Security Features

- Passwords hashed with Argon2
- JWT access tokens (15 min) + refresh tokens (7 days)
- API keys hashed with SHA-256
- Rate limiting on all endpoints
- Input validation with class-validator
- CORS configured for frontend only
- Helmet.js security headers

## 📧 Email Safety

All emails sent through this platform:

1. **Include mandatory disclaimer footer**:
   ```
   ⚠️ EDUCATIONAL SIMULATION
   This email is a simulation for educational purposes only 
   and does not represent a real transaction.
   ```

2. **Have [SIMULATION] prefix in subject line**

3. **Sent from verified domain only**: `noreply@edunotifysim.com`

4. **Cannot impersonate real companies or brands**

## 🧪 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

### Templates
- `GET /api/v1/templates` - List templates
- `POST /api/v1/templates` - Create template
- `GET /api/v1/templates/:id` - Get template
- `PATCH /api/v1/templates/:id` - Update template
- `DELETE /api/v1/templates/:id` - Delete template

### Emails
- `POST /api/v1/emails/send` - Send email
- `GET /api/v1/emails/stats` - Get email statistics

### Logs
- `GET /api/v1/logs` - List email logs (paginated)
- `GET /api/v1/logs/recent` - Get recent activity
- `GET /api/v1/logs/:id` - Get log details

### API Keys
- `GET /api/v1/api-keys` - List API keys
- `POST /api/v1/api-keys` - Generate new API key
- `PATCH /api/v1/api-keys/:id/revoke` - Revoke API key

## 🔑 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/edunotify

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@edunotifysim.com
EMAIL_FROM_NAME=EduNotify Sim

# Server
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## 📝 Sample Templates

The platform includes sample educational templates for:

1. **Crypto Education** - Simulated crypto deposit notification
2. **E-commerce** - Simulated order confirmation
3. **Banking** - Simulated transaction alert
4. **Logistics** - Simulated shipment tracking

See `/backend/prisma/seed.ts` for template examples.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 🚢 Deployment

### Backend Deployment (Production)

1. Set environment variables
2. Run database migrations: `npx prisma migrate deploy`
3. Build: `npm run build`
4. Start: `npm run start:prod`

### Frontend Deployment

Recommended: Deploy to Vercel

```bash
cd frontend
vercel deploy --prod
```

Or build manually:

```bash
npm run build
npm run start
```

## 📚 Documentation

### Getting Started
- **[What Next?](./WHAT_NEXT.md)** - Start here! Executive summary of next steps
- **[Quick Start Guide](./QUICK_START.md)** - Fast decisions and recommendations
- **[Roadmap](./ROADMAP.md)** - Visual timeline and phases

### Comprehensive Guides
- [Next Steps](./NEXT_STEPS.md) - Complete development roadmap (800+ lines)
- [System Architecture](./ARCHITECTURE.md) - Detailed system design
- [Setup Guide](./SETUP.md) - Deployment and configuration
- [API Documentation](./API.md) - Complete API reference
- [Security](./SECURITY.md) - Security fixes and best practices
- [Project Summary](./PROJECT_SUMMARY.md) - Implementation overview
- [Implementation Details](./IMPLEMENTATION_DETAILS.md) - Technical breakdown

## ⚠️ Legal Disclaimer

This platform is designed **strictly for educational and testing purposes**. Users must:

- Only send emails to their own addresses or explicitly whitelisted test domains
- Never impersonate real companies or individuals
- Never simulate real financial transactions
- Always include the mandatory educational disclaimer
- Comply with all applicable laws and regulations

The developers assume no liability for misuse of this platform.

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for guidelines.

## 📧 Support

For questions or issues, please open a GitHub issue.

---

**Made with ❤️ for education and testing**
