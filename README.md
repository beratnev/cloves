# AI Shop - AI-Powered E-Commerce Platform

A modern, production-ready e-commerce platform with integrated AI Shopping Assistant that helps users find products using natural language.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js Server Actions, API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Auth.js (NextAuth v5)
- **Storage**: Cloudinary
- **AI**: OpenAI API (replaceable for Gemini/Claude)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

## Features

### Core Features
- 🤖 AI Shopping Assistant with natural language search
- 📊 AI Product Comparison
- 📝 AI Product Summaries
- 🛒 Modern Shopping Cart
- ❤️ Wishlist Management
- 👤 User Authentication & Account Management
- 📦 Order Management
- ⭐ Reviews & Ratings

### Admin Features
- 📈 Analytics Dashboard
- 📦 Product Management (CRUD)
- 🏷️ Category Management
- 🎫 Coupon Management
- 📊 Order Management
- 👥 Customer Management
- 🤖 AI Content Generation (descriptions, SEO, marketing copy)

### UI/UX
- 🌙 Dark Mode & Light Mode
- 📱 Fully Responsive
- ✨ Smooth Animations (Framer Motion)
- 🎨 Premium Design (Glassmorphism)
- ♿ Accessible
- ⚡ Performance Optimized

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/beratnev/ai-shop.git
cd ai-shop
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_shop"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. **Set up the database**
```bash
npx prisma db push
npx prisma db seed
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ai-shop/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes
│   │   ├── (shop)/            # Shop routes
│   │   ├── admin/             # Admin dashboard
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   ├── shop/              # Shop components
│   │   └── admin/             # Admin components
│   ├── lib/
│   │   ├── ai/                # AI integrations
│   │   ├── auth/              # Auth configuration
│   │   ├── store/             # State management
│   │   └── utils.ts           # Utility functions
│   └── types/                 # TypeScript types
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Seed data
└── public/                    # Static assets
```

## Database Schema

The application uses PostgreSQL with the following main models:
- Users (with authentication)
- Products (with categories, images, reviews)
- Categories
- Orders & Order Items
- Reviews
- Wishlist
- Coupons
- Addresses

## AI Features

### AI Shopping Assistant
Users can search using natural language:
- "I need a gaming laptop under $1500"
- "Best headphones for music production"
- "Gift ideas for my father's birthday"

The AI understands intent, searches products, and provides personalized recommendations.

### AI Product Comparison
Select multiple products and get AI-generated comparisons:
- Performance analysis
- Pros & cons
- Best value recommendation
- Target audience suggestions

### AI Admin Tools
Generate product content automatically:
- Product descriptions
- SEO titles & meta descriptions
- Marketing copy
- Social media captions

## Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
- Import your GitHub repository
- Add environment variables
- Deploy

### DNS Configuration

To deploy to `ai-shop.beratnev.com`, add the following CNAME record in Namecheap:

```
Type: CNAME
Host: ai-shop
Value: [your-vercel-project].vercel.app
TTL: Automatic
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## License

MIT

## Support

For support, email support@ai-shop.beratnev.com or open an issue on GitHub.
