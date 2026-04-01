# TravelClone System Architecture

**Last Updated:** April 1, 2026
**Status:** MVP Design Phase

---

## Architecture Overview

TravelClone is built as a Turborepo monorepo with three production applications and four shared packages, deployed via Docker Compose with Nginx as the reverse proxy.

```
monorepo/
├── apps/
│   ├── web/              Next.js 15 PWA (port 3000)
│   ├── api/              NestJS 10 REST API (port 3001)
│   └── admin/            Refine admin dashboard (port 3002)
├── packages/
│   ├── shared/           Shared types, constants, utilities
│   ├── database/         Prisma schema, migrations, seed scripts
│   ├── eslint-config/    Shared ESLint rules
│   └── tsconfig/         Shared TypeScript configs
├── nginx/                Nginx config for production routing
├── docker-compose.yml    Production services
└── turbo.json           Monorepo build pipeline
```

### High-Level Architecture

Browser → Nginx (TLS termination) → {web:3000, api:3001, admin:3002} ← PostgreSQL & Redis

---

## Frontend Architecture

### Next.js 15 App Router Strategy

The frontend uses Next.js 15 App Router with React Server Components (RSC) as default, falling back to Client Components where interactivity is required.

**Route Rendering Strategy:**
- **RSC (Server-Rendered)**: Homepage, flights/hotels detail views, my-bookings
- **Client Components**: Flight search filters, hotel search filters, booking flow, budget discovery
- **Static Generation**: Promotional templates, help pages, public information
- **Dynamic Routes**: Booking details, user profile pages

**Key Routes:**
| Route | Render | Purpose |
|-------|--------|---------|
| `/` | RSC | Homepage with promotions carousel |
| `/flights` | RSC + Client | Flight search with server pagination, client filters |
| `/flights/[id]` | RSC | Flight detail page |
| `/hotels` | RSC + Client | Hotel search with server pagination, client filters |
| `/hotels/[id]` | RSC | Hotel detail page |
| `/booking` | Client | 3-step booking flow (flight/hotel selection, details, payment) |
| `/budget-discovery` | Client | Interactive budget slider → results |
| `/my-bookings` | RSC (Protected) | User booking history, cancellation, receipts |
| `/profile` | RSC (Protected) | User profile management, preferences |
| `/admin/*` | N/A | Refine admin panel (separate app) |

### State Management

- **Server State**: TanStack Query v5 for server-side data caching and synchronization
- **Form State**: React Hook Form with Zod validation (booking flow, profile updates)
- **Client State**: React Context API for booking flow workflow (selected flights, hotel, passenger info)
- **Auth State**: Better Auth SDK manages JWT in httpOnly cookies automatically
- **Global UI State**: Zustand (if needed) for modals, toast notifications, theme

### Progressive Web App (PWA) Setup

