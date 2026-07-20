# Clove's - AI-Powered Beauty & Personal Care Platform

A modern, production-ready e-commerce platform specializing in skincare, body care, and fragrances. Clove's features an integrated AI Shopping Assistant that helps customers find products, build beauty routines, and get personalized recommendations using natural language.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js Server Actions, API Routes
- **Database**: Neon PostgreSQL with Prisma ORM
- **Authentication**: Auth.js (NextAuth v5) with Role-Based Access Control (Admin / User)
- **Media Storage**: Cloudinary
- **AI Integration**: Google Gemini API (gemini-1.5-flash)
- **State Management**: Zustand
- **Forms & Validation**: React Hook Form + Zod

## Features

### Customer Experience
- **AI Shopping Assistant**: Ask questions like *"I have dry skin, what moisturizer should I use?"* or *"Recommend a floral summer perfume"* and get tailored product suggestions.
- **Modern Shopping Cart & Checkout Flow**
- **Wishlist Management**
- **Product Reviews & Ratings**
- **Dark/Light Mode & Premium Glassmorphism UI**
- **Fully Responsive & Accessible Design**

### Admin Dashboard
- **Analytics Overview**
- **Product & Inventory Management** (Full CRUD)
- **Secure Image Uploads** (Direct to Cloudinary via Admin Panel)
- **Category & Brand Management**
- **Order & Customer Tracking**

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g., Neon, Supabase, local)
- Google Gemini API Key
- Cloudinary Account

### 1. Clone the repository
```bash
git clone https://github.com/beratnev/cloves.git
cd cloves
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy the example environment file:
```bash
cp .env.example .env
```
Open `.env` and fill in your credentials:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cloves"

# Authentication (Generate a random 32-char string)
NEXTAUTH_SECRET="your-secret-key"
APP_URL="http://localhost:3000"

# AI
GEMINI_API_KEY="your-gemini-api-key"

# Media Storage
CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
```

### 4. Initialize the Database
Push the Prisma schema to your database:
```bash
npx prisma db push
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access
Admin privileges in this project are determined strictly by the `role` field in the database. 

To create an admin account:
1. Register a normal user account on the frontend.
2. Open your database (e.g., Neon Console, Prisma Studio, or use a script).
3. Find your user record and change the `role` field to `"ADMIN"`.

Once updated, you can log in and access the `/admin` dashboard. There are no hardcoded admin credentials in the source code.

## Deployment (Vercel)

1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Add all your environment variables in the Vercel Settings.
4. Deploy!

### Custom Domain (Namecheap)
If you are deploying to a custom subdomain like `cloves.beratnev.com`, add a CNAME record in your DNS settings:
- **Type**: CNAME
- **Host**: cloves
- **Value**: `cname.vercel-dns.com` (or your specific Vercel project URL)
- **TTL**: Automatic

## License
MIT License

## Support
For support or inquiries, please contact `beratnevcanoglu@outlook.com` or open an issue on GitHub.
