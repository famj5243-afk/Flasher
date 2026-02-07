# Deployment Guide for Flasher Educational Platform

## ⚠️ Important Disclaimer

This platform is for **educational purposes only**. Before deploying:
- Ensure you have explicit permission from your organization
- Confirm compliance with local laws and regulations
- Do not use for real phishing, fraud, or malicious activities
- All emails must include educational disclaimers

## Deployment Options

### Option 1: Local Development (Recommended for Learning)

**Backend:**
```bash
npm install
npm start
# Server runs on http://localhost:5000
```

**Frontend:**
```bash
cd client
npm install
npm start
# React app runs on http://localhost:3000
```

### Option 2: Production Build

**Build Frontend:**
```bash
cd client
npm run build
# Creates optimized production build in client/build/
```

**Serve with Backend:**
```javascript
// Add to server/index.js after other middleware:
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}
```

**Start Production Server:**
```bash
NODE_ENV=production npm start
```

### Option 3: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy server files
COPY server ./server

# Copy client build
COPY client/build ./client/build

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server/index.js"]
```

Build and run:
```bash
docker build -t flasher-educational .
docker run -p 5000:5000 flasher-educational
```

### Option 4: Cloud Platform Deployment

#### Heroku
```bash
# Add Procfile
echo "web: node server/index.js" > Procfile

# Deploy
heroku create your-app-name
heroku config:set NODE_ENV=production
git push heroku main
```

#### Railway / Render / Fly.io
- Connect your GitHub repository
- Set build command: `cd client && npm install && npm run build && cd .. && npm install`
- Set start command: `node server/index.js`
- Set environment variables from .env.example

## Environment Variables

Required for production:
```bash
NODE_ENV=production
PORT=5000

# Email Configuration (use Ethereal or test SMTP)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-email@ethereal.email
EMAIL_PASS=your-password

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# DO NOT MODIFY
EDUCATIONAL_FOOTER="This is a simulation for educational purposes only."
```

## Security Considerations

### Before Deployment:
1. **Review all security settings**
   - Rate limiting configured
   - CORS properly set
   - Helmet security headers enabled

2. **Verify content validation**
   - Forbidden keywords list is comprehensive
   - Subject validation is active
   - Email disclaimers are mandatory

3. **Access control**
   - Consider adding authentication
   - Implement IP whitelisting if needed
   - Add usage logging

4. **Monitoring**
   - Set up error logging
   - Monitor for abuse
   - Track email sending patterns

### Production Checklist:
- [ ] All environment variables configured
- [ ] SSL/TLS certificate installed (HTTPS)
- [ ] Firewall rules configured
- [ ] Rate limiting tested
- [ ] Error logging enabled
- [ ] Backup strategy in place
- [ ] Legal compliance verified
- [ ] Educational disclaimers visible

## Maintenance

### Regular Updates:
```bash
# Update dependencies monthly
npm update
cd client && npm update

# Check for vulnerabilities
npm audit
cd client && npm audit
```

### Monitoring:
```bash
# Check logs
tail -f logs/app.log

# Monitor server health
curl http://localhost:5000/api/health
```

## Troubleshooting

### Email not sending:
- Check EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env
- Verify SMTP server is accessible
- Use Ethereal (smtp.ethereal.email) for testing

### React app not loading:
- Ensure `npm run build` completed successfully
- Check NODE_ENV is set to 'production'
- Verify static file serving is configured

### Rate limit errors:
- Adjust RATE_LIMIT_MAX_REQUESTS
- Implement user authentication for higher limits

## Support

For issues or questions:
1. Check the README.md
2. Review SECURITY.md for security concerns
3. Open a GitHub issue

---

**Remember: This is for educational purposes only. Use responsibly.**
