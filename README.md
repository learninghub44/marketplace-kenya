# Sokoni Kenya

![License](https://img.shields.io/badge/license-Proprietary-red)
![Node](https://img.shields.info/badge/node-%3E%3D18-green)
![Database](https://img.shields.io/badge/database-PostgreSQL_(Supabase)-blue)
![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Pages-orange)

A modern enterprise marketplace platform designed for the Kenyan market, connecting buyers and sellers across the country with secure transactions, verified sellers, and AI-powered features. Built and maintained with cutting-edge web technologies to provide a trusted, professional e-commerce experience.

A Next.js 15 (React 18 + TypeScript) frontend backed by an Express API and Supabase (PostgreSQL), enabling seamless buying and selling with role-based dashboards for buyers, sellers, and administrators. Features include real-time messaging, AI-powered recommendations, secure payments via PayHero, and comprehensive seller verification.

## Landing page

![Landing Page](docs/screenshots/landing.png)

Screenshots above are placeholders — drop your own PNGs into `docs/screenshots/` using the filenames referenced in this README (landing.png, browse-listings.png, product-detail.png, seller-dashboard.png, buyer-dashboard.png, admin-panel.png) and they'll render here automatically on GitHub.

## Features

- **Secure Marketplace**: Verified sellers, buyer protection, and fraud prevention
- **Real-Time Messaging**: In-app messaging between buyers and sellers
- **AI-Powered Recommendations**: Intelligent product suggestions using Groq SDK
- **Secure Payments**: Integrated with PayHero for safe transactions
- **Seller Verification**: Multi-step verification process for trusted sellers
- **Advanced Search**: Filter by category, location, price, and more
- **Favorites System**: Save and track favorite listings
- **Admin Dashboard**: Comprehensive platform management and analytics
- **Seller Dashboard**: Inventory management, order tracking, and analytics
- **Buyer Dashboard**: Order history, saved items, and account management
- **Responsive Design**: Mobile-first design optimized for all devices

## Tech Stack

- **Next.js 15**: React framework with App Router, server components, and optimized performance
- **React 18**: Latest React with concurrent features and improved performance
- **TypeScript**: Type-safe development with strict configuration
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Radix UI**: Unstyled, accessible component primitives for complex UI patterns
- **Supabase**: PostgreSQL database with real-time subscriptions, authentication, and storage
- **Express**: Backend API server with RESTful endpoints
- **Zustand**: Lightweight state management for client-side state
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation with TypeScript inference
- **Resend**: Email service for transactional emails
- **Groq SDK**: AI-powered recommendations and features

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase project with PostgreSQL database
- PayHero account for payments
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/learninghub44/marketplace-kenya.git
   cd marketplace-kenya
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3001
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_SERVICE_KEY=your-supabase-service-key
   JWT_SECRET=your-jwt-secret
   PAYHERO_API_KEY=your-payhero-api-key
   RESEND_API_KEY=your-resend-api-key
   GROQ_API_KEY=your-groq-api-key
   ```

5. **Set up the database**
   - Run the SQL setup scripts in your Supabase SQL Editor (see `supabase/` directory)
   - Create storage buckets for product images and user avatars
   - Configure Row Level Security (RLS) policies

6. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   npm run dev
   ```

8. **Build for production**
   ```bash
   npm run build
   ```

---

## Architecture

### Project Structure
```
marketplace-kenya/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard routes
│   │   ├── auth/         # Authentication pages
│   │   ├── buyer/        # Buyer dashboard routes
│   │   ├── seller/       # Seller dashboard routes
│   │   └── listings/     # Listing pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions and configurations
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript type definitions
│   └── middleware.ts     # Next.js middleware
├── backend/
│   ├── config/           # Backend configuration
│   ├── lib/              # Backend utilities
│   ├── middleware/       # Express middleware
│   ├── routes/           # API route handlers
│   └── server.js         # Express server entry point
├── public/               # Static assets
├── supabase/             # Database schemas and migrations
└── scripts/              # Build and deployment scripts
```

### Frontend Architecture
- **App Router**: Next.js 15 App Router with server and client components
- **Route Structure**: File-based routing with nested layouts
- **State Management**: Zustand for global state, React Context for component state
- **Data Fetching**: Supabase client with React Query for caching
- **Authentication**: Supabase Auth with Next.js auth helpers

### Backend Architecture
- **Express Server**: RESTful API with modular route handlers
- **Authentication**: JWT-based authentication with Supabase integration
- **Rate Limiting**: Express rate limiter for API protection
- **CORS**: Configured CORS for frontend-backend communication
- **WebSocket**: Real-time messaging support

### Database Schema
The application uses a PostgreSQL database with the following core entities:
- **users**: User accounts with roles (buyer, seller, admin)
- **listings**: Product/service listings with metadata and images
- **categories**: Product categories and subcategories
- **messages**: Real-time messaging between users
- **favorites**: User's saved listings
- **orders**: Purchase orders and transactions
- **reviews**: Product reviews and ratings
- **notifications**: User notifications and alerts

---

## Deployment

### Frontend (Cloudflare Pages)
1. Connect your repository to Cloudflare Pages
2. Configure build command: `npm run build`
3. Configure output directory: `.open-next/assets`
4. Add environment variables in Cloudflare dashboard
5. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your repository to Render
2. Configure build command: `cd backend && npm install`
3. Configure start command: `cd backend && npm start`
4. Add environment variables in Render dashboard
5. Deploy automatically on push to main branch

### Environment Variables Required

**Frontend:**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous public key
- `NEXT_PUBLIC_APP_URL`: Application URL

**Backend:**
- `PORT`: Server port (default: 3001)
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_KEY`: Supabase service role key
- `JWT_SECRET`: JWT signing secret
- `PAYHERO_API_KEY`: PayHero API key for payments
- `RESEND_API_KEY`: Resend API key for emails
- `GROQ_API_KEY`: Groq API key for AI features

### Database Considerations
- Ensure Row Level Security (RLS) is properly configured
- Use service role keys for server-side operations
- Regular backups of PostgreSQL database
- Monitor storage usage for product images
- Implement connection pooling for high traffic

---

## Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed system architecture and design decisions
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines and development workflow
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Comprehensive design system and UI guidelines
- **[REDESIGN_PLAN.md](REDESIGN_PLAN.md)** - Product redesign roadmap and strategy
- **[LICENSE](LICENSE)** - Proprietary license agreement

---

## License

This project is proprietary software. All rights are reserved. See LICENSE file for details.

---

## Support

For technical issues or questions about the platform, contact the development team through internal channels.

---

## Acknowledgments

Built for the advancement of e-commerce and digital commerce in Kenya.
