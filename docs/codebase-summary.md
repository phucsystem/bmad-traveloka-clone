# TravelClone - Codebase Summary

**Last Updated:** April 1, 2026
**Architecture:** Turborepo monorepo with pnpm workspaces

---

## Repository Structure

```
.
├── apps/                          # Deployable applications
│   ├── web/                       # Next.js 15 frontend (PWA)
│   ├── api/                       # NestJS 10 backend API
│   └── admin/                     # Refine admin dashboard
├── packages/                      # Shared libraries
│   ├── shared/                    # TypeScript types & constants
│   ├── database/                  # Prisma schema & migrations
│   ├── eslint-config/             # Shared ESLint rules
│   └── tsconfig/                  # Shared TypeScript configs
├── pnpm-workspace.yaml            # pnpm workspaces config
├── turbo.json                     # Turborepo pipeline config
└── docker-compose.yml             # Local development stack
```

---

## Apps Overview

### apps/web - Next.js 15 Frontend

**Tech Stack**
- Next.js 15 with App Router
- React Server Components (RSC) with 'use client' boundaries
- next-pwa for PWA capabilities
- shadcn/ui component library
- Tailwind CSS for styling
- TanStack Query v5 for server state
- React Hook Form + Zod for form validation and client validation
- Better Auth React SDK for authentication

**Directory Structure**
```
apps/web/
├── app/                           # App Router directories
│   ├── (auth)/                    # Auth layout group
│   │   ├── login/
│   │   └── register/
│   ├── flights/                   # Flight booking flow
│   ├── hotels/                    # Hotel booking flow
│   ├── bookings/                  # Booking history
│   ├── profile/                   # User profile
│   ├── error.tsx                  # Error boundary
│   └── layout.tsx                 # Root layout
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── layout/                    # Navbar, footer, sidebar
│   ├── flights/                   # Flight-specific components
│   ├── hotels/                    # Hotel-specific components
│   ├── booking/                   # 3-step booking flow
│   └── shared/                    # Reusable components
├── hooks/                         # Custom React hooks
│   └── use-*.ts                   # Query hooks, form hooks
├── lib/
│   ├── api-client.ts              # Axios with auth
│   └── utils.ts                   # Helper utilities
├── styles/                        # Global CSS
├── public/                        # Static assets
├── next.config.js                 # PWA & Next.js config
└── package.json
```

**Key Features**
- Server components for search listings, reducing JS bundle
- Client components for interactive forms, filters
- Optimistic updates for booking flow
- Automatic request deduplication via TanStack Query
- PWA service worker for offline support

---

### apps/api - NestJS 10 Backend

**Tech Stack**
- NestJS 10 framework
- Prisma ORM for database access
- PostgreSQL 16 with parameterized queries
- Redis 7 for caching search results
- BullMQ for async job queues
- Pino logger with structured logging
- class-validator for input validation
- Stripe SDK for payment processing

**Module Structure**
```
apps/api/src/
├── modules/
│   ├── auth/                      # Authentication & JWT
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── strategies/
│   ├── flights/                   # Flight search & inventory
│   │   ├── flights.controller.ts
│   │   ├── flights.service.ts
│   │   └── amadeus.service.ts
│   ├── hotels/                    # Hotel search & inventory
│   │   ├── hotels.controller.ts
│   │   ├── hotels.service.ts
│   │   └── amadeus.service.ts
│   ├── bookings/                  # Booking creation & management
│   │   ├── bookings.controller.ts
│   │   ├── bookings.service.ts
│   │   └── booking-events.service.ts
│   ├── payments/                  # Stripe integration
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── stripe-webhook.handler.ts
│   ├── promotions/                # Promotion logic & application
│   │   ├── promotions.controller.ts
│   │   └── promotions.service.ts
│   ├── bundles/                   # Flight + hotel packages
│   │   ├── bundles.controller.ts
│   │   └── bundles.service.ts
│   ├── budget/                    # Budget filtering & discovery
│   │   ├── budget.service.ts
│   │   └── budget.controller.ts
│   ├── users/                     # User management
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   ├── admin/                     # Admin operations
│   │   ├── admin.controller.ts
│   │   └── admin.service.ts
│   ├── email/                     # Email notifications
│   │   ├── email.service.ts
│   │   └── email.queue.ts
│   └── cache/                     # Redis caching layer
│       └── cache.service.ts
├── common/
│   ├── filters/                   # GlobalHttpExceptionFilter
│   ├── interceptors/              # ResponseInterceptor
│   ├── pipes/                     # GlobalValidationPipe
│   ├── decorators/                # Custom decorators
│   └── exceptions/                # AppException class
├── app.module.ts                  # Root module
└── main.ts                        # NestJS bootstrap
```

