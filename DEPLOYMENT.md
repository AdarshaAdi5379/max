# Deployment Guide

This guide covers deploying your Next.js application to various platforms.

## Vercel Deployment (Recommended)

Vercel is the official platform for Next.js and provides the best experience.

### Prerequisites
- GitHub account with repository pushed
- Vercel account (free tier available at https://vercel.com)

### Step 1: Connect to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Connect your GitHub account and select `AdarshaAdi5379/max` repository
5. Vercel will auto-detect Next.js framework

### Step 2: Configure Environment Variables

In the Vercel dashboard, go to Settings → Environment Variables and add:

```
SUPABASE_URL=https://fkziznlgeujbwxxxcgsl.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=your-database-url
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password
ADMIN_EMAIL=your-admin-email@example.com
GMAIL_APP_PASSWORD=your-gmail-app-password
RESEND_API_KEY=your-resend-api-key
WHATSAPP_NUMBER=your-whatsapp-number
NEXT_PUBLIC_WHATSAPP_NUMBER=your-whatsapp-number
```

### Step 3: Deploy

1. Click "Deploy" button
2. Wait for build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-project.vercel.app`

### Automatic Deployments

- **Production**: Pushes to `main` branch automatically deploy
- **Preview**: Create pull requests for preview deployments
- **Development**: Use `npm run dev` locally for testing

## Docker Deployment

### Build Docker Image

```bash
# Create Dockerfile
docker build -t max-app:latest .

# Run container
docker run -p 3000:3000 \
  -e SUPABASE_URL=your-url \
  -e SUPABASE_SERVICE_ROLE_KEY=your-key \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=password \
  max-app:latest
```

## AWS Deployment

### Using Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli --upgrade --user

# Initialize
eb init -p "Node.js 18 running on 64bit Amazon Linux 2" max-app

# Create environment
eb create production

# Deploy
eb deploy
```

### Using EC2 + PM2

```bash
# Connect to EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone repository
git clone https://github.com/AdarshaAdi5379/max.git
cd max

# Install dependencies
npm install

# Create .env file
nano .env
# Add all environment variables

# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start npm --name "max-app" -- run start

# Save PM2 configuration
pm2 save
pm2 startup

# View logs
pm2 logs
```

## Railway Deployment

1. Go to [https://railway.app](https://railway.app)
2. Connect GitHub account
3. Select repository: `AdarshaAdi5379/max`
4. Add environment variables in Railway dashboard
5. Deploy automatically

## Build and Start Locally

```bash
# Install dependencies
npm install

# Build production bundle
npm run build

# Start production server
npm start

# Or use development server
npm run dev
```

## Health Check Endpoint

Add a health check endpoint for monitoring:

```bash
curl http://your-domain.com/api/health
```

## Monitoring & Logs

### Vercel
- Dashboard: https://vercel.com/dashboard
- Logs: View in "Deployments" tab

### Local/Self-hosted
- PM2 logs: `pm2 logs`
- Docker logs: `docker logs container-name`

## Performance Optimization

### Enable Caching Headers
Already configured in `next.config.ts`

### Database Connection Pooling
Configured via Supabase

### Image Optimization
Next.js automatically optimizes images served from `/public`

## Troubleshooting

### Build Fails
```bash
# Clear build cache
rm -rf .next

# Rebuild
npm run build
```

### Missing Environment Variables
Verify all variables are set in deployment platform's dashboard.

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure IP whitelist allows deployment platform

### Rate Limiting on Login
- Max 5 attempts per 15 minutes
- Wait 15 minutes before retrying

## Security Checklist for Deployment

- [ ] All environment variables configured
- [ ] `.env` file is NOT committed
- [ ] HTTPS is enforced (automatic on Vercel)
- [ ] Security headers are in place
- [ ] Rate limiting is active
- [ ] Database backups enabled
- [ ] Monitoring and logging configured
- [ ] Error reporting enabled

## Support

For issues or questions:
1. Check logs for error messages
2. Review SECURITY.md for security-related issues
3. Check Next.js documentation: https://nextjs.org/docs
4. Check Supabase documentation: https://supabase.com/docs

## Rollback

### Vercel
1. Dashboard → Deployments
2. Click on previous deployment
3. Click "Redeploy"

### Manual Deployments
```bash
git revert <commit-hash>
git push origin main
# Redeploy application
```