- **Package**: next-pwa v5
- **Service Worker**: Caches static assets, flight search results, hotel images
- **Web App Manifest**: `public/manifest.json` with app icon, theme color (#0064D2), start URL
- **Installation Prompt**: Shown to users on repeat visits, mobile platforms
- **Offline Strategy**: Stale-while-revalidate for cached searches; graceful fallback for live data

**Caching Strategy:**
- **Static**: App shell (HTML, JS, CSS) — cache indefinitely
- **Images**: Next.js Image component with CDN caching
- **API Responses**: 1-hour cache for flight/hotel searches, 15-minute for promotions
- **User Bookings**: Always fetch fresh (no cache on `/my-bookings`)

### Design System

**Colors:**
- Primary: `#0064D2` (hover: `#0052A8`, light: `#DBEAFE`)
- Accent: `#FF6B00` (hover: `#D45800`, light: `#FFF7ED`)
- Success: `#16A34A` (light: `#DCFCE7`)
- Warning: `#D97706` (light: `#FEF3C7`)
- Error: `#DC2626` (light: `#FEE2E2`)
- Text: `#0F172A` (light: `#64748B`)
- Background: `#F8FAFC` (cards: `#FFFFFF`)

**Typography:**
- Font: Inter variable (system font fallback: -apple-system, BlinkMacSystemFont)
- Scale: 12px (xs) → 48px (4xl hero on desktop)
- Price display: 32px, font-extrabold, accent orange with AUD superscript

**Spacing:**
- Base unit: 4px (use multiples: 4, 8, 12, 16, 20, 24, 32)
- Component internal: 8px
- Layout composition: 16px between sections

**Border Radius:**
- Default: 8px
- Large: 12px
- Extra-large: 16px

**Component Library:**
- **shadcn/ui** (Radix UI + Tailwind CSS)
- Registry components: Button, Input, Select, Dialog, Sheet, Calendar, Badge, Card, Skeleton, Toast, Progress, Avatar, Tabs
- Custom components: DealCard, FlightCard, HotelCard, PriceDisplay, BookingStepIndicator, BudgetDiscoveryWidget, BookingConfirmation

**Responsive Breakpoints:**
- Mobile base: 375px
- Tablet: 768px
- Desktop: 1024px+
- Mobile-first development approach

---

## Backend Architecture

### NestJS 10 Modular Design

The API uses NestJS 10 with a modular architecture, organized by feature domains.

**Core Modules:**
| Module | Responsibility |
|--------|-----------------|
| AuthModule | JWT validation, session management, role-based access |
| UsersModule | User profile, preferences, account management |
| FlightsModule | Flight search, caching, Amadeus integration |
| HotelsModule | Hotel search, inventory management |
| BookingsModule | Booking creation, state transitions, cancellation |
| PaymentsModule | Stripe integration, webhook handling, refunds |
| PromotionsModule | Create/update promotions, rule matching, budget tracking |
| BundlesModule | Flight+Hotel combo deals, admin curation |
| BudgetModule | Budget range analysis, filtering, recommendations |
| AdminModule | Admin CRUD, analytics, reporting |
| EmailModule | Email templates, sending via Mailtrap |
| CacheModule | Redis operations, cache invalidation |

**Architecture Pattern:**
```
src/modules/{feature}/
├── controllers/      REST endpoints
├── services/        Business logic
├── entities/        Prisma models
├── dtos/           Request/response shapes
├── guards/         Auth/role checks
├── filters/        Exception handling
├── pipes/          Request validation
└── {feature}.module.ts
```

### Prisma 5 ORM with PostgreSQL 16

**Key Tables:**
- `users` — Accounts, profile, auth metadata
- `flights` — Inventory from Amadeus (cached daily)
- `hotels` — Inventory (partner-managed)
- `bookings` — Records (status: pending → confirmed → completed/cancelled)
- `booking_flights` / `booking_hotels` — Junction tables
- `payments` — Stripe charge records
- `promotions` — Promo codes, discounts, time-based rules
- `bundles` — Admin-curated flight+hotel combos
- `booking_events` — Audit log (created, confirmed, cancelled, refunded)

### Redis 7 Caching

**Cache-Aside Pattern** with automatic invalidation:

| Key Pattern | Data | TTL | Refresh Policy |
|------------|------|-----|-----------------|
| `flights:{origin}:{destination}:{date}` | Amadeus API results | 1h | BullMQ cron (popular routes) |
| `hotels:{city}:{checkin}:{checkout}` | Hotel search results | 1h | Manual invalidation on update |
| `promotions:active:{geolocation}:{day_of_week}` | Active promotions | 15min | Cache-bust on admin update |
| `bundles:all` | All available bundles | 30min | Cache-bust on admin update |
| `budget:analysis:{currency}` | Budget range analytics | 30min | Nightly refresh |
| `user:session:{token}` | Session data | 7d | Refresh on login |

**Cache Invalidation Strategy:**
- Admin updates promotion → publish Redis message → all api instances invalidate local cache
- Async BullMQ cron job refreshes popular routes hourly
- Graceful degradation: if Redis down, API calls Amadeus directly (with rate limiting)

### BullMQ Async Job Queues

| Queue | Purpose |
|-------|---------|
| email-queue | Booking confirmations, receipts, cancellations |
| amadeus-sync | Refresh flight inventory |
| cache-invalidation | Cache-bust messages |
| report-generation | Admin reports (monthly) |

### Amadeus API Integration

**Strategy:** 10 req/s free tier. Retry: 3 attempts, exponential backoff. Fallback to cached results on outage. Circuit breaker: disable after 5 consecutive failures.

**Endpoints:** `/v1/shopping/flight-offers` (flights), `/v2/reference-data/locations` (geolocation), `/v2/shopping/hotel-search-sync` (hotels).

### Authentication & Security

**Better Auth:** Google OAuth, httpOnly cookies (15min access / 7d refresh). RBAC: `user` & `admin` roles.

**Controls:** Zod input validation, Prisma parameterized queries (SQL injection prevention), rate limiting (100 req/min per IP), CSP, HTTPS/TLS 1.2+, Stripe client-side tokenization, audit logs in `booking_events`.

---

## API Design

### REST Conventions

**Base URL**: `/api/v1/`

**Response Envelope:**
```json
{
  "success": true,
  "data": { /* response object */ },
  "meta": { "page": 1, "total": 100, "limit": 20 }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "FLIGHT_NOT_FOUND",
    "message": "Flight with ID fl-123 does not exist"
  }
}
```

**Standard HTTP Status Codes:**
- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Unprocessable Entity (validation)
- 429 Too Many Requests (rate limit)
- 500 Internal Server Error

### Key Endpoints

**Authentication** (Better Auth callback):
- `POST /auth/signin` — Google OAuth callback handler
- `POST /auth/signout` — Logout
- `GET /auth/session` — Retrieve current session

**Flights**:
- `GET /flights?origin=SYD&destination=MEL&date=2026-04-15&passengers=1&budget_min=0&budget_max=500`
- `GET /flights/{id}` — Get flight details with seat availability

**Hotels**:
- `GET /hotels?city=melbourne&checkin=2026-04-15&checkout=2026-04-20&guests=2&budget_min=0&budget_max=200`
- `GET /hotels/{id}` — Get hotel details with room availability

**Bookings**:
- `GET /bookings` — List user's bookings (auth required)
- `POST /bookings` — Create booking { flightIds: [], hotelIds: [], passengerInfo: {}, promoCode?: "SAVE20" }
- `GET /bookings/{id}` — Get booking with payment details
- `POST /bookings/{id}/cancel` — Cancel (if within 48h window)

**Payments** (Stripe):
- `POST /payments` — Create payment intent (frontend creates token)
- `POST /webhook/stripe` — Handle Stripe webhook (payment confirmation)

**Promotions**:
- `GET /promotions?geolocation=sydney&day_of_week=monday` — Get active promotions
- `GET /promotions/{code}` — Validate promo code

**Admin** (role: admin):
- `GET /admin/bookings` — List all bookings with analytics
- `POST /admin/promotions` — Create promotion
- `PUT /admin/promotions/{id}` — Update promotion
- `DELETE /admin/promotions/{id}` — Delete promotion
- `GET /admin/analytics` — Dashboard metrics (total bookings, revenue, etc.)

---

## Infrastructure

### Docker Compose Services

**Production Stack (`docker-compose.yml`):**

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| nginx | nginx:1.25-alpine | 80, 443 | Reverse proxy, TLS termination, routing |
| web | node:20-alpine | 3000 | Next.js PWA |
| api | node:20-alpine | 3001 | NestJS REST API |
| admin | node:20-alpine | 3002 | Refine admin dashboard |
| postgres | postgres:16-alpine | 5432 | Primary database |
| redis | redis:7-alpine | 6379 | Cache & job queue |

**Development Stack (`docker-compose.dev.yml`):**
- postgres:16-alpine (port 5432)
- redis:7-alpine (port 6379)
- Nginx not included; local dev uses `pnpm turbo dev`

### Nginx Routing

**Routing Rules:**
```nginx
# Frontend (Next.js)
location / {
  proxy_pass http://web:3000;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
}

# API
location /api {
  proxy_pass http://api:3001;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
}

# Admin
location /admin {
  proxy_pass http://admin:3002;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
}
```

**TLS Configuration:**
- Let's Encrypt certificates (auto-renewal via certbot)
- Redirect HTTP → HTTPS
- Session persistence: Redis (shared across api instances if scaled)

### CI/CD Pipeline (GitHub Actions)

**Workflow Steps:**
1. **Lint** — ESLint check all packages
2. **Type Check** — TypeScript compilation
3. **Test** — Jest unit tests
4. **Build** — Turbo build all apps
5. **Docker Build** — Build container images (web, api, admin)
6. **Deploy** — Push to Docker Hub + deploy to production

**Triggers:**
- Push to `main` → build + test + deploy
- Pull requests → lint + test only (no deploy)

### Health Checks

**Liveness Probe:**
- `GET /api/health` (NestJS)
- `GET /health` (Next.js static file)
- Returns: `{ status: "ok", timestamp: "ISO-8601" }`

**Readiness Probe:**
- Database connection test
- Redis connection test
- Returns: `{ ready: true, database: "ok", cache: "ok" }`

### Logging & Monitoring

**Application Logging:**
- Logger: Pino (NestJS), Winston (Node.js)
- Level: DEBUG (dev), INFO (prod)
- Output: JSON to stdout (structured for log aggregation)
- Request correlation: `X-Request-ID` header propagated through all services

**Log Fields:**
```json
{
  "level": "INFO",
  "timestamp": "2026-04-01T12:00:00Z",
  "service": "api",
  "request_id": "req-abc123",
  "method": "GET",
  "path": "/api/v1/flights",
  "status_code": 200,
  "duration_ms": 125,
  "user_id": "usr-456"
}
```

**Metrics:**
- Request latency (p50, p95, p99)
- Cache hit ratio
- API error rates by endpoint
- Database connection pool utilization
- Stripe webhook processing lag

---

## Deployment

### Local Development

```bash
# Start dev databases
docker compose -f docker-compose.dev.yml up -d

# Apply migrations
pnpm prisma migrate dev

# Start all apps (with hot reload)
pnpm turbo dev
```

Access:
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Admin: http://localhost:3002

### Production Deployment

```bash
# Build Docker images
docker compose build

# Start all services
docker compose up -d

# Apply migrations (inside container)
docker compose exec api pnpm prisma migrate deploy

# Verify health
curl http://localhost/api/health
```

**Pre-Deployment Checklist:**
- All env vars set (DATABASE_URL, REDIS_URL, STRIPE keys, etc.)
- TLS certificates in place (Nginx config)
- Database backups configured
- Redis persistence enabled (AOF or RDB)
- Monitoring and alerting set up
- Rate limiting configured for Amadeus API

---

## Error Handling & Recovery

### API Error Codes

| Code | HTTP | Description | Recovery |
|------|------|-------------|----------|
| INVALID_INPUT | 400 | Validation failed | Client retries with corrected data |
| UNAUTHORIZED | 401 | Missing/invalid token | Redirect to login |
| FORBIDDEN | 403 | Insufficient permissions | Show permission error |
| FLIGHT_NOT_FOUND | 404 | Flight ID invalid | Return empty or fallback search |
| AMADEUS_API_ERROR | 503 | External API down | Return cached results |
| STRIPE_ERROR | 402 | Payment failed | Show retry UI |
| RATE_LIMIT | 429 | Too many requests | Exponential backoff retry |

### Graceful Degradation

- **Amadeus API down**: Serve cached flights from Redis, show "Limited results" banner
- **Redis down**: API queries PostgreSQL directly (slower), no caching
- **Email queue down**: Async email fails, user notified in booking UI to manually request receipt
- **Stripe down**: Show "Payment unavailable" → retry later

---

## Performance Targets

| Metric | Target | Achieved Via |
|--------|--------|--------------|
| First Contentful Paint (FCP) | < 1.5s | Next.js RSC + Redis cache |
| Search p95 latency | < 500ms | Redis 1h TTL (90%+ hit rate) |
| Budget discovery response | < 3s | Indexed PostgreSQL queries |
| Lighthouse score | ≥ 90 | next/image + PWA manifest + Tailwind purge |
| Cache hit ratio | ≥ 70% | BullMQ cron refresh popular routes |
| API error rate | < 0.1% | Retry logic + circuit breaker |

---

---

**Last Updated:** April 1, 2026