**Global Middleware**
- ValidationPipe (whitelist, forbidNonWhitelisted, transform)
- HttpExceptionFilter (standardized error responses)
- ResponseInterceptor (standardized success responses)
- Logger (Pino structured logging)

**API Response Format**
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: ErrorCode
    message: string
    details?: Record<string, unknown>
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
    timestamp: string
  }
}
```

---

### apps/admin - Refine Admin Dashboard

**Tech Stack**
- Refine framework (React + TypeScript)
- Next.js for SSR
- Ant Design (antd) for UI components
- TanStack React Query for data fetching
- Refine data provider for CRUD operations

**Functionality**
- Inventory management (flights, hotels, bundles)
- Promotion campaign CRUD
- Booking event tracking and analytics
- User management and support
- Dashboard with key metrics
- Real-time inventory updates

---

## Packages Overview

### packages/shared

**Exports**
```typescript
// API response types
export interface ApiResponse<T> { ... }
export type ErrorCode = 'VALIDATION_ERROR' | 'NOT_FOUND' | 'UNAUTHORIZED' | ...

// Constants
export const API_BASE_URL = '/api/v1'
export const BOOKING_STEPS = ['select', 'details', 'payment'] as const

// Query key factory
export const queryKeys = {
  flights: (filters) => ['flights', filters],
  hotels: (filters) => ['hotels', filters],
  bookings: () => ['bookings'],
  promotions: () => ['promotions'],
}

