# AI Shop - Setup Instructions

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_shop"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Set Up Database

```bash
# Push schema to database
npx prisma db push

# Seed database with sample data
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```sql
   CREATE DATABASE ai_shop;
   ```
3. Update `DATABASE_URL` in `.env`

### Option 2: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Update `DATABASE_URL` in `.env`

### Option 3: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Update `DATABASE_URL` in `.env`

## Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Go to Dashboard > Account Details
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Update environment variables in `.env`

## OpenAI Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account
3. Go to API Keys
4. Create a new API key
5. Update `OPENAI_API_KEY` in `.env`

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall settings

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18+)

### Environment Variables Not Loading

- Ensure `.env` file exists
- Restart development server after adding variables
- Check for typos in variable names

## Project Structure

```
ai-shop/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes
│   │   ├── (shop)/            # Shop routes
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── robots.ts          # SEO robots.txt
│   │   └── sitemap.ts         # SEO sitemap
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   ├── shop/              # Shop components
│   │   ├── admin/             # Admin components
│   │   ├── seo/               # SEO components
│   │   └── theme-provider.tsx # Theme provider
│   ├── lib/
│   │   ├── ai/                # AI integrations
│   │   ├── auth/              # Auth configuration
│   │   ├── store/             # State management
│   │   ├── cloudinary.ts      # Cloudinary config
│   │   ├── prisma.ts          # Prisma client
│   │   ├── utils.ts           # Utility functions
│   │   └── metadata.ts        # SEO metadata
│   └── types/                 # TypeScript types
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Seed data
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind config
└── next.config.ts             # Next.js config
```
