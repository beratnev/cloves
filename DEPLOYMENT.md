# Deployment Guide for AI Shop

## Prerequisites

- PostgreSQL database (Neon, Supabase, or your own)
- OpenAI API key
- Cloudinary account
- Vercel account

## Environment Variables

Set the following environment variables in your Vercel project settings:

```
DATABASE_URL=postgresql://user:password@host:port/database
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://ai-shop.beratnev.com
OPENAI_API_KEY=your-openai-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Add environment variables
5. Click "Deploy"

### 3. Configure DNS for ai-shop.beratnev.com

1. Go to your domain registrar (Namecheap, GoDaddy, etc.)
2. Add a CNAME record:
   - **Type**: CNAME
   - **Host**: ai-shop
   - **Value**: your-vercel-project.vercel.app
   - **TTL**: Automatic

### 4. Configure Custom Domain in Vercel

1. Go to your Vercel project settings
2. Click "Domains"
3. Add `ai-shop.beratnev.com`
4. Follow the DNS configuration instructions

### 5. Set Up Database

```bash
# Install dependencies
npm install

# Push schema to database
npx prisma db push

# Seed database
npx prisma db seed
```

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Test AI search functionality
- [ ] Test product comparison
- [ ] Test cart and checkout
- [ ] Test user authentication
- [ ] Test admin dashboard
- [ ] Verify SSL certificate
- [ ] Check mobile responsiveness
- [ ] Test dark mode
- [ ] Verify SEO metadata

## Monitoring

- Set up Vercel Analytics
- Configure error tracking (Sentry)
- Set up uptime monitoring
- Monitor database performance

## Scaling

- Enable Vercel Pro for better performance
- Use connection pooling for database
- Configure CDN for static assets
- Set up Redis for caching
