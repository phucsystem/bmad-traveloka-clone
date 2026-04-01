# TravelClone Development Roadmap

**Last Updated:** April 1, 2026
**Current Status:** MVP - Pre-Implementation (Planning Phase Complete)

---

## Overview

TravelClone targets three major development phases: MVP (internal release), Growth Features (post-MVP competitive advantages), and Vision (long-term expansion).

### Current Status Summary

| Phase | Status | Timeline | Completion |
|-------|--------|----------|------------|
| **Phase 1 - MVP** | Not Started | 16 weeks | 0% |
| **Phase 2 - Growth Features** | Planned | TBD | 0% |
| **Phase 3 - Vision** | Planned | TBD | 0% |

---

## Phase 1: MVP (Internal Release)

**Timeline:** 16 weeks (Q2-Q3 2026)
**Goal:** Deliver core travel booking functionality with transparent pricing, 3-step checkout, and promotion-first discovery.
**Success Metrics:** Booking completion ≥40%, avg booking time <2 min, Lighthouse ≥90, cache hit ratio ≥70%

### 1.1 Project Setup & Infrastructure

**Status:** Not Started
**Priority:** Critical (blocks all other phases)
**Duration:** 2 weeks

**Deliverables:**
- Turborepo monorepo initialized with pnpm workspaces
- Docker Compose services configured (postgres, redis, nginx, dev)
- Environment templates (.env.example with all required keys)
- Prisma schema scaffolding (empty migrations folder, schema.prisma)
- CI/CD pipeline (GitHub Actions: lint → typecheck → test → build)
- Nginx reverse proxy config (HTTP → HTTPS, route rules)
- TypeScript and ESLint shared configs across all apps

**Key Files:**
- `docker-compose.dev.yml` — postgres:16, redis:7
- `docker-compose.yml` — production services (nginx, web, api, admin, postgres, redis)
- `.github/workflows/ci.yml` — Lint, typecheck, test, build, deploy
- `turbo.json` — Build pipeline definition
- `packages/database/prisma/schema.prisma` — Base schema (empty)

**Acceptance Criteria:**
- `pnpm turbo dev` starts web/api/admin without errors
- `docker compose -f docker-compose.dev.yml up -d` brings up postgres + redis
- GitHub Actions workflow passes on first push
- All packages reference shared tsconfig and eslint-config

### 1.2 Core Backend (NestJS, Prisma, Auth, Cache)

**Status:** Not Started
**Priority:** Critical (blocks API-dependent features)
**Duration:** 4 weeks

**Deliverables:**
- NestJS 10 app scaffold with modular architecture
- Prisma 5 schema with core models (users, flights, hotels, bookings, payments, etc.)
- Better Auth integration (Google OAuth, httpOnly cookies)
- Redis cache-aside pattern for flights/hotels/promotions
- Rate limiting middleware (100 req/min per IP)
- Structured logging (Pino) with request-id correlation
- Health check endpoints (`GET /api/health`, `GET /health`)

**Modules to Implement:**
| Module | Endpoints | Dependencies |
|--------|-----------|--------------|
| AuthModule | POST /auth/signin, /signout, GET /session | Better Auth SDK |
| UsersModule | GET /users/me, PUT /users/me | AuthModule |
| FlightsModule | GET /flights, /flights/{id} | Amadeus API mock, RedisModule |
| HotelsModule | GET /hotels, /hotels/{id} | Amadeus API mock, RedisModule |
| PromotionsModule | GET /promotions | RedisModule |
| BookingsModule | POST /bookings, GET /bookings, GET /bookings/{id} | FlightsModule, HotelsModule, PaymentsModule |
| PaymentsModule | POST /payments, webhook handler | Stripe mock |
| AdminModule | CRUD endpoints for inventory | RolesGuard (admin only) |

**Key Files:**
- `apps/api/src/main.ts` — NestJS bootstrap
- `apps/api/src/modules/**/*.module.ts` — Module definitions
- `packages/database/prisma/schema.prisma` — Full schema with all models
- `packages/database/prisma/migrations/` — Migration files

**Acceptance Criteria:**
- All modules start without errors
- Prisma migrations apply to dev database
- Health check returns `{ status: "ok" }`
- Rate limiting blocks requests after 100/min threshold
- Request logs include correlation ID and duration

### 1.3 Amadeus API Integration & Cache

**Status:** Not Started
**Priority:** Critical (core feature)
**Duration:** 2 weeks

**Deliverables:**
- Amadeus SDK integration with authentication
- Flight search endpoint (`GET /api/v1/flights`)
- Hotel search endpoint (where Amadeus supports; fallback to mock)
- Retry logic (3 attempts, exponential backoff)
- Circuit breaker (disable Amadeus if 5 consecutive failures)
- Redis cache with 1h TTL for flights, 15min for promotions
- Cache invalidation via admin updates
- Rate limiter to stay under 10 req/s quota

