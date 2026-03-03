# Security Policy

## Overview
This document outlines the security measures implemented in this project and best practices for maintaining a secure application.

## Environment Variables (.env)

### Critical: Never Commit `.env` Files
- `.env` files contain sensitive credentials and secrets
- Always add `.env` to `.gitignore`
- Use `.env.example` to show required variables without exposing values
- Create your own `.env` file locally for development

### Required Credentials
Ensure the following are properly configured in your `.env` file:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (KEEP SECRET)
- `ADMIN_USERNAME` - Admin panel username
- `ADMIN_PASSWORD` - Admin panel password
- `ADMIN_EMAIL` - Admin email for notifications
- `GMAIL_APP_PASSWORD` - Gmail app-specific password
- `RESEND_API_KEY` - Email service API key
- `WHATSAPP_NUMBER` - WhatsApp business number

## Authentication & Authorization

### Admin Session Management
- Sessions use cryptographically secure tokens (not plain text)
- Tokens are stored in HttpOnly cookies (prevents XSS access)
- SameSite policy set to "strict" to prevent CSRF attacks
- Session timeout: 24 hours
- Sessions are validated on every protected route

### Rate Limiting
- Login endpoint has built-in rate limiting (5 attempts per 15 minutes)
- Tracks attempts by client IP address
- Returns 429 (Too Many Requests) when limit exceeded

### Password Comparison
- Uses `timingSafeEqual` to prevent timing attacks
- Protects against side-channel attacks during authentication

## Security Headers

### Implemented Headers
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **X-Frame-Options: DENY** - Prevents clickjacking
- **X-XSS-Protection** - Enables browser XSS protection
- **Referrer-Policy** - Controls referrer information
- **Content-Security-Policy** - Restricts resource loading
- **Permissions-Policy** - Disables dangerous features

## HTTPS Enforcement
- HTTPS is enforced in production environment
- Automatic redirect from HTTP to HTTPS in production
- Set `NODE_ENV=production` for enforcement

## API Security

### Input Validation
- All API endpoints validate input data
- Type checking on request parameters
- Reject requests with missing required fields

### CORS
- Supabase API is whitelisted in CSP
- Configure CORS properly with `next.config.ts` for external APIs

### API Routes Protection
- Admin-only routes require valid session
- All API endpoints use HTTPS in production
- Request validation prevents malformed data

## Database Security

### Supabase
- Uses JWT tokens from environment variables
- Role-based access control configured
- Service role key kept secure in `.env`

### Data Protection
- Never log sensitive data (passwords, tokens, API keys)
- Sanitize database queries to prevent SQL injection

## Deployment Security

### GitHub Repository
- `.env` files excluded via `.gitignore`
- Sensitive data never committed
- `.env.example` provides template without secrets

### Vercel / Production Deployment
1. Set environment variables in deployment dashboard
2. Never use local `.env` in production
3. Use separate credentials for production environment
4. Enable branch protection rules
5. Review deployment logs for security issues

### Environment-Specific Security
```bash
# Development
NODE_ENV=development

# Production
NODE_ENV=production
# HTTPS will be enforced automatically
```

## Security Checklist

- [ ] `.env` is in `.gitignore` and never committed
- [ ] All credentials are environment variables, not hardcoded
- [ ] Production uses separate credentials from development
- [ ] HTTPS is enforced in production
- [ ] Security headers are configured
- [ ] Rate limiting is enabled on authentication
- [ ] Sessions use secure token-based approach
- [ ] Password comparison uses timing-safe functions
- [ ] Regular security audits performed
- [ ] Dependencies are kept up to date

## Dependencies Security

### Auditing Dependencies
```bash
# Check for vulnerabilities
npm audit

# Fix automatically (may include breaking changes)
npm audit fix --force

# Review packages
npm list
```

### Keeping Dependencies Updated
```bash
# Check for updates
npm outdated

# Update packages (respects package.json versions)
npm update

# Major version updates (review before applying)
npm install <package>@latest
```

## Incident Response

If you suspect a security breach:

1. **Do NOT push updates containing exposed credentials**
2. **Immediately revoke exposed credentials** in your service dashboards
3. **Rotate credentials** in `.env`
4. **Force push** with new commits (only if no credentials in history)
5. **Monitor** for unauthorized access

## Reporting Security Issues

If you discover a security vulnerability:
1. Do not publicly disclose the vulnerability
2. Document the issue thoroughly
3. Contact the development team privately
4. Allow time for patch development
5. Coordinate public disclosure after patch is available

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/learn/seo/security)
- [Supabase Security Documentation](https://supabase.com/docs/guides/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Last Updated
March 3, 2026

---

**Remember**: Security is a continuous process, not a one-time setup. Regularly review and update security measures.
