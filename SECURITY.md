# Security Policy

## Educational Platform Disclaimer

This is a simulation platform for educational purposes only. It is designed to help students learn about:
- Email system architecture
- Web application development
- API design and security
- Frontend/backend integration

**This platform must NOT be used for:**
- Impersonating real companies or individuals
- Simulating real financial transactions
- Phishing or social engineering attacks
- Any fraudulent or malicious activities

## Security Features

### Content Validation
All email content is validated to prevent:
- Impersonation of real companies (PayPal, Amazon, Apple, etc.)
- Fraudulent keywords and phrases
- Misleading subject lines
- Suspicious domain targeting

### Mandatory Disclaimers
Every email sent includes:
- `[SIMULATION]` prefix in subject line
- Educational disclaimer footer: "This is a simulation for educational purposes only."
- Warning banner in HTML emails
- HTTP security headers

### Rate Limiting
- 100 requests per 15 minutes per IP address (default)
- Prevents abuse and spam
- Configurable via environment variables

### Input Validation
- Joi schema validation for all inputs
- Email address validation
- Content length limits
- XSS prevention

### Security Headers
- Helmet.js for HTTP security headers
- CORS configuration
- Content Security Policy

## Reporting Security Issues

If you discover a security vulnerability, please report it by:
1. Opening a GitHub issue with the tag "security"
2. Providing detailed information about the vulnerability
3. Suggesting potential fixes if possible

**Do not exploit vulnerabilities for malicious purposes.**

## Compliance

### Educational Use Only
This platform is designed exclusively for educational environments:
- Computer science courses
- Web development bootcamps
- Security awareness training (authorized only)
- Email system demonstrations

### Prohibited Uses
- Real phishing campaigns
- Social engineering attacks
- Identity theft or impersonation
- Financial fraud
- Any illegal activities

### Responsible Disclosure
Users must:
- Use only with explicit permission
- Include disclaimers in all communications
- Not target real organizations
- Follow local laws and regulations

## Security Updates

This project may receive security updates. Users should:
- Keep dependencies updated
- Monitor for security advisories
- Apply patches promptly
- Review code changes before deployment

## Contact

For security concerns, open a GitHub issue with the "security" label.

---

**Remember: This is a simulation for educational purposes only.**
