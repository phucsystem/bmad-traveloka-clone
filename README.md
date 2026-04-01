# TravelClone

Budget-first travel booking PWA for young Australian travelers. Promotion-driven discovery, instant flight+hotel search, 3-step checkout.

## Key Features

- **Promotion-First Homepage** — Geolocation-aware deals, seasonal bundles, referral rewards
- **Budget-First Discovery** — "I have $500 — where can I go?" search powered by dynamic budget ranges
- **Instant Flight Search** — Real-time inventory via Amadeus API with 1-hour Redis cache (90%+ hit rate)
- **Hotel Booking** — Search + filter by price, amenities, ratings; instant availability
- **Flight + Hotel Bundles** — Admin-curated combo deals with visible savings
- **3-Step Checkout** — Search → select details → Stripe payment (client-side tokenization)
- **User Bookings** — View past/upcoming bookings, cancellation, email confirmation, receipt management
- **Admin Dashboard** — Manage inventory, create promotions, view bookings, handle refunds
- **Responsive PWA** — Mobile-first, offline support, installable on iOS/Android
- **Google OAuth** — Frictionless sign-up/sign-in via Better Auth

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router, RSC) + shadcn/ui + Tailwind CSS |
| **Backend** | NestJS 10 + Prisma 5 ORM + PostgreSQL 16 |
| **Cache** | Redis 7 (cache-aside pattern) |
| **Jobs** | BullMQ async queues (email, Amadeus sync) |
| **Auth** | Better Auth (Google OAuth, httpOnly cookies) |
| **Payment** | Stripe.js (client-side tokenization) |
| **Email** | React Email + Mailtrap |
| **Admin** | Refine (React Admin) |
| **Deploy** | Docker Compose + Nginx |
| **Monorepo** | Turborepo + pnpm workspaces |

## Project Structure

```
travelclone/
├── apps/
│   ├── web/                 Next.js 15 PWA (pages, components, layouts)
│   ├── api/                 NestJS 10 REST API (/api/v1/*)
│   └── admin/               Refine admin dashboard
├── packages/
│   ├── shared/              TypeScript types, constants, utilities
│   ├── database/            Prisma schema, migrations, seed scripts
│   ├── eslint-config/       Shared ESLint rules
│   └── tsconfig/            Shared TypeScript configs
├── nginx/                   Nginx reverse proxy + TLS config
├── docker-compose.yml       Production services
├── docker-compose.dev.yml   Development services (postgres, redis)
├── turbo.json               Monorepo build pipeline
└── pnpm-workspace.yaml      Workspace roots
```

## Prerequisites

