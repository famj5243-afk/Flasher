# EduNotify Sim - System Architecture

## Overview
EduNotify Sim is an educational SaaS platform for sending simulated notification emails for testing and learning purposes. All emails include mandatory disclaimers and are strictly for educational use.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (TypeScript + TailwindCSS)             │  │
│  │  - Auth pages (login, register)                          │  │
│  │  - Dashboard & Analytics                                 │  │
│  │  - Template Builder & Editor                             │  │
│  │  - Email Preview (Desktop/Mobile)                        │  │
│  │  - Activity Logs                                         │  │
│  │  - Settings & API Key Management                         │  │
│  │  - Light/Dark Mode Support                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS/REST API
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  NestJS Backend (TypeScript)                             │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │    Auth    │  │ Templates  │  │   Emails   │         │  │
│  │  │  Module    │  │   Module   │  │   Module   │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │    Logs    │  │  API Keys  │  │Rate Limit  │         │  │
│  │  │  Module    │  │   Module   │  │  Module    │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  │                                                           │  │
│  │  Middleware:                                              │  │
│  │  - JWT Auth Guard                                        │  │
│  │  - API Key Guard                                         │  │
│  │  - Rate Limiter                                          │  │
│  │  - Input Validation                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         QUEUE LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Redis + BullMQ                                          │  │
│  │  - Email Send Queue                                      │  │
│  │  - Job Processing                                        │  │
│  │  - Retry Logic                                           │  │
│  │  - Rate Limiting State                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL + Prisma ORM                                 │  │
│  │  Tables:                                                  │  │
│  │  - users                                                  │  │
│  │  - email_templates                                        │  │
│  │  - api_keys                                               │  │
│  │  - email_logs                                             │  │
│  │  - rate_limits                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Email Provider (SendGrid / Mailgun)                     │  │
│  │  - SMTP/API Integration                                  │  │
│  │  - Delivery Tracking                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Registration & Authentication
```
User → Frontend → POST /auth/register → Backend
  → Hash password (argon2)
  → Store in PostgreSQL
  → Return JWT access + refresh tokens
  → Frontend stores tokens (httpOnly cookies)
```

### 2. Template Creation
```
User → Frontend Template Editor → POST /templates
  → Backend validates input
  → Store template in PostgreSQL
  → Return template with ID
```

### 3. Email Sending (Core Flow)
```
User → Frontend Send Form → POST /emails/send
  → Backend Auth Middleware (verify JWT/API key)
  → Rate Limit Check (Redis)
  → Load template from PostgreSQL
  → Render variables ({{name}}, {{amount}}, etc.)
  → Append educational disclaimer footer
  → Create job in BullMQ queue
  → Store log entry (status: pending)
  → Return to user (accepted)

BullMQ Worker:
  → Process job from queue
  → Send via SendGrid/Mailgun API
  → Update log entry (status: success/failed)
  → Handle retries on failure
```

### 4. Activity Logs
```
User → Frontend → GET /logs
  → Backend verifies auth
  → Query PostgreSQL with filters
  → Return paginated logs
  → Frontend displays in table
```

### 5. API Key Management
```
User → Frontend → POST /api-keys/generate
  → Backend generates random key
  → Hash key (SHA-256)
  → Store hash in PostgreSQL
  → Return plain key ONCE to user
  → User stores key for external integrations

External API Call:
  → Header: X-API-Key: <key>
  → Backend API Key Middleware
  → Hash provided key
  → Compare with stored hashes
  → Allow/Deny request
```

## Service Boundaries

### Frontend Service (Next.js)
- **Responsibility**: User interface, client-side routing, state management
- **Technology**: Next.js 14+, React 18+, TypeScript, TailwindCSS
- **Communication**: REST API calls to backend
- **Port**: 3000 (development)

### Backend Service (NestJS)
- **Responsibility**: Business logic, authentication, authorization, data validation
- **Technology**: NestJS, TypeScript, Prisma
- **Communication**: Exposes REST API, communicates with PostgreSQL and Redis
- **Port**: 4000 (development)

### Database (PostgreSQL)
- **Responsibility**: Persistent data storage
- **Technology**: PostgreSQL 15+
- **Communication**: Prisma ORM from backend
- **Port**: 5432

### Queue & Cache (Redis)
- **Responsibility**: Job queue management, rate limiting, caching
- **Technology**: Redis 7+, BullMQ
- **Communication**: Direct connection from backend
- **Port**: 6379

