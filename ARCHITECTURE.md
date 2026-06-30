# Sokoni Kenya - System Architecture

This document provides a comprehensive overview of the Sokoni Kenya marketplace platform architecture, including system design, data flow, technology choices, and architectural decisions.

## Table of Contents
- [System Overview](#system-overview)
- [Architecture Principles](#architecture-principles)
- [Technology Stack](#technology-stack)
- [System Components](#system-components)
- [Data Architecture](#data-architecture)
- [Application Architecture](#application-architecture)
- [Security Architecture](#security-architecture)
- [Performance Architecture](#performance-architecture)
- [Deployment Architecture](#deployment-architecture)
- [Scalability Considerations](#scalability-considerations)

## System Overview

Sokoni Kenya is a modern e-commerce platform built on a decoupled architecture with a Next.js frontend and Express backend. The platform follows a three-tier architecture:

1. **Presentation Layer**: Next.js 15 with App Router, Server Components, and Client Components
2. **Application Layer**: Express.js API server with RESTful endpoints and WebSocket support
3. **Data Layer**: Supabase (PostgreSQL) with Row Level Security, authentication, and storage

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────∖       │
│  │   Browser    │  │  Mobile Web  │  │   Desktop    │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
└─────────┼──────────────────┼──────────────────┼───────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js 15 (SSR + CSR)                   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │   App       │  │ Components  │  │    State    │   │  │
│  │  │   Router    │  │             │  │  (Zustand)  │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────┘
                             │
                             │ HTTP/WebSocket
┌────────────────────────────┼────────────────────────────────┐
│                    Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js API Server                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │  Routes     │  │ Middleware  │  │   Services  │   │  │
│  │  │  (REST)     │  │  (Auth, etc)│  │  (AI, etc)  │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────┐
│                      Data Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Supabase                             │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │ PostgreSQL  │  │    Storage   │  │   Auth      │   │  │
│  │  │   Database  │  │   (Images)  │  │  Service    │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Architecture Principles

### 1. Separation of Concerns
- **Frontend**: Pure presentation logic with minimal business logic
- **Backend API**: Business logic, data processing, and integrations
- **Database**: Data persistence with RLS for security
- **External Services**: AI, payments, and email handled separately

### 2. Type Safety
- End-to-end TypeScript with strict mode
- Type-safe API interfaces between frontend and backend
- Schema validation with Zod
- Database type inference from Supabase

### 3. Performance First
- Server Components for fast initial loads
- Client Components for interactive features
- Code splitting at route level
- Intelligent caching with Supabase and Zustand

### 4. Security by Design
- Row Level Security (RLS) on all database tables
- JWT-based authentication for API
- Input validation on all endpoints
- Rate limiting and CORS protection
- Environment-based configuration

### 5. Developer Experience
- File-based routing for intuitive navigation
- Hot module replacement for fast iteration
- Comprehensive error handling
- Clear separation of server/client code

## Technology Stack

### Frontend Framework
**Next.js 15** - Chosen for:
- App Router with Server and Client Components
- Built-in server-side rendering and streaming
- File-based routing with automatic code splitting
- API routes for serverless functions
- Image optimization and font optimization
- Excellent developer experience with tooling

### Backend Framework
**Express.js** - Chosen for:
- Minimal and flexible Node.js framework
- Extensive middleware ecosystem
- RESTful API conventions
- WebSocket support for real-time features
- Easy deployment to various platforms

### State Management
**Zustand** - Chosen for:
- Lightweight and simple API
- No boilerplate or context providers
- TypeScript support out of the box
- Easy to test and debug
- Perfect for client-side state

### Database
**Supabase (PostgreSQL)** - Chosen for:
- Managed PostgreSQL with automatic backups
- Built-in authentication system
- Real-time subscriptions capability
- Row Level Security for data protection
- Storage API for file uploads
- TypeScript type generation

### UI Framework
**Radix UI + Tailwind CSS** - Chosen for:
- Unstyled, accessible components
- Full keyboard navigation support
- Customizable with Tailwind CSS
- WCAG AA compliance out of the box
- Modern design patterns

### AI Integration
**Groq SDK** - Chosen for:
- Fast AI inference
- Product recommendations
- Search enhancement
- Content generation

### Payment Integration
**PayHero** - Chosen for:
- Kenyan market focus
- Mobile money integration (M-Pesa)
- Secure payment processing
- Webhook support

## System Components

### 1. Frontend Architecture

#### Next.js App Router
- **Server Components**: Default for pages, data fetching on server
- **Client Components**: For interactive features with "use client"
- **Route Structure**: File-based routing in `src/app/`
- **Layouts**: Nested layouts for shared UI
- **Server Actions**: For mutations without API routes

#### Route Structure
```
src/app/
├── admin/           # Admin dashboard
├── auth/            # Authentication pages
├── buyer/           # Buyer dashboard
├── seller/          # Seller dashboard
├── listings/        # Listing pages
├── page.tsx         # Home page
└── layout.tsx       # Root layout
```

#### State Management
- **Zustand**: Global state (user session, cart, etc.)
- **React Context**: Component tree state
- **Server Components**: Server-side state
- **URL State**: Query params for filters

### 2. Backend Architecture

#### Express Server Structure
- **Routes**: Modular route handlers in `backend/routes/`
- **Middleware**: Authentication, rate limiting, CORS
- **Services**: Business logic and external integrations
- **Configuration**: Environment-based config

#### API Routes
```
/api/auth          # Authentication endpoints
/api/listings      # Listing CRUD operations
/api/favorites     # User favorites
/api/messages      # Real-time messaging
/api/ai            # AI-powered features
/api/admin         # Admin operations
/api/seller        # Seller-specific operations
/api/notifications # User notifications
/api/storage       # File upload operations
/api/payhero       # Payment processing
```

#### Authentication Flow
1. User registers/logs in via Supabase Auth
2. Supabase returns session token
3. Frontend stores token in secure storage
4. Backend validates JWT on protected routes
5. User context available throughout app

### 3. Component Architecture

#### Component Hierarchy
```
layout.tsx (Root Layout)
├── Header (Navigation)
├── Main Content
│   ├── page.tsx (Home)
│   ├── listings/ (Browse listings)
│   ├── auth/ (Authentication)
│   ├── buyer/ (Buyer dashboard)
│   ├── seller/ (Seller dashboard)
│   └── admin/ (Admin dashboard)
└── Footer
```

#### Component Patterns
- **Server Components**: For data-heavy pages
- **Client Components**: For interactive features
- **Compound Components**: For complex UI (forms, modals)
- **Custom Hooks**: For reusable logic
- **Higher-Order Components**: For cross-cutting concerns

### 4. Form Handling

#### React Hook Form + Zod
- **Performance**: Minimal re-renders with uncontrolled inputs
- **Validation**: Schema-based validation with Zod
- **Type Safety**: Auto-inferred types from schemas
- **Error Handling**: Built-in error state management

#### Form Schemas
```typescript
const listingSchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(50),
  price: z.number().positive(),
  categoryId: z.number(),
  // ... other fields
});
```

## Data Architecture

### Database Schema

#### Core Tables

**users**
```sql
- id: UUID PRIMARY KEY
- email: TEXT UNIQUE
- password_hash: TEXT
- role: TEXT (buyer, seller, admin)
- display_name: TEXT
- phone: TEXT
- location: TEXT
- avatar_url: TEXT
- is_verified: BOOLEAN
- verification_status: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

**listings**
```sql
- id: UUID PRIMARY KEY
- seller_id: UUID FK → users
- title: TEXT
- description: TEXT
- price: DECIMAL
- category_id: INTEGER FK → categories
- condition: TEXT (new, used, refurbished)
- location: TEXT
- latitude: DOUBLE PRECISION
- longitude: DOUBLE PRECISION
- images: TEXT[]
- status: TEXT (active, sold, pending, inactive)
- view_count: INTEGER
- favorite_count: INTEGER
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

**categories**
```sql
- id: SERIAL PRIMARY KEY
- name: TEXT UNIQUE
- slug: TEXT UNIQUE
- parent_id: INTEGER FK → categories
- icon: TEXT
- description: TEXT
```

**messages**
```sql
- id: UUID PRIMARY KEY
- sender_id: UUID FK → users
- receiver_id: UUID FK → users
- listing_id: UUID FK → listings
- content: TEXT
- is_read: BOOLEAN
- created_at: TIMESTAMPTZ
```

**favorites**
```sql
- id: UUID PRIMARY KEY
- user_id: UUID FK → users
- listing_id: UUID FK → listings
- created_at: TIMESTAMPTZ
- UNIQUE(user_id, listing_id)
```

**orders**
```sql
- id: UUID PRIMARY KEY
- buyer_id: UUID FK → users
- seller_id: UUID FK → users
- listing_id: UUID FK → listings
- status: TEXT (pending, paid, shipped, delivered, cancelled)
- total_amount: DECIMAL
- payment_id: TEXT
- shipping_address: JSONB
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

**reviews**
```sql
- id: UUID PRIMARY KEY
- order_id: UUID FK → orders
- reviewer_id: UUID FK → users
- rating: INTEGER (1-5)
- comment: TEXT
- created_at: TIMESTAMPTZ
```

**notifications**
```sql
- id: UUID PRIMARY KEY
- user_id: UUID FK → users
- type: TEXT (message, order, favorite, system)
- title: TEXT
- content: TEXT
- is_read: BOOLEAN
- created_at: TIMESTAMPTZ
```

### Database Indexes

Strategic indexes for query optimization:
```sql
idx_listings_status ON listings(status)
idx_listings_category ON listings(category_id)
idx_listings_seller ON listings(seller_id)
idx_listings_created ON listings(created_at DESC)
idx_messages_users ON messages(sender_id, receiver_id)
idx_favorites_user ON favorites(user_id)
idx_orders_buyer ON orders(buyer_id)
idx_orders_seller ON orders(seller_id)
```

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- **Public Read**: Listings, categories are publicly readable
- **Authenticated Write**: Only authenticated users can modify their data
- **Role-Based Access**: Admins have elevated permissions
- **Service Role**: Server-side operations use service role key

### Data Flow

#### Listing Creation Flow
```
1. Seller fills listing form (client-side validation)
2. Form submitted to backend API
3. Backend validates with Zod schema
4. Upload images to Supabase Storage
5. Insert listing record with all metadata
6. Return listing ID to frontend
7. Frontend redirects to listing detail page
```

#### Purchase Flow
```
1. Buyer clicks "Buy Now" on listing
2. Backend creates order record
3. Redirect to PayHero payment page
4. User completes payment
5. PayHero sends webhook to backend
6. Backend updates order status to "paid"
7. Notify seller via notification
8. Notify buyer via notification
```

#### Messaging Flow
```
1. User sends message via WebSocket
2. Backend stores message in database
3. Backend pushes message to recipient via WebSocket
4. Recipient receives real-time notification
5. Message marked as read when opened
```

## Application Architecture

### Server-Side Rendering (SSR)

#### SSR Benefits
- **SEO**: Search engines can crawl content
- **Performance**: Fast initial page load
- **Progressive Enhancement**: Works without JavaScript
- **Social Sharing**: Rich previews on social platforms

#### SSR Implementation
- Server Components fetch data on server
- HTML rendered with initial data
- Client hydrates with React
- Zustand hydrates state from server data

### Client-Side Navigation

### Client-Side Routing
- Next.js App Router handles navigation
- No full page reloads
- Prefetch linked routes
- Scroll restoration
- Browser history integration

### Code Splitting
- Each route is a separate chunk
- Loaded on-demand
- Prefetch for navigation
- Optimize bundle size

### Real-Time Features

#### WebSocket Implementation
- Express.js with ws library
- Real-time messaging between users
- Live notifications
- Connection management
- Authentication via JWT

#### Real-Time Use Cases
- Instant messaging
- Live notifications
- Order status updates
- Favorite count updates

## Security Architecture

### Authentication

#### Supabase Auth
- Email/password authentication
- OAuth providers (Google, Facebook)
- Session management
- Password reset flow
- Email verification

#### JWT Authentication
- JWT tokens for API authentication
- Token expiration and refresh
- Secure token storage
- Token validation middleware

### Authorization

#### Row Level Security
- Database-level access control
- Policies for read/write operations
- Service role for server operations
- Anon key for client operations

#### Role-Based Access Control
- **Buyer**: Can browse, purchase, message sellers
- **Seller**: Can create listings, manage inventory
- **Admin**: Full platform access and management

### Data Protection

#### Sensitive Data
- Passwords hashed with bcrypt
- JWT tokens signed with secret
- Payment data handled by PayHero
- No PII stored without consent

#### Privacy
- User data protection
- Secure file storage
- Encrypted communications
- GDPR compliance considerations

## Performance Architecture

### Caching Strategy

#### Frontend Caching
- Next.js automatic caching for static assets
- Image optimization with next/image
- Font optimization with next/font
- Route-level caching

#### Backend Caching
- Database query caching
- API response caching
- Session caching
- CDN for static assets

### Performance Optimization

#### Bundle Optimization
- Route-based code splitting
- Tree shaking for unused code
- Dynamic imports for heavy components
- Minification in production
- Gzip compression

#### Image Optimization
- Next.js Image component
- WebP format support
- Responsive images
- Lazy loading
- CDN delivery

#### Database Optimization
- Strategic indexes on frequently queried columns
- Query optimization with proper joins
- Connection pooling (Supabase managed)
- Read replicas for scaling (if needed)

## Deployment Architecture

### Frontend (Cloudflare Pages)

#### Deployment Strategy
- **Edge Network**: Global CDN for fast delivery
- **Automatic HTTPS**: SSL certificates included
- **Zero-Downtime Deployments**: Rolling updates
- **Preview Deployments**: Test changes before production

#### Build Process
- Next.js build with OpenNext
- Optimized for Cloudflare Pages
- Static asset generation
- Serverless function deployment

### Backend (Render)

#### Deployment Strategy
- **Managed Service**: Render handles infrastructure
- **Auto-scaling**: Scales based on traffic
- **Database**: Managed PostgreSQL
- **Environment Variables**: Secure configuration

#### Environment Configuration
- Separate staging/production environments
- Database migrations via Supabase
- Asset storage via Supabase Storage
- Health checks and monitoring

### Monitoring

#### Error Tracking
- Server error logging
- Client error reporting
- Performance monitoring
- Uptime monitoring

#### Analytics
- Page view tracking
- User behavior analysis
- Performance metrics
- Error rates

## Scalability Considerations

### Horizontal Scaling

#### Application Layer
- Stateless application design
- Serverless functions (Cloudflare Pages)
- Auto-scaling based on traffic
- Geographic distribution

#### Database Layer
- Supabase managed PostgreSQL
- Read replicas for read-heavy workloads
- Connection pooling
- Query optimization

### Vertical Scaling

#### Database Optimization
- Index optimization
- Query optimization
- Archive old data
- Partition large tables

#### Application Optimization
- Bundle size reduction
- Code splitting
- Lazy loading
- Caching strategies

### Future Enhancements

#### Planned Features
- Mobile app (React Native)
- GraphQL API layer
- Advanced analytics dashboard
- Machine learning for fraud detection
- Multi-language support

#### Architecture Evolution
- Microservices for specific features
- Event-driven architecture
- Advanced caching strategies
- CDN for dynamic content
- Edge computing for AI features

## Conclusion

This architecture provides a solid foundation for the Sokoni Kenya marketplace platform, balancing performance, security, and developer experience. The decoupled frontend/backend architecture allows for independent scaling and deployment, while the modern tech stack ensures fast development and excellent user experience.

For specific implementation details, refer to the source code and inline documentation.