// Type definitions
export type Flight = { ... }
export type Hotel = { ... }
export type Booking = { ... }
export type Promotion = { ... }
```

---

### packages/database

**Core Tables**
- `users` - User accounts, auth metadata
- `flights` - Flight inventory from Amadeus
- `flight_inventories` - Seat availability tracking
- `hotels` - Hotel listings from Amadeus
- `hotel_inventories` - Room availability tracking
- `bookings` - Completed bookings
- `booking_flights` - Flight legs in a booking
- `booking_hotels` - Hotel stays in a booking
- `promotions` - Discount campaigns
- `promotion_applications` - Booking-specific promotion records
- `bundles` - Pre-configured flight+hotel packages
- `booking_events` - Audit trail (created, confirmed, paid, cancelled)

**Schema Location**: `packages/database/prisma/schema.prisma`

**Migrations**: `packages/database/prisma/migrations/`

**Seeding**: `packages/database/scripts/seed.ts` - Populates test data

---

## Infrastructure

### Docker Compose Stack

```yaml
Services:
- nginx (port 80)        # Reverse proxy
- web (port 3000)        # Next.js frontend
- api (port 4000)        # NestJS backend
- admin (port 3001)      # Refine dashboard
- postgres (port 5432)   # PostgreSQL 16
- redis (port 6379)      # Redis 7 cache
```

**Nginx Routing**
```
/api/*        → http://api:4000/api/*
/admin/*      → http://admin:3001/*
/             → http://web:3000/
```

**Data Persistence**
- PostgreSQL: `volumes/postgres_data/`
- Redis: In-memory, snapshots to `volumes/redis_data/`

### GitHub Actions CI/CD

**Pipeline**
```
1. Lint (ESLint, Prettier)
2. Type Check (tsc)
3. Test (Jest, Vitest)
4. Build (Next.js, NestJS)
5. Docker build
6. Deploy to staging/production
```

---

## Key Data Flows

### Flight/Hotel Search Flow (Cache-Aside)

```
1. Browser: GET /api/v1/flights?origin=SYD&destination=MEL&date=2026-04-15
2. NestJS: Check Redis cache with key `flights:SYD:MEL:2026-04-15`
3a. Cache hit: Return cached results (TTL: 30 min)
3b. Cache miss:
    - Call Amadeus FlightOffers API (rate-limited to 1 req/sec)
    - Transform response to internal Flight schema
    - Store in Redis with TTL 30 minutes
    - Return results
4. React Query: Cache results client-side (deduplication within 5 min)
5. Retry failed requests with exponential backoff
```

### Booking Flow

```
1. Web: POST /api/v1/bookings (flight_id, hotel_id, passenger_info)
2. API: Validate availability in-process
3. API: Create Stripe PaymentIntent
4. Web: Use Stripe.js to tokenize card (client-side, never see card number)
5. Web: POST /api/v1/bookings/confirm with token
6. API: Confirm PaymentIntent with Stripe
7. On success: INSERT booking_flights, booking_hotels, booking_events
8. API: Emit booking.created event
9. BullMQ: Queue email task
10. Email service: Send confirmation to user
11. API: Update cache (invalidate bundle queries)
12. Web: Show confirmation page (works offline if service worker cached)
```

### Promotion Application

```
1. Admin creates promotion (20% off, expires 2026-04-10)
2. Admin publishes campaign via admin dashboard
3. API: Cache invalidation event triggers BullMQ job
4. BullMQ: Clears promotion cache in Redis
5. Search API: Queries promotions from DB, caches for 1 hour
6. Booking: User applies promotion code
7. API: Validates code (date, usage limits, min price)
8. API: Applies discount to total
9. Stripe: Captures discounted amount
10. Booking event: Records promotion_applied
```

---

## State Management Strategy

**Server State** (TanStack Query)
- Flights, hotels, bookings (from API)
- Promotions, user profile
- Automatic background refetching, caching

**Form State** (React Hook Form + Zod)
- Search filters (origin, destination, dates, budget)
- Passenger details (name, email, phone)
- Real-time validation with Zod schemas

**UI State** (React Context + useState)
- Booking flow step (select/details/payment)
- Modal open/close states
- Mobile menu visibility
- Filter panel visibility

**Auth State** (Better Auth SDK)
- Current user session
- JWT token storage (httpOnly cookie)
- Automatic token refresh
- Permission checks (admin vs user)

---

## Database Schema Highlights

**Core Relationships**
```
User 1..N Booking
Booking 1..N BookingFlights, BookingHotels
Booking 1..N BookingEvents (audit trail)
Booking M..1 Promotion (via PromotionApplication)

Flight 1..N FlightInventories
Hotel 1..N HotelInventories

Promotion M..N Bundles (promotions can apply to bundles)
```

**Indices for Performance**
- `bookings(user_id, created_at)` - User booking history
- `flights(origin, destination, departure_date)` - Search lookup
- `hotels(location, check_in_date)` - Search lookup
- `booking_events(booking_id, event_type)` - Event querying

---

## Caching Strategy

**Redis Keys**
```
flights:{origin}:{destination}:{date}        TTL: 30 min
hotels:{location}:{check_in}:{check_out}     TTL: 30 min
promotions:{campaign_id}                      TTL: 1 hour
bundles                                       TTL: 6 hours
user:{user_id}:profile                        TTL: 24 hours
```

**Invalidation Triggers**
- Promotion updates: Immediate via BullMQ
- Inventory changes: On-demand
- Admin changes: Via admin dashboard mutation

---

## External Integrations

**Amadeus API**
- Flight Offers Search (base free tier)
- Hotel Search (marketplace free tier)
- Rate limit: 10 req/sec per API key
- Timeout: 5 seconds with retry

**Stripe**
- Payment Intents API
- Webhook events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Client-side tokenization: Stripe.js Elements
- Publishable key in frontend env, secret in backend env

**Email Service**
- Resend or SendGrid (configurable)
- Templates: booking_confirmation, password_reset
- BullMQ queue for reliability
- Retry up to 3 times on failure

**Better Auth**
- Social login (Google, GitHub)
- Email/password authentication
- Session management
- React SDK on frontend, Node SDK on backend