### Email Service (External)
- **Responsibility**: Email delivery
- **Technology**: SendGrid or Mailgun
- **Communication**: HTTP API calls from backend queue worker

## Security Architecture

### Authentication
- JWT-based authentication
- Access tokens (15 min expiry)
- Refresh tokens (7 days expiry, stored in httpOnly cookies)
- Password hashing with argon2 (salt + hash)

### Authorization
- Role-based access control (user, admin)
- Resource ownership validation
- API key-based auth for external integrations

### Input Validation
- DTOs with class-validator
- Sanitize HTML in templates
- Validate email addresses
- Check for malicious content

### Rate Limiting
- Per user: 100 emails/hour
- Per API key: 50 emails/hour
- Global: 1000 emails/hour
- Implemented with Redis + sliding window

### Security Headers
- CORS configured for frontend domain only
- Helmet.js for security headers
- HTTPS enforced in production
- CSRF protection for form submissions

## Email Safety Constraints

### Mandatory Requirements
1. **Disclaimer Footer**: All emails MUST include:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   This email is a simulation for educational purposes only 
   and does not represent a real transaction.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

2. **Sender Restrictions**:
   - No custom "from" addresses
   - All emails sent from verified domain: noreply@edunotifysim.com
   - "Reply-to" can be user's verified email

3. **Content Restrictions**:
   - No real company logos (educational placeholders only)
   - No real financial account numbers
   - Clear "SIMULATION" badge in subject line
   - Template approval system (future enhancement)

4. **Recipient Restrictions**:
   - Users can only send to their own verified emails
   - Or to explicitly whitelisted test domains
   - Email verification required for new recipients

## Scalability Considerations

### Horizontal Scaling
- Backend: Stateless, can run multiple instances behind load balancer
- Frontend: Static files on CDN
- Queue workers: Multiple workers can process jobs in parallel

### Database Optimization
- Indexes on frequently queried fields (user_id, template_id, created_at)
- Archival strategy for old logs (> 90 days)
- Read replicas for analytics queries

### Caching Strategy
- Template cache in Redis (1 hour TTL)
- User session cache
- Rate limit counters

## Monitoring & Observability

### Logging
- Structured JSON logs
- Log levels: error, warn, info, debug
- Centralized logging (e.g., ELK stack)

### Metrics
- Email send success/failure rates
- API response times
- Queue processing times
- Active users
- Template usage

### Alerts
- Email delivery failures > 10%
- API response time > 500ms
- Queue backlog > 1000 jobs
- Database connection failures

## Deployment Architecture

### Development
```
Docker Compose:
- Frontend container (Next.js dev server)
- Backend container (NestJS)
- PostgreSQL container
- Redis container
```

### Production
```
- Frontend: Vercel or AWS Amplify
- Backend: AWS ECS/Fargate or Google Cloud Run
- Database: AWS RDS PostgreSQL or Google Cloud SQL
- Redis: AWS ElastiCache or Redis Cloud
- Email: SendGrid
- CDN: CloudFront
- SSL: AWS Certificate Manager
```

## Technology Decisions

### Why NestJS?
- Built-in dependency injection
- Modular architecture
- TypeScript-first
- Excellent documentation
- Strong community

### Why Next.js?
- Server-side rendering for better SEO
- Built-in routing
- API routes (optional)
- Image optimization
- Great developer experience

### Why PostgreSQL?
- ACID compliance
- Strong JSON support
- Mature and reliable
- Good Prisma integration
- Advanced indexing

### Why Redis + BullMQ?
- Fast in-memory operations
- Reliable job queue
- Good observability
- Retry mechanisms
- Rate limiting support

### Why Prisma?
- Type-safe database access
- Auto-generated migrations
- Excellent TypeScript support
- Good query builder
- Schema visualization

## Future Enhancements

1. **Template Marketplace**: Share educational templates
2. **Two-Factor Authentication**: Enhanced security
3. **Webhook Support**: Delivery status callbacks
4. **A/B Testing**: Template variations
5. **Batch Sending**: Send to multiple recipients
6. **Scheduling**: Schedule emails for future delivery
7. **Analytics Dashboard**: Advanced email metrics
8. **Template Approval Workflow**: Admin review system
9. **White-label Support**: Custom branding for organizations
10. **Multi-language Support**: i18n for templates