**API Endpoints:**
- `/v1/shopping/flight-offers` — Flights by origin, destination, date, passengers
- `/v2/reference-data/locations` — Geolocation data (cached indefinitely)
- `/v2/shopping/hotel-search-sync` — Hotels by city, check-in, check-out (if available)

**Key Files:**
- `apps/api/src/modules/flights/amadeus.service.ts` — Amadeus SDK wrapper
- `apps/api/src/modules/cache/redis.service.ts` — Redis operations
- `apps/api/src/common/interceptors/cache.interceptor.ts` — Cache-aside pattern

**Acceptance Criteria:**
- Flight search returns real Amadeus results (test mode)
- Cache hit rate ≥70% for repeated searches
- Retry logic works on network failures
- Circuit breaker activates after 5 failures
- Rate limiter prevents exceeding 10 req/s

### 1.4 Frontend: Core Pages & Navigation

**Status:** Not Started
**Priority:** Critical (user-facing)
**Duration:** 3 weeks

**Deliverables:**
- Next.js 15 App Router with RSC strategy
- Layout structure (header, footer, nav)
- Homepage with promotions carousel
- Flight search page with results + client-side filters
- Hotel search page with results + client-side filters
- Budget discovery page (slider → search results)
- My bookings page (protected route)
- User profile page (protected route)
- Mobile-first responsive design

**Pages:**
| Page | Route | Render | Priority |
|------|-------|--------|----------|
| Homepage | `/` | RSC | 1 |
| Flight Search | `/flights` | RSC + Client | 1 |
| Flight Detail | `/flights/[id]` | RSC | 2 |
| Hotel Search | `/hotels` | RSC + Client | 1 |
| Hotel Detail | `/hotels/[id]` | RSC | 2 |
| Budget Discovery | `/budget-discovery` | Client | 2 |
| Booking Flow | `/booking` | Client | 1 |
| My Bookings | `/my-bookings` | RSC (Protected) | 1 |
| Profile | `/profile` | RSC (Protected) | 2 |
| Auth Callback | `/auth/callback` | Client | 1 |

**Design Components:**
- shadcn/ui: Button, Input, Select, Dialog, Card, Badge, Tabs, Calendar
- Custom: DealCard, FlightCard, HotelCard, PriceDisplay, BookingStepIndicator

**Key Files:**
- `apps/web/src/app/page.tsx` — Homepage
- `apps/web/src/app/flights/page.tsx` — Flight search
- `apps/web/src/app/booking/page.tsx` — Booking flow
- `apps/web/src/components/` — Reusable components

**Acceptance Criteria:**
- All pages render without hydration errors
- Mobile responsiveness verified (375px, 768px, 1024px)
- Navigation between pages works
- Protected routes redirect unauthenticated users
- Lighthouse score ≥85 on all pages

### 1.5 Booking Flow & Payment Integration

**Status:** Not Started
**Priority:** Critical (revenue-generating)
**Duration:** 3 weeks

**Deliverables:**
- 3-step booking flow UI (flight/hotel selection → passenger details → payment)
- React Hook Form + Zod validation for passenger info
- Stripe.js client-side tokenization integration
- Payment endpoint (`POST /api/v1/payments`)
- Stripe webhook handler for payment confirmation
- Booking confirmation page with receipt
- Email notification system (React Email + Mailtrap)
- Promo code validation and application

**Booking State Machine:**
```
pending (reservation created)
  ↓ (payment succeeds)
confirmed (Stripe webhook received)
  ↓ (user or system)
completed (past event) OR cancelled (within 48h window)
```

**Key Files:**
- `apps/web/src/app/booking/page.tsx` — 3-step form
- `apps/api/src/modules/payments/payments.controller.ts` — Payment endpoint
- `apps/api/src/modules/email/email.service.ts` — Email sending
- `packages/shared/types/booking.ts` — Booking types

**Acceptance Criteria:**
- Complete booking flow from flight selection to confirmation
- Stripe test mode payments succeed with test card (4242...)
- Booking confirmation email sent within 1s of payment
- Promo code correctly applies discount (visual + calculation verified)
- Booking history updated in `/my-bookings`

### 1.6 Admin Dashboard (Refine)

**Status:** Not Started
**Priority:** High (operations requirement)
**Duration:** 2 weeks

**Deliverables:**
- Refine admin app scaffold
- Authentication guard (admin role required)
- Flights CRUD (list, create, edit, delete with pagination)
- Hotels CRUD (list, create, edit, delete with pagination)
- Promotions CRUD (create, edit, delete, schedule)
- Bundles CRUD (flight+hotel combo management)
- Booking management (view, cancel, refund)
- Analytics dashboard (total bookings, revenue, top routes)

**Key Features:**
- Bulk import flights/hotels (CSV)
- Promotion scheduling with date/time rules
- Real-time booking updates
- Export reports (CSV, PDF)

**Key Files:**
- `apps/admin/src/` — Refine app
- `apps/api/src/modules/admin/` — Admin endpoints

