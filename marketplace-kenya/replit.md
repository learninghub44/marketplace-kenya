# Sokoni Kenya — Mini Jumia Multi-Vendor Marketplace

A production-ready, AI-powered multi-vendor marketplace platform built for Kenya. Think Jumia meets Alibaba light — connecting buyers and sellers across all 47 counties via a full-stack Next.js + Express platform.

## Run & Operate

- Frontend (Next.js): `cd marketplace-kenya && npm run dev`
- Backend (Express): `cd marketplace-kenya/backend && npm run dev`
- Database migrations: Apply `supabase/migrations/001_initial_schema.sql` then `002_marketplace_upgrade.sql` in Supabase SQL editor

## Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, Shadcn UI, Zustand, React Query
- **Backend**: Express.js REST API, Node.js
- **Database**: Supabase (PostgreSQL + RLS + Realtime)
- **AI**: Google Gemini 1.5 Flash (primary), OpenAI GPT-3.5 (fallback)
- **Payments**: PayHero (M-Pesa STK Push)
- **Auth**: JWT + bcrypt, Google OAuth

## Where things live

- `marketplace-kenya/backend/` — Express API server
  - `routes/` — auth, listings, orders, categories, ai, seller, admin, favorites, messages, notifications, storage, payhero
  - `lib/agents.js` — 4 role-based AI agents (Product, Buyer, Fraud, Support)
  - `lib/openai.js` — AI provider wrappers (Gemini + OpenAI)
  - `middleware/auth.js` — JWT authenticate + role authorize
- `marketplace-kenya/src/` — Next.js frontend
  - `app/` — pages (listings, buyer dashboard, seller dashboard, admin, checkout, cart)
  - `components/` — ProductGallery, ProductCard, CartDrawer, Navbar, Footer
  - `store/` — Zustand stores (cart.ts, auth-store.ts, ui-store.ts)
- `marketplace-kenya/supabase/migrations/` — SQL schema

## Architecture Decisions

- JWT-based auth (not Supabase Auth) for full control over RBAC
- Role-based AI agents: sellers get ProductAssistant, buyers get BuyerAssistant, admins get FraudAgent + SupportAgent
- Cart is persisted in localStorage via Zustand persist middleware (client-side) + synced to DB on checkout
- Orders grouped by seller — one cart can create multiple orders (one per seller)
- Listings go through pending → approved/active pipeline before going public

## Product

**For Buyers**: Browse products by category/location/condition, add to cart, checkout with M-Pesa, track orders, save favorites, AI-powered search assistance.

**For Sellers**: Create listings with multiple images, AI-generated descriptions, manage orders pipeline, subscription packages (Starter/Business/Premium), earnings dashboard.

**For Admins**: Approve/reject listings, fraud detection via AI, support ticket AI assistant, user management, analytics.

## API Routes

- `POST /api/auth/register|login|logout` — authentication
- `GET|POST|PUT|DELETE /api/listings` — product listings
- `GET /api/categories` — category + subcategory tree
- `GET|POST /api/orders/cart/items` — cart management
- `POST /api/orders/checkout` — place order
- `PATCH /api/orders/:id/status` — order pipeline
- `POST /api/ai/product-assistant` — seller AI (role: seller)
- `POST /api/ai/buyer-assistant` — buyer AI (public)
- `POST /api/ai/detect-fraud` — fraud detection (role: admin)
- `POST /api/ai/support-agent` — support AI (role: admin)
- `POST /api/ai/smart-search` — smart search (public)

## User Preferences

- Orange (#FB923C) is the primary brand color
- Marketplace name: Sokoni Kenya
- M-Pesa is the primary payment method (Kenya-first)
- All prices in KES (Kenyan Shillings)

## Gotchas

- Always run migration 001 before 002 in Supabase
- Backend requires GEMINI_API_KEY env var for AI features
- Backend requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
- JWT_SECRET must match between frontend and backend
- Cart is localStorage-based; checkout syncs to DB
