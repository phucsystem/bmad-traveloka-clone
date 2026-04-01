# Section 5: Project Structure (Complete File Tree)

[Back to index](index.md)

---

## 5. Project Structure (Complete File Tree)

```
travelclone/
├── .env.example
├── .env.local                          # Local dev secrets (gitignored)
├── .gitignore
├── .github/
│   └── workflows/
│       ├── ci.yml                      # Lint → Typecheck → Test → Build
│       └── deploy.yml                  # SSH deploy on main merge
├── docker-compose.yml                  # All services: web, api, admin, postgres, redis, nginx
├── docker-compose.dev.yml              # Dev overrides: volume mounts, port bindings
├── turbo.json                          # Turborepo pipeline config
├── package.json                        # Workspace root: scripts, devDependencies
├── pnpm-workspace.yaml                 # Declares apps/* and packages/*
├── nginx/
│   ├── nginx.conf                      # Main nginx config
│   └── conf.d/
│       └── travelclone.conf            # Virtual host: SSL, proxy rules, cache headers
├── apps/
│   ├── web/                            # Next.js 15 App Router (PWA)
│   │   ├── Dockerfile
│   │   ├── next.config.js              # next-pwa, image domains, env vars
│   │   ├── tailwind.config.ts          # Design tokens: primary, accent, semantic colors
│   │   ├── tsconfig.json               # Extends packages/tsconfig/nextjs.json
│   │   ├── package.json
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx          # Root layout: fonts, providers, BottomNav
│   │       │   ├── page.tsx            # Homepage: promotions + budget widget
│   │       │   ├── error.tsx           # Root error boundary
│   │       │   ├── not-found.tsx       # 404 page
│   │       │   ├── (auth)/
│   │       │   │   ├── signin/
│   │       │   │   │   └── page.tsx    # Google OAuth signin page
│   │       │   │   └── callback/
│   │       │   │       └── page.tsx    # OAuth callback handler
│   │       │   ├── flights/
│   │       │   │   ├── page.tsx        # Flight search results (RSC)
│   │       │   │   └── error.tsx
│   │       │   ├── hotels/
│   │       │   │   ├── page.tsx        # Hotel search results (RSC)
│   │       │   │   └── error.tsx
│   │       │   ├── budget-discovery/
│   │       │   │   └── page.tsx        # Budget-first discovery (Client)
│   │       │   ├── booking/
│   │       │   │   ├── layout.tsx      # BookingFlowContext provider
│   │       │   │   ├── flights/
│   │       │   │   │   └── [flightId]/
│   │       │   │   │       └── page.tsx  # Step 2: passenger details
│   │       │   │   ├── hotels/
│   │       │   │   │   └── [hotelId]/
│   │       │   │   │       └── page.tsx  # Step 2: guest details
│   │       │   │   ├── bundles/
│   │       │   │   │   └── [bundleId]/
│   │       │   │   │       └── page.tsx  # Step 2: bundle details
│   │       │   │   └── payment/
│   │       │   │       └── page.tsx    # Step 3: Stripe payment
│   │       │   ├── my-bookings/
│   │       │   │   ├── page.tsx        # Booking list (RSC, protected)
│   │       │   │   └── [bookingId]/
│   │       │   │       └── page.tsx    # Booking detail + cancellation
│   │       │   ├── confirmation/
│   │       │   │   └── [bookingId]/
│   │       │   │       └── page.tsx    # Post-payment confirmation card
│   │       │   └── profile/
│   │       │       └── page.tsx        # User profile (protected)
│   │       ├── components/
│   │       │   ├── ui/                 # shadcn/ui generated components
│   │       │   │   ├── button.tsx
│   │       │   │   ├── card.tsx
│   │       │   │   ├── input.tsx
│   │       │   │   ├── select.tsx
│   │       │   │   ├── dialog.tsx
│   │       │   │   ├── sheet.tsx
│   │       │   │   ├── calendar.tsx
│   │       │   │   ├── badge.tsx
│   │       │   │   ├── skeleton.tsx
│   │       │   │   ├── toast.tsx
│   │       │   │   ├── progress.tsx
│   │       │   │   ├── avatar.tsx
│   │       │   │   ├── tabs.tsx
│   │       │   │   └── separator.tsx
│   │       │   ├── layout/
│   │       │   │   ├── bottom-nav.tsx          # Mobile bottom navigation
│   │       │   │   ├── header.tsx              # Top header with search
│   │       │   │   └── page-container.tsx      # Max-width + padding wrapper
│   │       │   ├── home/
│   │       │   │   ├── deal-card.tsx           # Promotion deal card (image, price, CTA)
│   │       │   │   ├── deal-card-grid.tsx      # Grid of deal cards
│   │       │   │   ├── promotion-banner.tsx    # Top promotional banner
│   │       │   │   └── budget-discovery-widget.tsx
│   │       │   ├── flights/
│   │       │   │   ├── flight-search-form.tsx  # Origin, dest, dates, pax
│   │       │   │   ├── flight-card.tsx         # Single flight result row
│   │       │   │   ├── flight-list.tsx         # List of flight cards
│   │       │   │   └── flight-filters.tsx      # Price range, airline, time filters
│   │       │   ├── hotels/
│   │       │   │   ├── hotel-search-form.tsx
│   │       │   │   ├── hotel-card.tsx          # Single hotel result card
│   │       │   │   ├── hotel-list.tsx
│   │       │   │   └── hotel-filters.tsx
│   │       │   ├── booking/
│   │       │   │   ├── booking-step-indicator.tsx  # 3-step progress
│   │       │   │   ├── passenger-details-form.tsx
│   │       │   │   ├── guest-details-form.tsx
│   │       │   │   ├── booking-summary-card.tsx    # Fixed summary at bottom
│   │       │   │   ├── price-breakdown.tsx         # Itemized cost display
│   │       │   │   └── stripe-payment-form.tsx     # Stripe Elements wrapper
│   │       │   ├── bookings/
│   │       │   │   ├── booking-list-item.tsx
│   │       │   │   ├── booking-detail-card.tsx
│   │       │   │   ├── cancellation-modal.tsx
│   │       │   │   └── booking-status-badge.tsx
│   │       │   └── shared/
│   │       │       ├── price-display.tsx        # AUD price with orange accent
│   │       │       ├── booking-confirmation.tsx # Shareable confirmation card
│   │       │       ├── empty-state.tsx
│   │       │       ├── error-state.tsx
│   │       │       ├── loading-skeleton.tsx
│   │       │       └── pwa-install-prompt.tsx
│   │       ├── hooks/
│   │       │   ├── use-geolocation.ts          # Browser geolocation + IP fallback
│   │       │   ├── use-booking-flow.ts         # Multi-step booking state
│   │       │   ├── use-promotions.ts           # React Query wrapper
│   │       │   ├── use-flights.ts              # React Query wrapper
│   │       │   ├── use-hotels.ts               # React Query wrapper
│   │       │   ├── use-bookings.ts             # React Query wrapper
│   │       │   ├── use-budget-discovery.ts     # React Query wrapper
│   │       │   └── use-pwa-install.ts          # beforeinstallprompt event handler
│   │       ├── lib/
│   │       │   ├── api-client.ts               # Typed fetch wrapper; adds auth headers
│   │       │   ├── query-client.ts             # TanStack Query client singleton
│   │       │   ├── auth.ts                     # Better Auth React SDK config
│   │       │   ├── stripe.ts                   # Stripe.js loadStripe singleton
│   │       │   └── utils.ts                    # cn() classname merger; date utils
│   │       ├── providers/
│   │       │   ├── query-provider.tsx          # TanStack Query provider
│   │       │   ├── auth-provider.tsx           # Better Auth session provider
│   │       │   └── toast-provider.tsx          # Sonner toast provider
│   │       └── types/
│   │           └── index.ts                    # Re-exports from packages/shared
│   │
│   ├── api/                            # NestJS 10 REST API
│   │   ├── Dockerfile
│   │   ├── tsconfig.json               # Extends packages/tsconfig/nestjs.json
│   │   ├── package.json
│   │   └── src/
│   │       ├── main.ts                 # Bootstrap: global pipes, filters, interceptors, Pino
│   │       ├── app.module.ts           # Root module: imports all feature modules
│   │       ├── modules/
│   │       │   ├── auth/
│   │       │   │   ├── auth.module.ts
│   │       │   │   ├── auth.controller.ts    # POST /auth/google, /auth/refresh, /auth/logout
│   │       │   │   ├── auth.service.ts       # Better Auth integration
│   │       │   │   ├── guards/
│   │       │   │   │   ├── auth.guard.ts     # JWT validation via Better Auth
│   │       │   │   │   └── roles.guard.ts    # Role-based access control
│   │       │   │   └── decorators/
│   │       │   │       ├── current-user.decorator.ts
│   │       │   │       └── roles.decorator.ts
│   │       │   ├── users/
│   │       │   │   ├── users.module.ts
│   │       │   │   ├── users.controller.ts   # GET/PUT /users/me
│   │       │   │   ├── users.service.ts
│   │       │   │   └── dto/
│   │       │   │       └── update-user.dto.ts
│   │       │   ├── flights/
│   │       │   │   ├── flights.module.ts
│   │       │   │   ├── flights.controller.ts # GET /flights?origin=SYD&dest=MEL&date=...
│   │       │   │   ├── flights.service.ts    # Cache-aside + Amadeus fallback
│   │       │   │   └── dto/
│   │       │   │       └── search-flights.dto.ts
│   │       │   ├── hotels/
│   │       │   │   ├── hotels.module.ts
│   │       │   │   ├── hotels.controller.ts  # GET /hotels?city=MEL&checkin=...
│   │       │   │   ├── hotels.service.ts
│   │       │   │   └── dto/
│   │       │   │       └── search-hotels.dto.ts
│   │       │   ├── promotions/
│   │       │   │   ├── promotions.module.ts
│   │       │   │   ├── promotions.controller.ts # GET /promotions?city=SYD
│   │       │   │   ├── promotions.service.ts    # Rule evaluation: geo, time, history
│   │       │   │   └── dto/
│   │       │   │       └── query-promotions.dto.ts
│   │       │   ├── bundles/
│   │       │   │   ├── bundles.module.ts
│   │       │   │   ├── bundles.controller.ts # GET /bundles, GET /bundles/:id
│   │       │   │   └── bundles.service.ts
│   │       │   ├── bookings/
│   │       │   │   ├── bookings.module.ts
│   │       │   │   ├── bookings.controller.ts  # POST /bookings, GET /bookings, GET /bookings/:id, DELETE /bookings/:id
│   │       │   │   ├── bookings.service.ts     # Booking creation, cancellation, refund calc
│   │       │   │   └── dto/
│   │       │   │       ├── create-booking.dto.ts
│   │       │   │       └── cancel-booking.dto.ts
│   │       │   ├── payments/
│   │       │   │   ├── payments.module.ts
│   │       │   │   ├── payments.controller.ts  # POST /webhooks/stripe
│   │       │   │   └── payments.service.ts     # Stripe SDK; idempotency via booking_events
│   │       │   ├── budget-discovery/
│   │       │   │   ├── budget-discovery.module.ts
│   │       │   │   ├── budget-discovery.controller.ts # GET /budget-discovery?budget=500&origin=SYD
│   │       │   │   ├── budget-discovery.service.ts    # Prisma query: flights+hotels within budget
│   │       │   │   └── dto/
│   │       │   │       └── budget-discovery.dto.ts
│   │       │   └── admin/
│   │       │       ├── admin.module.ts
│   │       │       ├── admin-flights.controller.ts    # CRUD /admin/flights
│   │       │       ├── admin-hotels.controller.ts     # CRUD /admin/hotels
│   │       │       ├── admin-promotions.controller.ts # CRUD /admin/promotions
│   │       │       ├── admin-bundles.controller.ts    # CRUD /admin/bundles
│   │       │       ├── admin-bookings.controller.ts   # GET/PATCH /admin/bookings; refund
│   │       │       ├── admin-users.controller.ts      # GET /admin/users
│   │       │       └── dto/
│   │       │           ├── create-promotion.dto.ts
│   │       │           ├── create-bundle.dto.ts
│   │       │           └── process-refund.dto.ts
│   │       ├── workers/
│   │       │   ├── email.worker.ts            # BullMQ processor: email queue
│   │       │   ├── amadeus-sync.worker.ts     # BullMQ processor: amadeus-sync queue
│   │       │   └── cache-invalidation.worker.ts
│   │       ├── email/
│   │       │   ├── email.module.ts
│   │       │   ├── email.service.ts           # Mailtrap SMTP + React Email render
│   │       │   └── templates/
│   │       │       ├── booking-confirmation.tsx
│   │       │       ├── cancellation-confirmation.tsx
│   │       │       └── email-layout.tsx
│   │       ├── amadeus/
│   │       │   ├── amadeus.module.ts
│   │       │   └── amadeus.service.ts         # Amadeus SDK wrapper; retry interceptor
│   │       ├── cache/
│   │       │   ├── cache.module.ts            # Redis ioredis provider
│   │       │   └── cache.service.ts           # get/set/del/keys helpers
│   │       ├── filters/
│   │       │   └── http-exception.filter.ts   # GlobalExceptionFilter
│   │       ├── interceptors/
│   │       │   └── response.interceptor.ts    # Wraps all responses in ApiResponse envelope
│   │       ├── health/
│   │       │   └── health.controller.ts       # GET /api/health
│   │       └── config/
│   │           ├── configuration.ts           # Typed env config via @nestjs/config
│   │           └── validation.ts              # Joi schema for env validation
│   │
│   └── admin/                          # Refine + React (admin dashboard)
│       ├── Dockerfile
│       ├── next.config.js
│       ├── tsconfig.json
│       ├── package.json
│       └── src/
│           ├── app/
│           │   ├── layout.tsx          # Refine provider + auth provider
│           │   └── [[...params]]/
│           │       └── page.tsx        # Refine catch-all routing
│           ├── providers/
│           │   ├── auth-provider.ts    # Refine authProvider → Better Auth admin login
│           │   ├── data-provider.ts    # Refine dataProvider → NestJS API (/api/v1/admin/*)
│           │   └── access-control.ts  # Refine accessControl — role: admin only
│           └── components/
│               ├── bookings/
│               │   ├── booking-timeline.tsx    # Status event log view
│               │   └── refund-action.tsx       # Process refund button + confirmation
│               └── promotions/
│                   └── promotion-form.tsx      # Targeting rules: geo, time, expiry
│
└── packages/
    ├── shared/                         # Shared TypeScript types, constants, utils
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── src/
    │       ├── index.ts                # Barrel export
    │       ├── types/
    │       │   ├── api-response.ts     # ApiResponse<T> interface
    │       │   ├── user.ts             # User, UserRole types
    │       │   ├── flight.ts           # Flight, FlightSearchParams types
    │       │   ├── hotel.ts            # Hotel, HotelSearchParams types
    │       │   ├── booking.ts          # Booking, BookingStatus, BookingType types
    │       │   ├── promotion.ts        # Promotion, PromotionType, DiscountType types
    │       │   └── bundle.ts           # Bundle type
    │       ├── constants/
    │       │   ├── error-codes.ts      # ErrorCode enum (all error codes)
    │       │   ├── booking-status.ts   # BookingStatus enum: pending, confirmed, cancelled
    │       │   ├── cache-ttl.ts        # CACHE_TTL_* constants in seconds
    │       │   └── api-routes.ts       # API route constants (avoids string duplication)
    │       └── utils/
    │           ├── currency.ts         # formatAUD(amount: number): string
    │           ├── date.ts             # formatDate(), calculateNights(), etc.
    │           └── booking.ts          # calculateRefund(), isWithinCancellationWindow()
    │
    ├── database/                       # Prisma schema + migrations + seed
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── prisma/
    │       ├── schema.prisma           # Full Prisma schema (all models)
    │       ├── migrations/             # Auto-generated migration SQL files
    │       │   └── .gitkeep
    │       └── seed/
    │           ├── index.ts            # Main seed runner
    │           ├── users.seed.ts       # Admin user seed
    │           ├── flights.seed.ts     # Sample Amadeus-sourced flight data
    │           ├── hotels.seed.ts      # Sample Amadeus-sourced hotel data
    │           ├── promotions.seed.ts  # Sample promotions with geo/time rules
    │           └── bundles.seed.ts     # Sample bundle deals
    │
    ├── eslint-config/                  # Shared ESLint configuration
    │   ├── package.json
    │   ├── nextjs.js                   # ESLint config for Next.js apps
    │   ├── nestjs.js                   # ESLint config for NestJS apps
    │   └── base.js                     # Base rules (shared)
    │
    └── tsconfig/                       # Shared TypeScript configuration
        ├── package.json
        ├── base.json                   # Base: strict, ES2022, bundler moduleResolution
        ├── nextjs.json                 # Extends base + Next.js plugin settings
        └── nestjs.json                 # Extends base + NestJS decorators, emitDecoratorMetadata
```