**Acceptance Criteria:**
- Login redirects unauthenticated users
- CRUD operations work (create, read, update, delete)
- Pagination works with 100+ records
- Cache invalidation triggers on data changes
- Admin can create and activate promotions

### 1.7 Email Notifications & PWA Setup

**Status:** Not Started
**Priority:** High (UX requirement)
**Duration:** 2 weeks

**Deliverables:**
- Email templates (booking confirmation, receipt, cancellation)
- React Email for template rendering
- Mailtrap SMTP integration
- BullMQ email queue (async sending)
- PWA configuration (next-pwa, manifest, service worker)
- Install prompt UI for mobile users
- Offline fallback pages (cached homepage, help)

**Email Templates:**
1. Booking Confirmation — Passenger details, flight/hotel info, total price, booking reference
2. Receipt — Itemized charges, payment method (last 4 digits), cancellation policy
3. Cancellation Confirmation — Refund amount, timeline, support contact

**PWA Features:**
- Installable icon (192×192, 512×512)
- Theme color: #0064D2
- Start URL: `/`
- Display: standalone
- Service worker caches: static assets, flight/hotel search results

**Key Files:**
- `apps/web/public/manifest.json` — Web app manifest
- `apps/api/src/modules/email/templates/` — Email templates
- `packages/shared/constants/emails.ts` — Email constants

**Acceptance Criteria:**
- Emails sent and received in dev environment (Mailtrap)
- Email queue retries failed sends (3 attempts)
- PWA installable on mobile (iOS/Android)
- Service worker caches static assets
- Offline page shows cached bookings

### 1.8 Integration, Refinement & QA

**Status:** Not Started
**Priority:** High (quality gate)
**Duration:** 3 weeks

**Deliverables:**
- End-to-end testing (Playwright or Cypress): complete booking flow
- Unit tests for core services (≥70% coverage)
- Integration tests for API endpoints
- Error handling refinement (user-friendly error messages)
- Accessibility audit (WCAG 2.1 AA compliance)
- Performance optimization (Lighthouse ≥90)
- Security review (OWASP Top 10)
- Deployment runbook and documentation

**Test Coverage Targets:**
| Module | Target Coverage |
|--------|-----------------|
| Backend services | ≥80% |
| Frontend components | ≥70% |
| E2E booking flow | 100% (critical path) |

**Key Test Suites:**
- Flight search (caching, filtering, Amadeus fallback)
- Booking creation (validation, payment, email queue)
- Promo code application (discount calculation)
- Admin operations (CRUD, cache invalidation)

**Key Files:**
- `apps/api/src/**/*.spec.ts` — Jest unit tests
- `apps/web/src/**/*.test.tsx` — React component tests
- `e2e/booking-flow.spec.ts` — Playwright E2E tests
- `docs/deployment-guide.md` — Deployment instructions

**Acceptance Criteria:**
- All critical path E2E tests pass (booking flow)
- Jest coverage ≥70% for backend/frontend
- Lighthouse score ≥90 on all pages (mobile + desktop)
- WCAG 2.1 AA audit passes (no critical issues)
- Deployment to staging succeeds without errors
- Security review identifies no OWASP Top 10 issues

---

## Phase 2: Growth Features (Post-MVP)

**Timeline:** 8 weeks (estimated Q3-Q4 2026)
**Goal:** Add competitive features to increase engagement and average booking value.

### Features to Implement

1. **Live Stripe Payments** — Switch from test mode to production; add PCI compliance audit
2. **SEO Route Pages** — Static pages for popular routes (SYD→MEL, SYD→BNE) with schema markup
3. **Fare Alerts** — Email notifications when prices drop below user's target threshold
4. **Map-Based Hotel Search** — Leaflet or Mapbox integration for geographic filtering
5. **Referral Program** — Users earn credits for successful referrals; viral growth loop
6. **Shareable Booking Cards** — Generate unique URLs to share itineraries with friends
7. **Buy Now Pay Later (BNPL)** — Afterpay/Klarna integration for split payments
8. **University Partnerships** — Corporate discount codes for Australian universities

### Success Metrics

| Metric | Target | Achieved Via |
|--------|--------|--------------|
| Referral conversion rate | ≥10% | Tracking unique ref links |
| Fare alert engagement | ≥30% | Click-through on email alerts |
| BNPL adoption | ≥15% of bookings | Payment method tracking |
| SEO traffic | +300% organic | Google Search Console |

---

## Phase 3: Vision (Future Expansion)

**Timeline:** 12+ weeks (2027+)
**Goal:** Establish TravelClone as multi-destination platform for budget travelers.

**Strategic Initiatives:**
- Business traveler mode (corporate bookings, expense tracking)
- Multi-city itineraries (SYD → MEL → BNE → SYD)
- Loyalty tiers with elite benefits
- AI trip assistant (ChatGPT integration)
- NZ & SEA expansion (New Zealand, Singapore, Thailand, Vietnam)
- Group booking discounts (4+ travelers)

---

**Last Updated:** April 1, 2026
