# EduNotify Sim - Complete Setup Guide

## Overview

This guide covers the complete setup and deployment of the EduNotify Sim educational email platform.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Production Deployment](#production-deployment)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Email Provider Setup](#email-provider-setup)
6. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (recommended)
- PostgreSQL 15+ (if not using Docker)
- Redis 7+ (if not using Docker)

### Quick Start with Docker Compose

1. **Clone the repository**
   ```bash
   git clone https://github.com/famj5243-afk/Flasher.git
   cd Flasher
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../frontend
   cp .env.example .env.local
   # Edit .env.local with your configuration
   cd ..
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec backend npm run prisma:migrate
   ```

5. **Seed the database (optional)**
   ```bash
   docker-compose exec backend npm run prisma:seed
   ```

6. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

### Manual Setup (Without Docker)

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL and Redis connection details
   ```

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database (optional)**
   ```bash
   npm run prisma:seed
   ```

7. **Start development server**
   ```bash
   npm run start:dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with backend API URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Production Deployment

### Backend Deployment

#### Using Docker

```bash
cd backend
docker build -t edunotify-backend .
docker run -p 4000:4000 \
  -e DATABASE_URL="postgresql://..." \
  -e REDIS_HOST="..." \
  -e JWT_SECRET="..." \
  edunotify-backend
```

#### Using PM2

```bash
cd backend
npm install
npm run build
npm install -g pm2
pm2 start dist/main.js --name edunotify-backend
```

### Frontend Deployment

#### Using Vercel (Recommended)

```bash
cd frontend
npm install -g vercel
vercel deploy --prod
```

#### Using Docker

```bash
cd frontend
docker build -t edunotify-frontend .
docker run -p 3000:3000 edunotify-frontend
```

## Environment Configuration

### Backend Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/edunotify

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Provider (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@edunotifysim.com
EMAIL_FROM_NAME=EduNotify Sim

# Server
NODE_ENV=production
PORT=4000
API_PREFIX=api/v1
CORS_ORIGIN=https://your-frontend-domain.com

# Security
COOKIE_SECRET=your-cookie-secret-change-in-production

# Rate Limiting
RATE_LIMIT_TTL=3600
RATE_LIMIT_MAX=100
API_KEY_RATE_LIMIT=50
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
```

## Database Setup

### PostgreSQL

1. **Create database**
   ```sql
   CREATE DATABASE edunotify;
   CREATE USER edunotify WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE edunotify TO edunotify;
   ```

2. **Run migrations**
   ```bash
   cd backend
   npm run prisma:migrate
   ```

3. **Seed initial data**
   ```bash
   npm run prisma:seed
   ```

### Using Managed Database

For production, consider using managed PostgreSQL services:
- AWS RDS
- Google Cloud SQL
- Heroku Postgres
- Supabase
- Railway

Example connection string:
```
postgresql://username:password@hostname:5432/database?sslmode=require
```

## Email Provider Setup

### SendGrid

1. **Create SendGrid account**
   - Sign up at https://sendgrid.com

2. **Generate API Key**
   - Go to Settings → API Keys
   - Create API Key with "Mail Send" permission
   - Copy the API key

3. **Verify sender domain**
   - Go to Settings → Sender Authentication
   - Verify your domain or email address

4. **Update environment variables**
   ```env
   SENDGRID_API_KEY=SG.your-api-key
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_FROM_NAME=EduNotify Sim
   ```

### Alternative: Mailgun

1. **Create Mailgun account**
   - Sign up at https://mailgun.com

2. **Get API credentials**
   - Copy your API Key and Domain

3. **Update backend code** (in `email-sender.service.ts`)
   - Implement Mailgun integration

## Troubleshooting

### Common Issues

#### Database Connection Failed

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection string
echo $DATABASE_URL

# Test connection
docker-compose exec backend npx prisma db pull
```

#### Redis Connection Failed

```bash
# Check Redis is running
docker-compose ps redis

# Test connection
docker-compose exec redis redis-cli ping
```

#### Migration Errors

```bash
# Reset database (WARNING: Deletes all data)
npm run prisma:migrate reset

# Create new migration
npm run prisma:migrate dev --name migration_name
```

#### Email Not Sending

1. **Check SendGrid API key**
   ```bash
   echo $SENDGRID_API_KEY
   ```

2. **Verify sender email**
   - Ensure sender email is verified in SendGrid

3. **Check job queue**
   ```bash
   docker-compose logs backend | grep "email"
   ```

4. **Test email sending**
   ```bash
   curl -X POST http://localhost:4000/api/v1/emails/send \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "templateId": "template-id",
       "recipientEmail": "test@example.com",
       "variables": {}
     }'
   ```

#### Frontend Build Errors

```bash
# Clear Next.js cache
cd frontend
rm -rf .next

# Rebuild
npm run build
```

## Performance Optimization

### Backend

1. **Enable caching**
   - Add Redis caching for templates
   - Cache frequently accessed data

2. **Database optimization**
   - Add appropriate indexes
   - Use connection pooling

3. **Queue optimization**
   - Adjust BullMQ concurrency
   - Monitor queue performance

### Frontend

1. **Enable Next.js features**
   - Server-side rendering
   - Static generation
   - Image optimization

2. **CDN deployment**
   - Deploy static assets to CDN
   - Use edge caching

## Monitoring

### Logging

- Backend logs: `/var/log/edunotify-backend.log`
- Frontend logs: `/var/log/edunotify-frontend.log`

### Metrics

Monitor:
- Email send success/failure rates
- API response times
- Queue processing times
- Database query performance

### Health Checks

```bash
# Backend health
curl http://localhost:4000/health

# Redis health
docker-compose exec redis redis-cli ping

# Database health
docker-compose exec backend npx prisma db pull
```

## Security Checklist

- [ ] Change all default secrets and passwords
- [ ] Enable HTTPS in production
- [ ] Set up firewall rules
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up security headers (Helmet.js)
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Monitor for suspicious activity

## Backup and Recovery

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U edunotify edunotify > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U edunotify edunotify < backup.sql
```

### Automated Backups

Set up cron job:
```bash
0 2 * * * docker-compose exec postgres pg_dump -U edunotify edunotify > /backups/edunotify-$(date +\%Y\%m\%d).sql
```

## Support

For issues and questions:
- Open GitHub issue: https://github.com/famj5243-afk/Flasher/issues
- Check documentation: /docs
- Review logs: `docker-compose logs`

---

**Remember:** This platform is for educational purposes only. All emails must include the mandatory disclaimer and comply with applicable laws.
