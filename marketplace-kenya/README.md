# Kenya Marketplace - AI-Powered Multi-Vendor SaaS Platform

A production-ready, AI-powered multi-vendor marketplace platform built for Kenya with Express.js backend (Render), Next.js 15 frontend (Cloudflare Pages), React, TypeScript, Tailwind CSS, Shadcn UI, Supabase, PostgreSQL, OpenAI, Google Gemini, and PayHero integration.

## 🏗️ Architecture

**Frontend (Cloudflare Pages):**
- Next.js 15 with React 18 and TypeScript
- Tailwind CSS and Shadcn UI
- API client for Express backend

**Backend (Render):**
- Express.js REST API
- Supabase for database and auth
- OpenAI and Google Gemini for AI features
- PayHero for M-Pesa payments

**Database (Supabase):**
- PostgreSQL with Row Level Security (RLS)
- Multi-tenant architecture
- Real-time subscriptions

## 🚀 Features

### Core Platform
- **Multi-Role Authentication**: Buyers, Sellers, and Admins with role-based access control
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Google OAuth**: Social login integration
- **MFA Support**: Multi-factor authentication for admins
- **OTP Verification**: Phone number verification via SMS

### Buyer Features
- Browse and search products
- AI-powered smart search
- View product details
- Chat with sellers in real-time
- Save favorites
- Write reviews and ratings
- Product recommendations
- Mobile-responsive dashboard
- Profile management
- Order history
- Report scam listings

### Seller Features
- Create and manage listings
- Upload product images
- AI listing generator (titles, descriptions, SEO tags, hashtags)
- AI SEO generator
- Seller analytics dashboard
- Package subscriptions (Starter, Business, Premium)
- Real-time messaging
- Notifications
- Product editing and deletion
- Listing statistics

### Admin Features
- Complete platform control
- User management (buyers, sellers, admins)
- Listing approval workflow
- Subscription management
- Payment management
- Package management
- Analytics dashboard
- Fraud monitoring
- AI moderation center
- Security dashboard
- Reports management
- Support center
- Audit logs
- Role management
- Seller verification
- Refund management
- User banning
- IP blocking
- Suspicious activity monitoring

### AI Features
- **AI Listing Generator**: Generate titles, descriptions, SEO tags, and hashtags
- **AI Smart Search**: Natural language understanding with location, price, and category filters
- **AI Recommendations**: Similar products, trending products, nearby products
- **AI Moderation**: Detect scams, spam, fake products, inappropriate content
- **AI Fraud Detection**: Identify suspicious accounts, fake listings, duplicate uploads, bot activity
- **AI Chatbot**: Support assistant, seller assistant, FAQ automation

### Payment Integration
- **PayHero STK Push**: M-Pesa integration for seamless payments
- **Secure Callbacks**: Webhook validation and verification
- **Transaction Validation**: Prevent replay attacks and duplicate transactions
- **Package Activation**: Automatic subscription activation on successful payment

### Security Features
- HTTPS enforcement
- Cloudflare WAF integration
- DDoS protection
- Rate limiting
- JWT validation
- Session monitoring
- Device tracking
- IP tracking
- Suspicious login detection
- Auto account suspension
- Comprehensive audit logs
- SQL injection protection
- XSS protection
- CSRF protection
- File upload validation
- Malware scanning
- Secure API middleware
- AES-256 encryption
- Secure environment variables
- Secure webhooks

### Multi-Tenant Architecture
- Row Level Security (RLS) with Supabase
- Tenant isolation
- Secure policies
- Cross-tenant data leak prevention

### Real-Time Features
- Real-time messaging with Supabase Realtime
- Real-time notifications
- Payment updates
- Admin alerts
- Fraud alerts

### File Storage
- Supabase Storage integration
- Image upload and management
- File type validation
- File size limits
- Malware scanning

### Notification System
- Email notifications (Resend)
- SMS notifications (Africa's Talking)
- Push notifications
- In-app notifications
- WhatsApp integration

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Animations**: Framer Motion
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth, JWT
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **AI**: OpenAI GPT-4
- **Payments**: PayHero (M-Pesa)
- **Email**: Resend
- **SMS**: Africa's Talking
- **Deployment**: Vercel (Frontend), Supabase (Backend)
- **Security**: Cloudflare

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- PayHero account

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd marketplace
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

OPENAI_API_KEY=your_openai_api_key

PAYHERO_API_KEY=your_payhero_api_key
PAYHERO_CHANNEL_ID=your_payhero_channel_id
PAYHERO_CALLBACK_URL=https://your-domain.com/api/payhero/callback

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

RESEND_API_KEY=your_resend_api_key
AFRICASTALKING_API_KEY=your_africastalking_api_key
AFRICASTALKING_USERNAME=your_africastalking_username

JWT_SECRET=your_jwt_secret_key_here

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up Supabase database**
```bash
# Apply the database migration
supabase db push
```

Or manually run the SQL migration file:
`supabase/migrations/001_initial_schema.sql`

5. **Create Supabase Storage bucket**
- Create a bucket named `marketplace-images`
- Make it public
- Set up appropriate RLS policies

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The platform uses PostgreSQL with the following main tables:

- `users` - User accounts
- `buyers` - Buyer profiles
- `sellers` - Seller profiles
- `admins` - Admin profiles
- `packages` - Subscription packages
- `subscriptions` - Active subscriptions
- `listings` - Product listings
- `listing_images` - Listing images
- `payments` - Payment records
- `messages` - User messages
- `reviews` - Product reviews
- `favorites` - User favorites
- `notifications` - User notifications
- `audit_logs` - Audit trail
- `security_logs` - Security events
- `reports` - User reports
- `support_tickets` - Support tickets
- `support_responses` - Support ticket responses
- `ai_logs` - AI usage logs

All tables include:
- `tenant_id` for multi-tenant isolation
- `created_at` timestamp
- `updated_at` timestamp

## 🔐 Security

The platform implements enterprise-grade security:

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row Level Security (RLS)
- **Encryption**: AES-256 for sensitive data
- **Input Validation**: Sanitization and validation
- **Rate Limiting**: API rate limiting
- **Monitoring**: Security event logging
- **Fraud Detection**: AI-powered fraud detection
- **Content Moderation**: AI-powered content moderation

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Backend (Supabase)

1. Create Supabase project
2. Run database migrations
3. Set up storage buckets
4. Configure auth providers
5. Set up environment variables

### Security (Cloudflare)

1. Add domain to Cloudflare
2. Configure WAF rules
3. Set up DDoS protection
4. Configure SSL/TLS
5. Set up rate limiting

## 📱 Mobile Responsiveness

The platform is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, email support@kenyamarketplace.com or open an issue in the repository.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced AI features
- [ ] Integration with more payment gateways
- [ ] Advanced fraud detection
- [ ] Seller verification system
- [ ] Escrow payment system
- [ ] Delivery tracking
- [ ] Advanced search filters
- [ ] Product comparison
- [ ] Wishlist sharing
- [ ] Social sharing integration
- [ ] Advanced notification system
- [ ] Chatbot integration
- [ ] Voice search
- [ ] Image search
- [ ] AR product preview
- [ ] Video listings
- [ ] Live streaming
- [ ] Auction system
- [ ] Bulk listing tools
- [ ] Inventory management
- [ ] Order management
- [ ] Shipping integration
- [ ] Tax calculation
- [ ] Multi-currency support
- [ ] Multi-language support
- [ ] Advanced reporting
- [ ] API for third-party integrations
- [ ] Webhook system
- [ ] Plugin system
- [ ] Theme customization
- [] White-label solution