- **Node.js 20+** ([nodejs.org](https://nodejs.org/))
- **pnpm 9+** — `npm install -g pnpm@9`
- **Docker & Docker Compose** — for PostgreSQL, Redis, Nginx
- **Git** — to clone the repository

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/travelclone.git
cd travelclone
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Setup Environment
```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your keys:
# - Amadeus API credentials
# - Stripe test keys
# - Google OAuth credentials (Better Auth)
# - Mailtrap SMTP credentials
# - Better Auth secret (generate: openssl rand -base64 32)
```

### 4. Start Databases
```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts:
- PostgreSQL 16 on localhost:5432
- Redis 7 on localhost:6379

### 5. Setup Database Schema
```bash
# Create/apply migrations
pnpm prisma migrate dev

# Seed initial data (optional)
pnpm prisma db seed
```

### 6. Start Development Server
```bash
pnpm turbo dev
```

Open in browser:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **Admin:** http://localhost:3002

Hot reload enabled on all apps.

## Available Scripts

### Development
```bash
pnpm turbo dev               # Start all apps with hot reload
pnpm turbo dev --filter=web  # Start only web app
pnpm turbo dev --filter=api  # Start only API
```

### Building & Type Checking
```bash
pnpm turbo build             # Build all apps (web, api, admin)
pnpm turbo lint              # Run ESLint across all packages
pnpm turbo typecheck         # Type-check all packages
```

### Database
```bash
pnpm prisma migrate dev      # Create & apply new migration
pnpm prisma migrate deploy   # Apply migrations (production)
pnpm prisma db seed          # Run seed script
pnpm prisma studio          # Open visual database browser (localhost:5555)
```

### Docker
```bash
docker compose -f docker-compose.dev.yml up -d      # Start dev services
docker compose -f docker-compose.dev.yml down        # Stop dev services
docker compose -f docker-compose.dev.yml logs -f api # Stream API logs
```

## Architecture Overview

### Request Flow: Flight Search
1. **Frontend (Next.js):** User enters origin, destination, dates → calls `/api/v1/flights`
2. **API (NestJS):** FlightsController receives request → checks Redis cache
3. **Cache Hit:** Return cached Amadeus results (1h TTL)
4. **Cache Miss:** Call Amadeus API → store in Redis → return results
5. **Frontend:** Render flight list via React (client-side filtering)

### Request Flow: Booking & Payment
1. **Frontend:** User selects flight/hotel → enters details → triggers checkout
2. **API:** BookingsController reserves inventory in PostgreSQL
3. **Payment:** Stripe.js (client-side) tokenizes card → sends token to API
4. **API:** PaymentsController calls Stripe API with token (card data never on server)
5. **Webhook:** Stripe sends webhook → API updates booking status → BullMQ enqueues email job
6. **Email Worker:** Async BullMQ worker sends confirmation via Mailtrap

### Authentication Flow
1. **Frontend:** User clicks "Sign in with Google"
2. **Better Auth:** Redirects to Google → user consents → redirects back with code
3. **API:** Better Auth SDK exchanges code for JWT
4. **Session:** httpOnly cookie stored (15min access token, 7-day refresh)
5. **Protected Routes:** NestJS `@UseGuards(AuthGuard)` checks cookie
6. **Admin Routes:** `@UseGuards(RolesGuard)` checks user.role === 'admin'

### Data Flow: Promotions
1. **Admin Dashboard:** Admin creates promotion (e.g., "Sydney to Melbourne -$50")
2. **API:** AdminController stores in PostgreSQL, invalidates Redis cache (`DEL promotions:active:sydney:monday`)
3. **Frontend:** Next.js requests promotions → API checks geolocation + time rules → returns matched promotions
4. **Render:** Homepage displays promotions with savings badge

See `docs/system-architecture.md` for detailed diagrams and component interactions.

## API Overview

### REST Endpoints (all under `/api/v1/`)

**Authentication**
- `POST /auth/signin` — Google OAuth (Better Auth callback)
- `POST /auth/signout` — Logout
- `GET /auth/session` — Get current session

**Flights**
- `GET /flights` — Search flights (query: origin, destination, date, passengers)
- `GET /flights/:id` — Get flight details

**Hotels**
- `GET /hotels` — Search hotels (query: city, checkin, checkout, guests)
- `GET /hotels/:id` — Get hotel details

**Bookings**
- `GET /bookings` — List user's bookings
- `POST /bookings` — Create booking (flight/hotel/bundle)
- `GET /bookings/:id` — Get booking details
- `POST /bookings/:id/cancel` — Cancel booking (if within 48h window)

**Promotions**
- `GET /promotions` — List active promotions (filters by geolocation, time)

**Admin** (role: admin)
- `GET /admin/bookings` — List all bookings
- `POST /admin/promotions` — Create promotion
- `PUT /admin/promotions/:id` — Update promotion
- `DELETE /admin/promotions/:id` — Delete promotion

All responses use standardized envelope:
```json
{
  "success": true,
  "data": { /* response data */ },
  "meta": { "page": 1, "total": 100, "limit": 20 }
}
```

Error responses include `code` (enum) and `message`:
```json
{
  "success": false,
  "error": {
    "code": "FLIGHT_NOT_FOUND",
    "message": "Flight ID not found"
  }
}
```

See `docs/system-architecture.md` for full endpoint reference.

## Documentation

- **[project-overview-pdr.md](./docs/project-overview-pdr.md)** — Product requirements (50 FRs, 23 NFRs)
- **[code-standards.md](./docs/code-standards.md)** — Naming conventions, code patterns
- **[system-architecture.md](./docs/system-architecture.md)** — Architecture, data models, ER diagrams
- **[codebase-summary.md](./docs/codebase-summary.md)** — Codebase overview
- **[project-roadmap.md](./docs/project-roadmap.md)** — Development phases and milestones
- **[design-guidelines.md](./docs/design-guidelines.md)** — Design system, colors, typography

## Deployment

### Local Docker Compose (Development)
```bash
docker compose -f docker-compose.dev.yml up -d
```

### Production Docker Compose
```bash
docker compose -f docker-compose.yml up -d
```

Services automatically started:
- **web** (Next.js on :3000)
- **api** (NestJS on :3001)
- **admin** (Refine on :3002)
- **postgres** (on :5432)
- **redis** (on :6379)
- **nginx** (reverse proxy on :80/:443)

### Environment Setup
Before deploying, ensure `.env.local` has:
- Database credentials (DATABASE_URL)
- Redis URL (REDIS_URL)
- Stripe keys (test or production)
- OAuth credentials (Google)
- Email credentials (Mailtrap)
- Better Auth secret

### Database Migrations
```bash
# Inside docker container or locally:
pnpm prisma migrate deploy
```

## Stripe Setup (Test Mode)

1. Create Stripe account at [stripe.com](https://stripe.com)
2. Copy test keys to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_xxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```
3. Use test card numbers:
   - Visa: 4242 4242 4242 4242
   - Mastercard: 5555 5555 5555 4444
   - Any expiry, any CVC

Stripe webhook signature validated server-side; event ID stored for idempotency.

## Google OAuth Setup (Better Auth)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials (Web application)
3. Add redirect URIs:
   - http://localhost:3000/auth/callback
   - https://yourdomain.com/auth/callback
4. Copy credentials to `.env.local`:
   ```
   GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=xxx
   BETTER_AUTH_SECRET=<generate via openssl rand -base64 32>
   ```

## Performance Targets

| Metric | Target | Method |
|--------|--------|--------|
| First Contentful Paint (FCP) | < 1.5s | Next.js RSC + Redis cache |
| Search p95 latency | < 500ms | Redis 1h TTL (90%+ hit rate) |
| Budget discovery | < 3s | Indexed PostgreSQL queries |
| Lighthouse score | ≥ 90 | next/image + PWA manifest + Tailwind purge |
| Cache hit rate | ≥ 90% | BullMQ cron refresh popular routes |

## License

MIT License — see LICENSE file for details.

---

**Questions?** Check `CLAUDE.md` for project context or `docs/` for detailed documentation.
