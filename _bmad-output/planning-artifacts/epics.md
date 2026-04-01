---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['prd.md', 'architecture.md', 'ux-design-specification.md']
---

# TravelClone — Epics & User Stories

**Author:** Phuc
**Date:** 2026-04-01
**Status:** Complete

---

## 1. Overview

TravelClone is a travel booking PWA for young Australian budget travelers (18-35). The platform reverses the OTA paradigm: deals surface before search, prices are absolute and transparent, and booking completes in 3 steps under 2 minutes. Data sourced via Amadeus Self-Service API. Built on Next.js 15 + NestJS 10 + PostgreSQL + Redis, deployed via Docker Compose.

**Core UX thesis:** Promotion-first homepage, budget-first discovery, 3-step booking flow, zero dark patterns.

---

## 2. Requirements Inventory

### 2.1 Functional Requirements (50 FRs)

**User Discovery & Promotions**
- FR1: Visitors can view promotion deal cards on homepage without logging in
- FR2: System detects user's city via browser geolocation or IP and displays location-relevant deals
- FR3: System displays time-aware promotions based on day of week, season, and upcoming holidays
- FR4: Visitors can view absolute prices on all deals ("from $X") rather than percentage discounts
- FR5: Visitors can browse bundle deals (flight + hotel) with visible savings amount displayed
- FR6: Logged-in users can view personalized deals based on their browsing history

**Budget-First Discovery**
- FR7: Users can enter a budget amount, home city, and optional dates to discover destinations within budget
- FR8: System returns destination cards sorted by total trip cost (flight + hotel) within the specified budget
- FR9: Users can tap a destination card to view available flights and hotels for that destination

**Flight Booking**
- FR10: Users can search flights by origin, destination, dates, and number of passengers
- FR11: Users can view flight search results with airline, departure/arrival times, duration, and price
- FR12: Users can select a flight and proceed to passenger details entry
- FR13: Users can enter passenger details (name matching ID, contact information)
- FR14: System validates passenger details before proceeding to payment

**Hotel Booking**
- FR15: Users can search hotels by destination, check-in/check-out dates, and number of guests
- FR16: Users can view hotel search results with name, location, star rating, amenities, and price per night
- FR17: Users can select a hotel and proceed to guest details entry
- FR18: Users can view hotel photos and descriptions

**Bundle Booking**
- FR19: Users can book flight + hotel together as a bundle with a visible discount
- FR20: System calculates and displays bundle savings ("Save $X vs booking separately")
- FR21: Admin can create and manage bundle deals with fixed discount amounts

**Payment & Checkout**
- FR22: Users can complete payment via Stripe (test mode) with credit/debit card
- FR23: System displays total cost breakdown before payment confirmation
- FR24: Users can review full booking summary before confirming payment
- FR25: System processes payment and generates a booking confirmation with unique reference code

**Post-Booking Management**
- FR26: Users can view all their bookings in a "My Bookings" section
- FR27: Users can view detailed itinerary for any booking (flights, hotels, dates, costs)
- FR28: Users can view cancellation policy and terms for each booking
- FR29: Users can self-service cancel a booking and see refund amount before confirming
- FR30: System calculates refund based on cancellation policy tiers (free > 48h, partial > 24h, etc.)
- FR31: System sends booking confirmation email upon successful payment
- FR32: System sends cancellation confirmation email with refund details

**User Accounts & Authentication**
- FR33: Users can sign up and log in via Google OAuth
- FR34: Users can view and edit their profile information
- FR35: Users can view their booking history
- FR36: System persists user browsing history for personalized promotions

**Admin Dashboard**
- FR37: Admins can log in to a separate admin portal
- FR38: Admins can create, read, update, and delete flight listings
- FR39: Admins can create, read, update, and delete hotel listings
- FR40: Admins can create, read, update, and delete promotions with targeting rules (location, time, expiry)
- FR41: Admins can create and manage bundle deals
- FR42: Admins can search bookings by user email or confirmation code
- FR43: Admins can view booking status timeline (created → paid → confirmed → cancelled)
- FR44: Admins can process refund requests
- FR45: Admins can resend confirmation emails
- FR46: Admins can view and manage user accounts

**Data & Search**
- FR47: System fetches and caches flight data from Amadeus Self-Service API
- FR48: System fetches and caches hotel data from Amadeus Self-Service API
- FR49: Users can search with PostgreSQL full-text search across flights and hotels
- FR50: System refreshes cached data on a configurable schedule

### 2.2 Non-Functional Requirements (23 NFRs)

**Performance**
- NFR1: Homepage FCP < 1.5s on 4G mobile (Next.js RSC + Redis promotions cache)
- NFR2: Search results < 500ms p95 served from Redis cache
- NFR3: Booking flow page transitions < 300ms
- NFR4: Budget-first discovery returns results within 3 seconds
- NFR5: Lighthouse Performance score 90+ across all key pages

**Security**
- NFR6: All data transmitted over HTTPS (TLS 1.2+)
- NFR7: Auth tokens in httpOnly, Secure, SameSite=Strict cookies
- NFR8: Stripe.js client-side tokenization — card data never touches NestJS
- NFR9: Admin dashboard requires separate auth with RBAC
- NFR10: All API endpoints validate/sanitize input (class-validator + Zod)
- NFR11: Rate limiting on auth endpoints (10 req/min/IP)

**Scalability**
- NFR12: System supports 100 concurrent users during internal MVP
- NFR13: Redis caching reduces Amadeus API calls by 90%+
- NFR14: DB schema designed for horizontal read scaling (read replicas) post-MVP
- NFR15: Docker Compose architecture migratable to Kubernetes without code changes

**Accessibility**
- NFR16: WCAG 2.1 AA compliance for all booking flows
- NFR17: All interactive elements keyboard-navigable
- NFR18: Color contrast ratios meet AA standards (4.5:1 normal text, 3:1 large text)
- NFR19: All images have descriptive alt text; decorative images marked presentational

**Integration**
- NFR20: Amadeus API integration with automatic retry (3 attempts, exponential backoff)
- NFR21: Stripe webhook with idempotent event processing
- NFR22: Mailtrap email with React Email templated HTML emails
- NFR23: Better Auth Google OAuth with secure token refresh flow

### 2.3 Additional Architecture Requirements

- Turborepo monorepo: apps/web, apps/api, apps/admin, packages/shared, packages/database
- Docker Compose with postgres:16, redis:7, nginx, web, api, admin services
- BullMQ async job queues for email dispatch and Amadeus sync cron jobs
- Redis cache-aside pattern with per-resource TTLs (flights 1h, hotels 1h, promotions 15min)
- NestJS global `HttpExceptionFilter` with standardized `ApiResponse<T>` envelope
- TanStack Query v5 with `staleTime: 5min` for flight/hotel data
- React Hook Form + Zod for all booking forms
- `BookingFlowContext` for multi-step booking state
- Pino structured JSON logging in NestJS; request-id correlation via Nginx header

---

## 3. FR Coverage Map

| FR | Epic | Story |
|----|------|-------|
| FR1 | Epic 2 | 2.3 |
| FR2 | Epic 2 | 2.3 |
| FR3 | Epic 2 | 2.2 |
| FR4 | Epic 2 | 2.3 |
| FR5 | Epic 3 | 3.5 |
| FR6 | Epic 2 | 2.6 |
| FR7 | Epic 5 | 5.2 |
| FR8 | Epic 5 | 5.1 |
| FR9 | Epic 5 | 5.3 |
| FR10 | Epic 2 | 2.4 |
| FR11 | Epic 2 | 2.5 |
| FR12 | Epic 4 | 4.2 |
| FR13 | Epic 4 | 4.3 |
| FR14 | Epic 4 | 4.3 |
| FR15 | Epic 3 | 3.2 |
| FR16 | Epic 3 | 3.2 |
| FR17 | Epic 4 | 4.2 |
| FR18 | Epic 3 | 3.3 |
| FR19 | Epic 4 | 4.6 |
| FR20 | Epic 3 | 3.4 |
| FR21 | Epic 3 | 3.4 |
| FR22 | Epic 4 | 4.4 |
| FR23 | Epic 4 | 4.5 |
| FR24 | Epic 4 | 4.5 |
| FR25 | Epic 4 | 4.5 |
| FR26 | Epic 6 | 6.1 |
| FR27 | Epic 6 | 6.2 |
| FR28 | Epic 6 | 6.3 |
| FR29 | Epic 6 | 6.3 |
| FR30 | Epic 6 | 6.3 |
| FR31 | Epic 6 | 6.5 |
| FR32 | Epic 6 | 6.5 |
| FR33 | Epic 1 | 1.3 |
| FR34 | Epic 1 | 1.4 |
| FR35 | Epic 1 | 1.4 |
| FR36 | Epic 2 | 2.6 |
| FR37 | Epic 7 | 7.1 |
| FR38 | Epic 7 | 7.2 |
| FR39 | Epic 7 | 7.2 |
| FR40 | Epic 7 | 7.3 |
| FR41 | Epic 7 | 7.3 |
| FR42 | Epic 7 | 7.4 |
| FR43 | Epic 7 | 7.4 |
| FR44 | Epic 7 | 7.4 |
| FR45 | Epic 7 | 7.4 |
| FR46 | Epic 7 | 7.5 |
| FR47 | Epic 2 | 2.1 |
| FR48 | Epic 3 | 3.1 |
| FR49 | Epic 2 | 2.5 |
| FR50 | Epic 2 | 2.1 |

---

## 4. Epic List

| # | Epic | FRs Covered | NFRs Covered | Goal |
|---|------|-------------|--------------|------|
| 1 | Project Foundation & User Authentication | FR33–36 | NFR6–11, NFR23 | Monorepo, Docker infrastructure, Google OAuth, user profile, admin RBAC |
| 2 | Flight Search & Promotion Discovery | FR1–4, FR6, FR10–11, FR47, FR49–50 | NFR1–2, NFR20 | Amadeus flight integration, promotion engine, homepage deal discovery, flight search |
| 3 | Hotel Search & Bundle Deals | FR5, FR15–16, FR18–21 | NFR13 | Hotel search, hotel detail, bundle pricing, bundle display on homepage |
| 4 | Booking Flow & Payments | FR12–14, FR17, FR19, FR22–25 | NFR3, NFR8, NFR21 | 3-step booking flow (search → details → payment) for flights, hotels, bundles |
| 5 | Budget-First Discovery | FR7–9 | NFR4 | Budget input widget, destination results page sorted by total trip cost |
| 6 | Post-Booking Management & Notifications | FR26–32 | NFR22 | My Bookings, itinerary detail, self-service cancellation, email notifications |
| 7 | Admin Dashboard | FR37–46 | NFR9 | Refine admin with flight/hotel CRUD, promotions, booking management, user management |
| 8 | PWA, Performance & Accessibility | — | NFR5, NFR12, NFR14–19 | PWA manifest, offline shell, responsive layouts, Lighthouse 90+, WCAG 2.1 AA, CI/CD |

---

## 5. Full Epic Sections

---

## Epic 1: Project Foundation & User Authentication

**Goal:** Set up the Turborepo monorepo with all apps and Docker infrastructure, then deliver complete user authentication (Google OAuth) and profile management so users can sign in and manage their accounts.

**FRs:** FR33, FR34, FR35, FR36 (partial)
**NFRs:** NFR6, NFR7, NFR9, NFR10, NFR11, NFR23

---

### Story 1.1 — Initialize Turborepo Monorepo and Docker Infrastructure

**As a** developer,
**I want** a fully configured Turborepo monorepo with Next.js 15, NestJS 10, Refine admin, shared packages, and Docker Compose services,
**So that** the entire team can run all services with a single command and share types across the stack.

**FRs:** (foundation for all FRs)

**Acceptance Criteria:**

```
Given a fresh clone of the repository
When I run `docker compose -f docker-compose.dev.yml up -d`
Then postgres:16, redis:7, and nginx containers start successfully with health checks passing

Given the monorepo is running
When I run `pnpm turbo dev`
Then apps/web (port 3000), apps/api (port 4000), and apps/admin (port 3001) all start with hot reload

Given the monorepo structure
When I import a type from `packages/shared`
Then apps/web, apps/api, and apps/admin all resolve the import without npm publish

Given Docker Compose is up
When I call `GET /api/health`
Then the response is `{ success: true, data: { db: "ok", redis: "ok" } }` within 500ms

Given the CI pipeline
When I push to main branch
Then `pnpm turbo lint` and `pnpm turbo typecheck` both pass before any deployment
```

**Implementation Notes:**
- Turborepo workspace: `pnpm-workspace.yaml` declares `apps/*` and `packages/*`
- `packages/shared`: `ApiResponse<T>` type, `ErrorCode` enum, query key factories
- `packages/database`: Prisma client singleton, schema file, migration directory
- `packages/eslint-config`: shared ESLint rules
- `packages/tsconfig`: base `tsconfig.json` files for Next.js, NestJS, React
- Docker Compose dev: postgres:16-alpine, redis:7-alpine, bind-mounted source for hot reload
- NestJS health endpoint: checks Prisma `$queryRaw SELECT 1` and `redis.ping()`

---

### Story 1.2 — Set Up Prisma Schema with User Model and Database Connections

**As a** developer,
**I want** Prisma ORM connected to PostgreSQL with a User model and Redis client available in NestJS,
**So that** all subsequent features can read/write data without re-configuring infrastructure.

**FRs:** (foundation for all data-dependent FRs)

**Acceptance Criteria:**

```
Given the Docker Compose postgres service is running
When I run `pnpm prisma migrate dev --name init`
Then the `users` table is created with id, email, name, role, created_at, updated_at columns

Given the NestJS api is running
When a request hits any protected endpoint without authentication
Then the API returns `{ success: false, error: { code: "UNAUTHORIZED", message: "..." } }` with HTTP 401

Given the NestJS CacheModule
When `cacheService.get('test-key')` is called on an empty Redis
Then it returns null without throwing, and `cacheService.set('test-key', 'value', 60)` stores the value

Given a database migration is created
When I run `pnpm prisma migrate deploy`
Then the migration applies cleanly to a fresh database without errors

Given the Prisma client
When a query throws a unique constraint violation
Then the NestJS service throws an `AppException` with `ErrorCode.VALIDATION_ERROR` (not an unhandled 500)
```

**Implementation Notes:**
- `packages/database/prisma/schema.prisma`: User model with `id` (cuid), `email` (unique), `name`, `googleId`, `role` (enum: user/admin), timestamps
- `apps/api/src/cache/cache.module.ts`: ioredis wrapper, injected as `CacheService`
- Global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` on NestJS bootstrap
- Global `HttpExceptionFilter` and `ResponseInterceptor` registered in `main.ts`
- Pino logger configured via `nestjs-pino` with `request-id` field

---

### Story 1.3 — Implement Google OAuth Signup, Login, and Logout

**As a** visitor,
**I want** to sign up and log in with my Google account,
**So that** I can access my bookings and personalized deals without creating a separate password.

**FRs:** FR33
**NFRs:** NFR6, NFR7, NFR11, NFR23

**Acceptance Criteria:**

```
Given I am on the sign-in page
When I click "Continue with Google" and complete Google's OAuth flow
Then I am redirected to the homepage as an authenticated user with my Google name and avatar displayed

Given I have signed in with Google
When my session is inspected in browser DevTools
Then no auth tokens appear in localStorage or sessionStorage — only httpOnly cookies are used

Given an unauthenticated user attempts to access `/my-bookings`
When the page loads
Then the user is redirected to `/auth/signin` with a return-to URL preserved

Given a signed-in user clicks "Sign Out"
When the logout completes
Then the httpOnly session cookie is cleared and the user is redirected to the homepage as a guest

Given an auth endpoint is called 11 times from the same IP within 60 seconds
When the 11th request arrives
Then the API returns HTTP 429 with `{ success: false, error: { code: "UNAUTHORIZED" } }`
```

**Implementation Notes:**
- Better Auth config: `googleOAuth` provider, `httpOnly: true, secure: true, sameSite: 'strict'` cookies
- Access token: 15min TTL; refresh token: 7 days TTL
- `apps/web/src/app/(auth)/signin/page.tsx`: Client Component with Google OAuth button
- `apps/web/src/app/(auth)/callback/page.tsx`: OAuth callback handler
- `@nestjs/throttler` with `ThrottlerGuard` applied to `/api/v1/auth/*` routes (10 req/min/IP)
- `apps/web/src/lib/auth.ts`: Better Auth React SDK config

---

### Story 1.4 — Build User Profile Page (View and Edit)

**As a** signed-in user,
**I want** to view and update my profile information,
**So that** my name and email are correct for booking confirmations.

**FRs:** FR34, FR35

**Acceptance Criteria:**

```
Given I am signed in and navigate to `/profile`
When the page loads
Then I see my Google profile photo, display name, and email address

Given I am on the profile page
When I update my display name and click "Save"
Then the name is updated via `PUT /api/v1/users/me` and the new name appears immediately in the header

Given I am on the profile page
When I scroll to "My Recent Bookings"
Then I see a summary list of my 5 most recent bookings with status badges and booking dates

Given an unauthenticated user navigates to `/profile`
When the page loads
Then they are redirected to `/auth/signin`

Given I update my name to an empty string
When I submit the profile form
Then a validation error "Name is required" appears inline and no API call is made
```

**Implementation Notes:**
- `GET /api/v1/users/me`: returns `{ id, email, name, role, createdAt }`
- `PUT /api/v1/users/me`: updates `name` only (email from Google, not editable)
- Profile page is RSC with Suspense; edit form is a Client Component
- Route guard: Next.js middleware redirects unauthenticated to `/auth/signin`

---

### Story 1.5 — Implement Admin Role-Based Access Control

**As an** admin user,
**I want** a separate, protected admin area that rejects non-admin users,
**So that** inventory and booking data is only accessible to authorized operators.

**FRs:** (foundation for FR37–FR46)
**NFRs:** NFR9, NFR10

**Acceptance Criteria:**

```
Given a user with role "admin" logs in via Better Auth
When they navigate to `/admin`
Then they access the Refine admin dashboard without being redirected

Given a user with role "user" attempts to call `GET /api/v1/admin/bookings`
When the request is processed
Then the API returns HTTP 403 with `{ success: false, error: { code: "FORBIDDEN" } }`

Given an unauthenticated request hits any `/api/v1/admin/*` endpoint
When the request is processed
Then the API returns HTTP 401 with `{ success: false, error: { code: "UNAUTHORIZED" } }`

Given the admin dashboard app (apps/admin)
When a non-admin user attempts to authenticate
Then the Refine auth provider rejects the session and shows "Access denied"

Given a user is promoted to admin role in the database
When they sign out and sign back in
Then their new admin role is reflected in the session and admin routes become accessible
```

**Implementation Notes:**
- NestJS `RolesGuard` + `@Roles('admin')` decorator applied to all admin controllers
- `AdminAuthGuard` extends `JwtAuthGuard` with additional role check
- All admin API routes prefixed `/api/v1/admin/`
- Refine auth provider checks `user.role === 'admin'` on login; redirects to error page otherwise
- Role stored in Better Auth session payload and in Prisma `User.role` column

---

## Epic 2: Flight Search & Promotion Discovery

**Goal:** Deliver Amadeus flight data integration with Redis caching, a promotion engine with targeting rules, and the promotion-first homepage with flight search and results — the core user discovery experience.

**FRs:** FR1, FR2, FR3, FR4, FR6, FR10, FR11, FR47, FR49, FR50
**NFRs:** NFR1, NFR2, NFR13, NFR20

---

### Story 2.1 — Integrate Amadeus API for Flight Data with Redis Caching

**As a** system,
**I want** to fetch flight data from the Amadeus Self-Service API and cache results in Redis,
**So that** users receive fast search results and Amadeus rate limits are never hit during normal usage.

**FRs:** FR47, FR50
**NFRs:** NFR2, NFR13, NFR20

**Acceptance Criteria:**

```
Given a flight search query has never been made before
When `GET /api/v1/flights?origin=SYD&destination=MEL&date=2026-05-01&passengers=1` is called
Then Amadeus API is called once, results are stored in Redis with key `amadeus:flights:SYD:MEL:2026-05-01:1` at 3600s TTL, and the response returns within 5s

Given the same flight search query is made again within 1 hour
When the API endpoint is called
Then Redis returns the cached result in < 100ms and Amadeus API is NOT called

Given the Amadeus API returns an error on the first attempt
When the request is processed
Then the system retries up to 3 times with exponential backoff (1s, 2s, 4s) before returning `AMADEUS_API_ERROR`

Given a BullMQ cron job `sync-flight-prices` runs every 30 minutes
When it runs for a popular route (SYD→MEL, SYD→BNE)
Then the Redis cache for that route is refreshed with fresh Amadeus data

Given invalid query parameters (missing destination)
When the search endpoint is called
Then the API returns HTTP 400 with `{ success: false, error: { code: "VALIDATION_ERROR", details: [...] } }`
```

**Implementation Notes:**
- `packages/database/prisma/schema.prisma`: add `Flight` model: `id, flightNumber, airline, origin, destination, departureTime, arrivalTime, durationMinutes, priceAud, cabinClass, availableSeats, amadeusOfferId, createdAt, updatedAt`
- `apps/api/src/flights/amadeus.service.ts`: Axios-based client with retry interceptor
- Cache key: `amadeus:flights:{origin}:{dest}:{date}:{pax}`; TTL 3600s
- BullMQ `amadeus-sync` queue with `sync-flight-prices` job; cron `*/30 * * * *`
- `SearchFlightsDto`: `origin, destination, departureDate, passengers` — all required, validated

---

### Story 2.2 — Build Promotion Engine Backend

**As an** admin,
**I want** to create promotions with location, time, and expiry targeting rules,
**So that** the right deals surface to the right users at the right time without manual intervention.

**FRs:** FR3
**NFRs:** NFR13

**Acceptance Criteria:**

```
Given an admin creates a promotion targeting city "Sydney" on "Friday" with expiry "2026-12-31"
When a user from Sydney browses on a Friday before the expiry date
Then that promotion appears in the active promotions list

Given a promotion has expired (expiry date in the past)
When `GET /api/v1/promotions/active` is called
Then the expired promotion is not included in the results

Given an admin updates a promotion via `PUT /api/v1/admin/promotions/:id`
When the update is saved
Then a BullMQ `invalidate-promotion-cache` job is enqueued and Redis cache `promotions:active:*` is cleared within 5 seconds

Given a promotion is created with `targetCity: "Melbourne"` and `targetDayOfWeek: ["Saturday", "Sunday"]`
When `GET /api/v1/promotions/active?city=Sydney&dayOfWeek=Saturday` is called
Then the Melbourne promotion is NOT returned

Given no promotions match the city/day filters
When `GET /api/v1/promotions/active?city=Darwin&dayOfWeek=Monday` is called
Then an empty array is returned with HTTP 200 (not 404)
```

**Implementation Notes:**
- `packages/database/prisma/schema.prisma`: add `Promotion` model: `id, title, description, imageUrl, dealType (flight/hotel/bundle), targetCity (nullable), targetDaysOfWeek (String[]), targetSeasons (String[]), priceFrom, currency, expiresAt, isActive, createdAt, updatedAt`
- `GET /api/v1/promotions/active?city=&dayOfWeek=`: public endpoint, cached at `promotions:active:{city}:{dayOfWeek}` TTL 900s
- Admin CRUD at `/api/v1/admin/promotions` (covered in Epic 7 UI)
- BullMQ `cache-invalidation` queue with `invalidate-promotion-cache` job

---

### Story 2.3 — Build Promotion-First Homepage

**As a** visitor,
**I want** to see relevant travel deals immediately when I open the app — personalized to my city — without searching,
**So that** I discover inspiring options and click through to book faster.

**FRs:** FR1, FR2, FR4
**NFRs:** NFR1

**Acceptance Criteria:**

```
Given a visitor opens the homepage with geolocation permission granted
When their browser detects they are in Sydney
Then the homepage heading reads "Getaways from Sydney" and shows deal cards for Sydney-origin routes

Given a visitor denies geolocation permission
When the homepage loads
Then promotions fall back to displaying top national deals (no city filter applied)

Given the homepage is rendered server-side
When Lighthouse runs on the homepage
Then FCP is under 1.5 seconds on simulated 4G

Given promotion deal cards are displayed
When a visitor views any deal card
Then the price shown is an absolute AUD amount (e.g., "from $149") — never a percentage discount

Given the user is logged in with Sydney browsing history showing Gold Coast interest
When the homepage loads
Then Gold Coast deals appear prominently above other destinations
```

**Implementation Notes:**
- `apps/web/src/app/page.tsx`: RSC, fetches `GET /api/v1/promotions/active` server-side with city from cookie/header
- `apps/web/src/hooks/use-geolocation.ts`: `navigator.geolocation` with IP fallback; sets city in localStorage
- `apps/web/src/components/home/deal-card.tsx`: destination image, "from $X", airline/hotel tag, CTA button
- `apps/web/src/components/home/deal-card-grid.tsx`: responsive grid 1-col mobile, 2-col tablet, 3-col desktop
- `apps/web/src/components/home/promotion-banner.tsx`: top banner for time-sensitive promotions

---

### Story 2.4 — Build Flight Search Form

**As a** user,
**I want** to search for flights by entering origin, destination, travel dates, and passenger count,
**So that** I can find flights that match my travel plans.

**FRs:** FR10
**NFRs:** NFR3

**Acceptance Criteria:**

```
Given I am on the homepage
When I click the flight search bar in the header
Then a flight search form appears with fields: Origin, Destination, Departure Date, Return Date (optional), Passengers

Given I fill in origin "SYD", destination "MEL", departure date "2026-05-01", and 1 passenger
When I tap "Search Flights"
Then I am navigated to `/flights?origin=SYD&destination=MEL&date=2026-05-01&passengers=1`

Given I try to search without filling in a required field (Origin)
When I tap "Search Flights"
Then an inline validation error "Origin is required" appears and no navigation occurs

Given I select a return date earlier than the departure date
When the date is selected
Then the form shows "Return date must be after departure" and prevents submission

Given I am on mobile (375px viewport)
When I open the search form
Then all fields are accessible without horizontal scrolling and tap targets are at least 44×44px
```

**Implementation Notes:**
- `apps/web/src/components/flights/flight-search-form.tsx`: Client Component
- Uses shadcn/ui `Calendar`, `Select`, `Input`, `Button` components
- React Hook Form + Zod schema: `origin, destination` (IATA codes, 3 chars), `departureDate`, `returnDate` (optional, must be >= departureDate), `passengers` (1–9)
- Form state serialized to URL query params on submit

---

### Story 2.5 — Build Flight Search Results Page with Sort and Filter

**As a** user,
**I want** to see flight search results sorted by price or duration with filters for airline, stops, and time of day,
**So that** I can quickly identify the best flight for my budget and schedule.

**FRs:** FR11, FR49
**NFRs:** NFR2

**Acceptance Criteria:**

```
Given valid search params in the URL
When the flight results page loads
Then results are fetched from `GET /api/v1/flights` and displayed as FlightCard components showing airline, times, duration, stops, and price in AUD

Given the results are displayed
When I select "Sort by: Cheapest"
Then the flight list reorders from lowest to highest price without a full page reload

Given the results are displayed
When I filter by "Airline: Qantas"
Then only Qantas flights remain visible; the filter can be cleared with an "X" button

Given I search for a route with no available flights
When the results page loads
Then an EmptyState component displays "No flights found for this route. Try different dates."

Given the search has cached results in Redis
When the results page loads
Then the API responds in under 500ms and the page renders flight cards within that time
```

**Implementation Notes:**
- `apps/web/src/app/flights/page.tsx`: RSC with initial fetch; filter UI is Client Component boundary
- `apps/web/src/components/flights/flight-card.tsx`: airline logo, origin→dest, departure/arrival times, duration, stops badge, price (orange accent)
- `apps/web/src/components/flights/flight-filters.tsx`: airline multi-select, stops (nonstop/1-stop/2+), departure time range
- PostgreSQL FTS via `to_tsvector` on `airline + flightNumber + origin + destination` for text search

---

### Story 2.6 — Implement Browsing History for Personalized Promotions

**As a** user,
**I want** my browsing history to influence which deals appear on the homepage,
**So that** I see more relevant destinations based on routes I've searched.

**FRs:** FR6, FR36
**NFRs:** (foundation for personalization)

**Acceptance Criteria:**

```
Given I am a guest (not logged in)
When I view a deal card for "Gold Coast"
Then "Gold Coast" is stored in localStorage under key `tc_browsing_history` as a JSON array with timestamp

Given I am logged in and search for flights to Bali
When the search completes
Then a `POST /api/v1/users/me/browsing-history` call records `{ destination: "DPS", timestamp }` in the database

Given I have Gold Coast browsing history stored
When I return to the homepage
Then the Gold Coast deal card appears first in the promotion grid (personalized order)

Given I am a logged-in user with browsing history
When my session starts fresh (localStorage cleared)
Then the homepage still personalizes based on my server-side browsing history from the database

Given my browsing history has more than 20 entries
When a new entry is added
Then the oldest entry is removed (FIFO, 20-entry cap) both in localStorage and in the database
```

**Implementation Notes:**
- `packages/database/prisma/schema.prisma`: add `BrowsingHistory` model: `id, userId, destination, searchedAt` with index on `userId`
- `POST /api/v1/users/me/browsing-history`: auth required, upserts destination + timestamp
- `apps/web/src/lib/browsing-history.ts`: localStorage read/write utility (20-entry cap)
- Promotion sorting: server merges personalization signal from `Accept` header cookie into promotion ranking

---

## Epic 3: Hotel Search & Bundle Deals

**Goal:** Deliver Amadeus hotel data integration, hotel search with detail view, and the bundle pricing system that shows flight+hotel combined savings — completing the core inventory experience.

**FRs:** FR5, FR15, FR16, FR18, FR19, FR20, FR21
**NFRs:** NFR13

---

### Story 3.1 — Integrate Amadeus Hotel Data with Redis Caching

**As a** system,
**I want** to fetch hotel data from Amadeus and cache results in Redis,
**So that** hotel searches return quickly without repeatedly hitting Amadeus rate limits.

**FRs:** FR48
**NFRs:** NFR13, NFR20

**Acceptance Criteria:**

```
Given a hotel search for Melbourne has never been made before
When `GET /api/v1/hotels?city=MEL&checkIn=2026-05-01&checkOut=2026-05-03&guests=2` is called
Then Amadeus hotel API is called, results stored in Redis with key `amadeus:hotels:MEL:2026-05-01:2026-05-03:2`, TTL 3600s

Given the same hotel search is repeated within 1 hour
When the API endpoint is called
Then Redis returns the cached result in < 100ms and Amadeus is NOT called

Given the Amadeus hotel API returns a rate-limit error
When the request is processed
Then the system applies exponential backoff (1s, 2s, 4s) for 3 retries before returning `AMADEUS_API_ERROR`

Given a BullMQ cron job `sync-hotel-prices` runs every 60 minutes
When it executes
Then hotel cache entries for top destinations are refreshed with fresh Amadeus data

Given a hotel search request with missing `checkIn` parameter
When the endpoint is called
Then HTTP 400 is returned with `{ success: false, error: { code: "VALIDATION_ERROR" } }`
```

**Implementation Notes:**
- `packages/database/prisma/schema.prisma`: add `Hotel` model: `id, name, city, address, starRating, amenities (String[]), pricePerNightAud, imageUrls (String[]), description, amadeusHotelId, latitude, longitude, createdAt, updatedAt`
- `apps/api/src/hotels/amadeus-hotels.service.ts`: Axios client with retry interceptor (shared with flights)
- BullMQ `amadeus-sync` queue: add `sync-hotel-prices` job; cron `0 * * * *`
- `SearchHotelsDto`: `city, checkIn, checkOut, guests` — all required; `checkOut` must be after `checkIn`

---

### Story 3.2 — Build Hotel Search Form and Results Page

**As a** user,
**I want** to search hotels by destination and dates and view results with key details at a glance,
**So that** I can find a hotel that fits my budget and preferences without reading full descriptions.

**FRs:** FR15, FR16
**NFRs:** NFR2

**Acceptance Criteria:**

```
Given I enter destination "Melbourne", check-in "May 1", check-out "May 3", and 2 guests
When I tap "Search Hotels"
Then I navigate to `/hotels?city=MEL&checkIn=2026-05-01&checkOut=2026-05-03&guests=2`

Given the hotel results page loads
When results are displayed
Then each HotelCard shows: hotel name, star rating (1–5 stars), top 3 amenities (icons), price per night in AUD, and a "Select" button

Given the hotel results are displayed
When I sort by "Price: Low to High"
Then the hotel list reorders from lowest to highest `pricePerNight` without a page reload

Given I filter by "Star Rating: 4+ Stars"
When the filter is applied
Then only hotels with `starRating >= 4` are displayed

Given my search returns no results
When the results page renders
Then an EmptyState shows "No hotels available for these dates. Try adjusting your check-in or check-out dates."
```

**Implementation Notes:**
- `apps/web/src/app/hotels/page.tsx`: RSC initial render; filter/sort as Client Component boundary
- `apps/web/src/components/hotels/hotel-card.tsx`: image (next/image), name, stars (filled/empty icons), amenity badges (pool/wifi/parking), price/night, "Select" CTA
- `apps/web/src/components/hotels/hotel-filters.tsx`: star rating checkboxes, price range slider, amenity filter
- `apps/web/src/components/hotels/hotel-search-form.tsx`: city input with autocomplete, date range picker, guests counter

---

### Story 3.3 — Build Hotel Detail View

**As a** user,
**I want** to view a hotel's photos, full description, and amenities before booking,
**So that** I can make an informed decision and feel confident about my accommodation.

**FRs:** FR18
**NFRs:** (UX quality)

**Acceptance Criteria:**

```
Given I tap "Select" on a hotel card in search results
When the hotel detail view opens
Then I see a photo carousel with at least the first image loaded immediately (via next/image priority flag)

Given the hotel detail view is open
When I scroll down
Then I see: full hotel name, address, star rating, complete amenities list, description text, and price per night with total cost for selected dates

Given the hotel detail view is open
When I tap "Book This Hotel"
Then I am navigated to `/booking/hotels/[hotelId]` with the check-in/check-out dates preserved in the URL

Given a hotel has no photos in its `imageUrls` array
When the detail view loads
Then a default hotel placeholder image displays (not a broken image)

Given I am on mobile
When I view the photo carousel
Then I can swipe horizontally between photos and dot indicators show current position
```

**Implementation Notes:**
- Hotel detail view is a slide-up sheet (shadcn/ui `Sheet`) on mobile; modal on desktop
- Photo carousel: shadcn/ui `Carousel` component with `next/image` optimization
- `GET /api/v1/hotels/:id`: returns full hotel object including `imageUrls`, `description`, `amenities`
- Fallback image: `/images/hotel-placeholder.jpg` in `public/`

---

### Story 3.4 — Build Bundle System Backend

**As an** admin,
**I want** to create flight+hotel bundle deals with a fixed discount,
**So that** the platform can offer attractive combined pricing that incentivizes users to book both.

**FRs:** FR20, FR21
**NFRs:** (backend foundation for FR19)

**Acceptance Criteria:**

```
Given an admin creates a bundle with flightId "F123", hotelId "H456", and discount 45 AUD
When `POST /api/v1/admin/bundles` is called with valid data
Then a Bundle record is created with `savingsAmount: 45` and `totalPrice = flight.priceAud + hotel.pricePerNightAud * nights - 45`

Given a bundle exists in the database
When `GET /api/v1/bundles/:id` is called
Then the response includes `{ flightDetails, hotelDetails, totalPrice, savingsAmount, priceBreakdown }`

Given I request bundles for a destination
When `GET /api/v1/bundles?destination=MEL` is called
Then only bundles where `flight.destination == "MEL"` are returned

Given an admin deactivates a bundle
When `PUT /api/v1/admin/bundles/:id` sets `isActive: false`
Then `GET /api/v1/bundles?destination=MEL` no longer returns that bundle

Given a bundle's associated flight no longer exists
When `GET /api/v1/bundles/:id` is called
Then the response returns HTTP 404 with `BUNDLE_NOT_FOUND`
```

**Implementation Notes:**
- `packages/database/prisma/schema.prisma`: add `Bundle` model: `id, flightId (FK), hotelId (FK), savingsAmountAud, isActive, nightsCount, createdAt, updatedAt`
- `totalPrice` is computed at query time: `flight.priceAud + hotel.pricePerNightAud * bundle.nightsCount - bundle.savingsAmountAud`
- `CreateBundleDto`: `flightId, hotelId, savingsAmountAud, nightsCount` — validated
- `apps/api/src/bundles/bundles.module.ts`: public read endpoints + admin CRUD endpoints

---

### Story 3.5 — Display Bundle Deal Cards on Homepage and Search Results

**As a** user,
**I want** to see flight+hotel bundle deals with savings amounts prominently displayed,
**So that** I understand the combined value and am motivated to book both together.

**FRs:** FR5
**NFRs:** NFR1

**Acceptance Criteria:**

```
Given active bundle deals exist in the database
When the homepage loads
Then bundle deal cards appear in the promotions grid with a "Bundle" badge, destination, price, and "Save $X" label

Given I am viewing flight search results for Melbourne
When bundle deals exist for Melbourne
Then a "Bundle Deal" callout card appears above the flight results: "Add a hotel and save $45"

Given a bundle deal card shows "Bali from $299 (flight + hotel)"
When I tap the card
Then the bundle detail page loads showing the specific flight, hotel, individual prices, and "You save $45" breakdown

Given the homepage is rendered server-side
When the bundle cards are included
Then no layout shift occurs when images load (aspect-ratio reserved via CSS)

Given no bundle deals exist for a destination
When I view that destination's flight results
Then no bundle callout appears (not an empty box or placeholder)
```

**Implementation Notes:**
- `apps/web/src/components/home/deal-card.tsx`: extend to handle `dealType: 'bundle'` with savings badge
- Bundle savings badge: green `Save $X` label using `success.600` color token
- `GET /api/v1/bundles?destination=MEL` called in flight results RSC when destination is known
- Bundle deal card links to `/booking/bundles/[bundleId]`

---

## Epic 4: Booking Flow & Payments

**Goal:** Deliver the complete 3-step booking flow (select → passenger/guest details → payment) for flights, hotels, and bundles using Stripe test mode — with idempotent webhook processing and booking confirmation.

**FRs:** FR12, FR13, FR14, FR17, FR19, FR22, FR23, FR24, FR25
**NFRs:** NFR3, NFR8, NFR21

---

### Story 4.1 — Create Booking Data Models and Booking Creation API

**As a** developer,
**I want** Booking, BookingFlight, BookingHotel, and BookingEvent models in Prisma with a booking creation endpoint,
**So that** all booking flows have a reliable data foundation.

**FRs:** FR25 (partial — reference code generation)
**NFRs:** NFR21

**Acceptance Criteria:**

```
Given a valid booking request arrives
When `POST /api/v1/bookings` is called with `{ type: "flight", flightId, passengers }`
Then a Booking record is created with `status: "pending"`, unique `referenceCode` (8-char alphanumeric), and a `BookingFlight` record linked to it

Given a Stripe `payment_intent.succeeded` webhook arrives
When the booking is already in `confirmed` status (duplicate webhook)
Then the webhook is ignored (no DB update) — idempotency enforced via `BookingEvent.stripeEventId` unique constraint

Given a booking is created for a non-existent flight
When `POST /api/v1/bookings` is called with an invalid `flightId`
Then HTTP 404 is returned with `{ success: false, error: { code: "FLIGHT_NOT_FOUND" } }`

Given a booking is created successfully
When the API response is returned
Then it includes `{ bookingId, referenceCode, status: "pending", clientSecret }` for Stripe payment

Given the database is inspected after booking creation
When the `booking_events` table is queried
Then a `booking_created` event record exists with `bookingId`, `status: "pending"`, and `occurredAt`
```

**Implementation Notes:**
- `packages/database/prisma/schema.prisma`: add:
  - `Booking`: `id, userId, referenceCode (unique, 8-char), type (flight/hotel/bundle), status (pending/confirmed/cancelled), totalAmountAud, createdAt, updatedAt`
  - `BookingFlight`: `id, bookingId (FK), flightId (FK), passengerName, passengerEmail, passengerPhone`
  - `BookingHotel`: `id, bookingId (FK), hotelId (FK), guestName, guestEmail, checkIn, checkOut`
  - `BookingEvent`: `id, bookingId (FK), status, stripeEventId (nullable, unique), occurredAt`
- Reference code generation: `nanoid(8).toUpperCase()`
- Stripe `PaymentIntents.create({ amount, currency: 'aud', metadata: { bookingId } })` after DB insert

---

### Story 4.2 — Build Booking Step 1: Selection Summary Card

**As a** user,
**I want** to see a clear summary of the flight or hotel I've selected when I enter the booking flow,
**So that** I can confirm my selection before entering personal details.

**FRs:** FR12, FR17
**NFRs:** NFR3

**Acceptance Criteria:**

```
Given I tap "Select" on a flight card (e.g., QF401 SYD→MEL, 6:00pm, $149)
When I land on the booking page
Then a fixed summary card at the top shows: airline, flight number, origin, destination, departure time, arrival time, and price

Given I tap "Select" on a hotel card
When I land on the booking page
Then the summary card shows: hotel name, star rating, check-in/check-out dates, number of nights, and total price

Given I am in the booking flow
When I scroll down the booking page
Then the 3-step `BookingStepIndicator` shows Step 1 highlighted ("Review Selection")

Given I am viewing the selection summary
When I tap "Change Selection"
Then I am navigated back to the search results page with the same search params

Given the selection summary is displayed
When I tap "Continue to Passenger Details"
Then I proceed to Step 2 of the booking flow
```

**Implementation Notes:**
- `apps/web/src/app/booking/layout.tsx`: `BookingFlowContext` provider wraps all booking routes
- `apps/web/src/components/booking/booking-summary-card.tsx`: sticky top card with selection details
- `apps/web/src/components/booking/booking-step-indicator.tsx`: 3-step progress bar with active step highlight
- `apps/web/src/hooks/use-booking-flow.ts`: React Context for booking state (selected flight/hotel/bundle, passenger details, payment status)
- Selection data stored in `BookingFlowContext` (not URL) to prevent direct URL access to step 2

---

### Story 4.3 — Build Booking Step 2: Passenger/Guest Details Form

**As a** user,
**I want** to enter my passenger or guest details with clear validation,
**So that** my booking has accurate information that matches my ID and I can be contacted.

**FRs:** FR13, FR14
**NFRs:** NFR10

**Acceptance Criteria:**

```
Given I am on Step 2 of the flight booking flow
When the form loads
Then I see fields for: Full Name (as on ID), Email Address, Phone Number — all required and pre-filled from my profile if I am logged in

Given I submit the passenger form with a valid phone number in Australian format (+61 or 04xx)
When validation runs
Then the form proceeds to Step 3 without errors

Given I submit the form with an invalid email (missing @ symbol)
When I tap "Continue to Payment"
Then an inline error "Please enter a valid email address" appears below the email field

Given I am booking a hotel
When I enter guest details
Then the form shows: Guest Name, Email, Phone, and a "Special Requests" optional text field (max 500 chars)

Given I am a logged-in user on the passenger details form
When the form first renders
Then my Google account name and email are pre-filled (but editable)
```

**Implementation Notes:**
- `apps/web/src/components/booking/passenger-details-form.tsx`: React Hook Form + Zod
- Zod schema: `name (min 2 chars, no numbers), email (valid format), phone (E.164 or AU mobile format)`
- `apps/web/src/components/booking/guest-details-form.tsx`: same schema plus `specialRequests (optional, max 500)`
- Pre-fill: reads from `useAuth()` session; user can override
- Form data stored in `BookingFlowContext` for use in Step 3 API call

---

### Story 4.4 — Integrate Stripe Test Mode Payment

**As a** user,
**I want** to pay for my booking with a credit card using Stripe,
**So that** my booking is confirmed securely without my card details ever touching TravelClone's servers.

**FRs:** FR22
**NFRs:** NFR8, NFR21

**Acceptance Criteria:**

```
Given I am on the payment step of booking
When the Stripe Elements form renders
Then I see a card input field (number, expiry, CVC) rendered by Stripe.js — not a custom input

Given I enter Stripe test card number 4242 4242 4242 4242
When I tap "Pay $149 AUD"
Then Stripe.js tokenizes the card client-side, `confirmPayment` is called, and a Stripe `payment_intent.succeeded` webhook is sent to `/api/v1/webhooks/stripe`

Given the webhook arrives at `/api/v1/webhooks/stripe`
When the webhook signature is verified via Stripe secret and the bookingId matches
Then the booking status is updated to `confirmed` and a `booking_confirmed` event is recorded in `booking_events`

Given the same webhook event ID arrives twice (Stripe retry)
When the second webhook is processed
Then the duplicate is detected via `BookingEvent.stripeEventId` unique constraint and no duplicate state change occurs

Given the payment fails (Stripe test card 4000 0000 0000 0002)
When `confirmPayment` is called
Then an error message "Your card was declined. Please try a different card." appears below the Stripe Elements form
```

**Implementation Notes:**
- `apps/web/src/lib/stripe.ts`: `loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)` singleton
- `apps/web/src/components/booking/stripe-payment-form.tsx`: `<Elements>` + `<CardElement>` from `@stripe/react-stripe-js`
- `apps/api/src/payments/payments.controller.ts`: `POST /api/v1/webhooks/stripe` with `rawBody` middleware for signature verification
- `apps/api/src/payments/payments.service.ts`: idempotency check via `prisma.bookingEvent.findUnique({ where: { stripeEventId } })`
- Webhook handler enqueues BullMQ `send-booking-confirmation` job after status update

---

### Story 4.5 — Build Booking Step 3: Payment Confirmation Page

**As a** user,
**I want** to see a full cost breakdown before paying and a confirmation page after payment succeeds,
**So that** I never encounter surprise charges and I have proof of my booking.

**FRs:** FR23, FR24, FR25
**NFRs:** NFR3

**Acceptance Criteria:**

```
Given I am on the payment step
When the page renders
Then a price breakdown shows each line item: base fare/hotel rate, taxes/fees, and total in AUD — and the "Pay" button displays the exact total amount

Given payment succeeds
When the booking confirmation page loads at `/confirmation/[bookingId]`
Then I see: booking reference code, flight/hotel summary, traveler name, total paid, and a prominent "Add to Calendar" button

Given the confirmation page loads
When I share the page URL with a friend
Then the page displays the booking summary without requiring them to log in (public read by reference code)

Given I tap "Add to Calendar"
When the action executes
Then an `.ics` file downloads or the device's calendar app opens with the trip dates and destination pre-filled

Given payment fails and I retry successfully
When the confirmation page loads
Then only one booking record exists (not duplicate bookings from two payment attempts)
```

**Implementation Notes:**
- `apps/web/src/app/confirmation/[bookingId]/page.tsx`: RSC, fetches `GET /api/v1/bookings/:referenceCode`
- `apps/web/src/components/booking/price-breakdown.tsx`: line items: base price, service fee, GST, total
- `apps/web/src/components/shared/booking-confirmation.tsx`: shareable card with reference code, QR code (post-MVP), "Add to Calendar" link
- ICS generation: simple RFC 5545 template using booking dates and destination
- "Add to Calendar" link: `data:text/calendar;base64,...` download or `webcal://` URI

---

### Story 4.6 — Build Bundle Booking Flow

**As a** user,
**I want** to book a flight and hotel together as a bundle in a single checkout,
**So that** I get the combined discount and complete the booking in one transaction.

**FRs:** FR19
**NFRs:** NFR3

**Acceptance Criteria:**

```
Given I tap a bundle deal card
When the bundle booking page at `/booking/bundles/[bundleId]` loads
Then the summary card shows both the flight AND hotel details with individual prices, savings amount, and the total discounted price

Given I am on the bundle passenger details step
When I fill in passenger details
Then a single form captures details for both the flight (passenger name/contact) and hotel (guest name/check-in preferences)

Given bundle passenger details are submitted
When I proceed to payment
Then the Stripe payment intent is created for the full bundle price (flight + hotel - discount) as a single charge

Given bundle payment succeeds
When the confirmation page loads
Then the booking confirmation shows BOTH the flight itinerary AND the hotel stay with separate reference numbers for each component

Given I'm viewing the bundle booking on mobile
When Step 2 renders (details form)
Then the BookingStepIndicator shows 3 steps and the current step is highlighted correctly
```

**Implementation Notes:**
- `apps/web/src/app/booking/bundles/[bundleId]/page.tsx`: extends `BookingFlowContext` with bundle mode
- Bundle booking API: `POST /api/v1/bookings` with `{ type: "bundle", bundleId, passengerDetails, guestDetails }`
- Creates both `BookingFlight` and `BookingHotel` records in a single Prisma transaction
- Single Stripe `PaymentIntent` for total bundle price
- `BookingFlowContext` `type` field: `'flight' | 'hotel' | 'bundle'`

---

## Epic 5: Budget-First Discovery

**Goal:** Deliver the budget-first discovery feature — a homepage widget where users enter their budget and origin city and receive a sorted list of destination options within their budget.

**FRs:** FR7, FR8, FR9
**NFRs:** NFR4

---

### Story 5.1 — Build Budget Discovery API Endpoint

**As a** system,
**I want** a budget discovery API that finds destinations reachable within a specified budget from a given origin city,
**So that** users with a fixed budget can discover where they can actually go.

**FRs:** FR7, FR8
**NFRs:** NFR4

**Acceptance Criteria:**

```
Given I call `GET /api/v1/budget-discovery?origin=SYD&budget=500&nights=3`
When the query executes
Then destinations are returned sorted by `totalTripCost` (flight round-trip + hotel for nights) where `totalTripCost <= 500`

Given the query is called with origin "Melbourne" and budget $300
When results are returned
Then each destination card includes: `destination, city, lowestFlightPrice, lowestHotelPricePerNight, totalTripCost, savings (vs budget)`

Given the query returns results
When the response is inspected
Then it is cached in Redis at `budget:discovery:SYD:500:3` with TTL 1800s (30min)

Given no destinations are available under the specified budget
When the API is called with `budget=50`
Then an empty array is returned with HTTP 200 and `meta.total: 0`

Given the origin is an unknown city
When the API is called with `origin=UNKNOWN`
Then HTTP 400 is returned with `{ success: false, error: { code: "VALIDATION_ERROR", message: "Unknown origin city" } }`
```

**Implementation Notes:**
- `apps/api/src/budget/budget-discovery.service.ts`: SQL query joins `flights` + `hotels` tables, groups by destination, takes `MIN(price)` per destination, filters by `totalCost <= budget`
- `GET /api/v1/budget-discovery`: public endpoint (no auth required)
- `BudgetDiscoveryDto`: `origin (required), budget (number, min 50), nights (1–30, default 3), departureMonth (optional)`
- PostgreSQL indexes on `flights.origin`, `flights.destination`, `flights.priceAud`; `hotels.city`, `hotels.pricePerNightAud`
- Cache key: `budget:discovery:{origin}:{budget}:{nights}`; TTL 1800s

---

### Story 5.2 — Build Budget Discovery Widget on Homepage

**As a** user,
**I want** a "Where can I go?" widget on the homepage where I enter my budget and city,
**So that** I can discover travel options without knowing a specific destination in mind.

**FRs:** FR7
**NFRs:** NFR1

**Acceptance Criteria:**

```
Given I am on the homepage
When I scroll past the promotion deal cards
Then I see a "Where can I go?" widget with fields: Budget ($), From (city), How many nights?

Given I enter Budget $500, From Sydney, 3 nights
When I tap "Find Destinations"
Then I am navigated to `/budget-discovery?origin=SYD&budget=500&nights=3`

Given I enter a budget below $50
When I tap "Find Destinations"
Then an inline error "Minimum budget is $50" appears and navigation does not occur

Given I am on mobile
When I interact with the budget input
Then a numeric keyboard appears (input type="number")

Given the widget loads on the homepage
When it renders
Then it does not block the initial homepage FCP — it loads below the deal card grid
```

**Implementation Notes:**
- `apps/web/src/components/home/budget-discovery-widget.tsx`: Client Component (interactive form)
- Fields: `budget` (number input, min 50, max 50000, AUD prefix), `origin` (city select or text input), `nights` (stepper, 1–30, default 3)
- React Hook Form + Zod validation; submit navigates to `/budget-discovery` with query params
- Widget renders below the deal card grid in `apps/web/src/app/page.tsx`
- Lazy loaded with `dynamic(() => import(...), { ssr: false })` to avoid hydration mismatch

---

### Story 5.3 — Build Budget Discovery Results Page

**As a** user,
**I want** to see destination cards showing where I can travel within my budget sorted by cost,
**So that** I can tap a destination and immediately proceed to book that trip.

**FRs:** FR9
**NFRs:** NFR4

**Acceptance Criteria:**

```
Given I navigate to `/budget-discovery?origin=SYD&budget=500&nights=3`
When the page loads
Then results appear within 3 seconds showing destination cards sorted by `totalTripCost` ascending

Given results are displayed
When I view a destination card
Then it shows: destination city name, country, a destination photo, lowest flight price, lowest hotel price/night, and total trip cost highlighted in orange

Given I tap a destination card for "Bali"
When the navigation occurs
Then I am taken to `/flights?origin=SYD&destination=DPS&budget=500` with flights pre-filtered for this budget

Given my budget is $500 and a destination shows "Total $480"
When I view the card
Then a green "Fits your budget" badge appears and remaining budget ($20) is shown

Given no destinations are found within my budget
When the results page loads
Then an EmptyState displays "No destinations found under $[budget]. Try increasing your budget or reducing your trip length." with a "Adjust Budget" button
```

**Implementation Notes:**
- `apps/web/src/app/budget-discovery/page.tsx`: Client Component (interactive; no SEO value)
- `apps/web/src/components/home/budget-discovery-widget.tsx`: reused at top of results page for adjusting params
- Destination card: shadcn/ui `Card` with `next/image` destination photo, price summary, "Fits your budget" badge
- Uses `useQuery` from TanStack Query hitting `GET /api/v1/budget-discovery`
- `staleTime: 30 * 60 * 1000` (30min, matches Redis TTL)

---

## Epic 6: Post-Booking Management & Notifications

**Goal:** Deliver My Bookings list, booking detail view, self-service cancellation with refund calculation, and all email notifications — completing the end-to-end booking lifecycle.

**FRs:** FR26, FR27, FR28, FR29, FR30, FR31, FR32
**NFRs:** NFR22

---

### Story 6.1 — Build "My Bookings" Page with Tab Navigation

**As a** user,
**I want** to see all my bookings organized by status,
**So that** I can quickly find upcoming trips and review past travel.

**FRs:** FR26
**NFRs:** (auth-protected route)

**Acceptance Criteria:**

```
Given I am signed in with 3 upcoming and 2 past bookings
When I navigate to `/my-bookings`
Then I see 3 tabs: "Upcoming" (active), "Past", "Cancelled" — with the booking count badge on each tab

Given I am on the "Upcoming" tab
When the page renders
Then each BookingListItem shows: destination, travel dates, booking reference, total paid, and status badge

Given I tap the "Past" tab
When it renders
Then I see completed bookings sorted by travel date descending (most recent first)

Given I have no cancelled bookings
When I tap the "Cancelled" tab
Then an EmptyState shows "No cancelled bookings" with a "Browse Deals" CTA

Given I am not logged in and navigate to `/my-bookings`
When the page loads
Then I am redirected to `/auth/signin?returnTo=/my-bookings`
```

**Implementation Notes:**
- `apps/web/src/app/my-bookings/page.tsx`: RSC (protected); fetches `GET /api/v1/bookings/my` with `status` filter
- `GET /api/v1/bookings/my?status=upcoming|past|cancelled`: auth required; returns user's bookings filtered by status
- `apps/web/src/components/bookings/booking-list-item.tsx`: compact card with status badge, dates, destination, reference, price
- `apps/web/src/components/bookings/booking-status-badge.tsx`: color-coded: `confirmed` (green), `pending` (yellow), `cancelled` (red)
- Tabs implemented via shadcn/ui `Tabs` component

---

### Story 6.2 — Build Booking Detail View with Full Itinerary

**As a** user,
**I want** to view the complete itinerary for a booking,
**So that** I have all the trip details I need in one place.

**FRs:** FR27

**Acceptance Criteria:**

```
Given I tap a booking in My Bookings
When `/my-bookings/[bookingId]` loads
Then I see the full itinerary: airline, flight number, departure/arrival with times and airports, hotel name, check-in/check-out, total cost breakdown, and booking reference code

Given the booking is for a bundle
When the detail page loads
Then both the flight section AND the hotel section are displayed with a "Bundle savings: $X" line in the price breakdown

Given the booking is confirmed
When the detail page renders
Then the status badge shows "Confirmed" in green and a "Download Itinerary" button is visible

Given I tap "Download Itinerary"
When the action runs
Then a PDF or `.ics` file is prepared and the browser downloads it automatically

Given I access `/my-bookings/[bookingId]` for another user's booking
When the page loads
Then HTTP 403 is returned and the error page shows "You don't have permission to view this booking"
```

**Implementation Notes:**
- `apps/web/src/app/my-bookings/[bookingId]/page.tsx`: RSC; fetches `GET /api/v1/bookings/:id`
- `GET /api/v1/bookings/:id`: auth guard checks `booking.userId === req.user.id`; returns nested flight, hotel, booking events
- `apps/web/src/components/bookings/booking-detail-card.tsx`: full itinerary layout with sections for flight, hotel, payment summary
- `apps/web/src/components/booking/price-breakdown.tsx`: reused component with line items

---

### Story 6.3 — Implement Self-Service Cancellation with Refund Calculation

**As a** user,
**I want** to cancel a booking myself and see the exact refund amount before confirming,
**So that** I can manage my trips without contacting customer support.

**FRs:** FR28, FR29, FR30

**Acceptance Criteria:**

```
Given I am viewing a confirmed booking detail page
When I tap "Cancel Booking"
Then a modal appears showing the cancellation policy and the calculated refund amount

Given I am cancelling a booking more than 48 hours before departure
When the cancellation modal opens
Then it shows "Full refund: $[totalAmount] — No cancellation fee" and a green "Confirm Cancellation" button

Given I am cancelling within 48 hours but more than 24 hours before departure
When the modal opens
Then it shows "Partial refund: $[totalAmount - 30]. Cancellation fee: $30."

Given I confirm the cancellation
When `POST /api/v1/bookings/:id/cancel` is called
Then the booking status is updated to `cancelled`, a `booking_cancelled` event is recorded, and the refund amount is stored in the booking record

Given I attempt to cancel an already cancelled booking
When `POST /api/v1/bookings/:id/cancel` is called
Then HTTP 400 is returned with `{ success: false, error: { code: "BOOKING_ALREADY_CANCELLED" } }`
```

**Implementation Notes:**
- `apps/web/src/components/bookings/cancellation-modal.tsx`: shadcn/ui `Dialog`; shows policy tiers and refund amount
- Cancellation policy tiers: `> 48h: 100% refund`, `24–48h: refund - $30 fee`, `< 24h: no refund`
- `POST /api/v1/bookings/:id/cancel`: validates window, calculates refund, updates status, enqueues BullMQ `send-cancellation-confirmation`
- Refund processing via Stripe `Refunds.create({ payment_intent: booking.stripePaymentIntentId, amount: refundAmountCents })`
- Refund calculation logic extracted to `apps/api/src/bookings/cancellation-policy.service.ts`

---

### Story 6.4 — Set Up BullMQ Email Infrastructure with React Email Templates

**As a** developer,
**I want** BullMQ email workers with React Email templates connected to Mailtrap,
**So that** all transactional emails are sent asynchronously without blocking booking API responses.

**FRs:** (foundation for FR31, FR32)
**NFRs:** NFR22

**Acceptance Criteria:**

```
Given BullMQ is configured with Redis DB 1
When an email job is enqueued to the `email` queue
Then the `EmailWorker` picks it up within 5 seconds and calls the Mailtrap SMTP server

Given an email template is rendered via `@react-email/render`
When the booking confirmation template receives `{ recipientName, bookingReference, flightDetails, totalAmount }`
Then the rendered HTML is a valid HTML email with correct data substitution

Given Mailtrap SMTP is unreachable
When the EmailWorker attempts to send
Then the job is retried 3 times with exponential backoff (1s, 2s, 4s) before being moved to the dead-letter queue

Given the email queue is healthy
When `GET /api/health` is called
Then the response includes `{ queues: { email: "active" } }`

Given a job lands in the dead-letter queue
When the system processes it
Then a Pino `error` log is emitted with `{ jobId, queue: "email", attempts: 3, lastError }` for debugging
```

**Implementation Notes:**
- `apps/api/src/email/email.worker.ts`: BullMQ `Worker` on `email` queue; uses `nodemailer` + Mailtrap SMTP config
- `apps/api/src/email/templates/booking-confirmation.tsx`: `@react-email/components` — `Html, Head, Body, Container, Text, Button`
- `apps/api/src/email/templates/cancellation-confirmation.tsx`: similar structure with refund details
- BullMQ Redis: DB 1 (`redis://localhost:6379/1`); main cache on DB 0
- Dead-letter queue: BullMQ `removeOnFail: { count: 3 }` + `failedEventHandler` logs to Pino

---

### Story 6.5 — Implement Booking and Cancellation Email Notifications

**As a** user,
**I want** to receive a confirmation email after booking and a cancellation email after cancelling,
**So that** I have a permanent record of my booking and any changes to it.

**FRs:** FR31, FR32

**Acceptance Criteria:**

```
Given a Stripe `payment_intent.succeeded` webhook is processed successfully
When the EmailWorker receives the `send-booking-confirmation` job
Then an HTML email is sent to the user's address with: subject "Your booking is confirmed! [REF]", itinerary summary, reference code, and total amount paid

Given I cancel a booking via `POST /api/v1/bookings/:id/cancel`
When the cancellation is processed
Then a `send-cancellation-confirmation` job is enqueued and an email is sent with: subject "Booking cancelled — [REF]", refund amount, estimated refund timeline (5-7 business days)

Given the confirmation email is sent
When I open it in Gmail or Apple Mail
Then all images load, text is readable on mobile screens, and the TravelClone branding (#0064D2 primary color) is visible

Given I check Mailtrap inbox during development
When a booking is completed
Then the confirmation email appears within 30 seconds of payment webhook processing

Given an admin resends a confirmation email via the admin dashboard
When the admin action fires
Then a `resend-confirmation` job is enqueued and the same confirmation email is resent to the user's address
```

**Implementation Notes:**
- BullMQ job payload for `send-booking-confirmation`: `{ bookingId, userId, email, recipientName, referenceCode }`
- Email templates in `apps/api/src/email/templates/`: use `@react-email/components`; no inline images (CDN URLs only)
- Mailtrap config via `MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, MAILTRAP_PASS` env vars
- `resend-confirmation` job triggered by admin action (covered in Story 7.4)

---

## Epic 7: Admin Dashboard

**Goal:** Deliver a fully functional Refine-based admin dashboard where operators can manage flights, hotels, promotions, bundles, bookings, and users.

**FRs:** FR37, FR38, FR39, FR40, FR41, FR42, FR43, FR44, FR45, FR46
**NFRs:** NFR9

---

### Story 7.1 — Set Up Refine Admin Dashboard with Auth and Navigation

**As an** admin,
**I want** a clean admin dashboard at `/admin` with sidebar navigation and secure authentication,
**So that** I can access all platform management features from a single interface.

**FRs:** FR37
**NFRs:** NFR9

**Acceptance Criteria:**

```
Given I navigate to `/admin` without authentication
When the page loads
Then I am redirected to the admin login page at `/admin/login`

Given I log in with valid admin credentials (Google OAuth with role: admin)
When authentication succeeds
Then I land on the admin overview page showing key metrics: total bookings (this week), active promotions count, pending refunds

Given I am authenticated as admin
When I view the sidebar
Then navigation items are: Overview, Flights, Hotels, Promotions, Bundles, Bookings, Users, Data Sync

Given I log in with a user account (non-admin role)
When authentication is checked server-side
Then I am shown "Access denied — Admin role required" and cannot access any admin routes

Given I resize the admin window to tablet viewport (768px)
When the layout renders
Then the sidebar collapses to an icon-only rail and content area remains usable
```

**Implementation Notes:**
- `apps/admin/src/app/App.tsx`: Refine `<Refine>` root with `routerProvider`, `authProvider`, `dataProvider`
- `authProvider`: calls `GET /api/v1/users/me` to verify `role === 'admin'`; redirects to `/admin/login` otherwise
- `dataProvider`: `@refinedev/simple-rest` pointing to `NEXT_PUBLIC_API_URL/api/v1/admin`
- Sidebar resources: `flights, hotels, promotions, bundles, bookings, users`
- Overview metrics: `GET /api/v1/admin/metrics` returns `{ weeklyBookings, activePromotions, pendingRefunds }`

---

### Story 7.2 — Build Flight and Hotel CRUD Management Pages

**As an** admin,
**I want** to create, view, edit, and delete flight and hotel listings,
**So that** the platform inventory stays current and accurate.

**FRs:** FR38, FR39

**Acceptance Criteria:**

```
Given I navigate to the Flights section in admin
When the list page loads
Then I see a table of flights with columns: Flight Number, Airline, Origin, Destination, Departure, Price (AUD), and Actions (Edit/Delete)

Given I click "Create Flight"
When I fill in all required fields and submit
Then `POST /api/v1/admin/flights` creates a new flight record and it appears in the list within 1 second (optimistic update)

Given I click Edit on a flight record
When I change the price and click "Save"
Then `PUT /api/v1/admin/flights/:id` updates the record and the Redis cache for that route is invalidated

Given I click Delete on a flight
When I confirm the deletion in the confirmation dialog
Then `DELETE /api/v1/admin/flights/:id` removes the record and a success toast appears

Given I navigate to the Hotels section
When the list renders
Then I see hotel cards with name, city, star rating, price/night, and Edit/Delete actions — mirroring the flight CRUD pattern
```

**Implementation Notes:**
- Refine `<List>`, `<Create>`, `<Edit>`, `<Show>` components for both flights and hotels
- `apps/admin/src/pages/flights/`: list, create, edit pages using Refine + Ant Design table/form
- Admin flight API: `GET/POST/PUT/DELETE /api/v1/admin/flights` with `@Roles('admin')` guard
- Admin hotel API: same pattern at `/api/v1/admin/hotels`
- On flight/hotel update: enqueue `cache-invalidation` job for related Amadeus cache keys

---

### Story 7.3 — Build Promotion and Bundle Management

**As an** admin,
**I want** to create promotions with targeting rules and manage flight+hotel bundle deals,
**So that** I can run time-sensitive campaigns and curated bundle offers without engineering support.

**FRs:** FR40, FR41

**Acceptance Criteria:**

```
Given I click "Create Promotion"
When I fill in title, deal type, target city, target days of week, price from, and expiry date
Then `POST /api/v1/admin/promotions` creates the promotion and it appears on the homepage for matching users within 15 minutes

Given I set a promotion's `targetCity` to "Sydney" and `targetDaysOfWeek` to ["Friday", "Saturday"]
When the homepage is loaded by a Melbourne user on a Friday
Then the Sydney promotion does NOT appear in their promotion cards

Given a promotion's expiry date has passed
When `GET /api/v1/promotions/active` is called
Then the expired promotion is excluded regardless of other targeting criteria

Given I create a bundle linking flight "QF401" and hotel "Mercure Melbourne"
When I set `savingsAmountAud: 45` and click "Create Bundle"
Then `POST /api/v1/admin/bundles` creates the bundle and `GET /api/v1/bundles?destination=MEL` returns it with correct total price

Given I deactivate a bundle
When `PUT /api/v1/admin/bundles/:id` sets `isActive: false`
Then it no longer appears in user-facing bundle queries within 5 minutes (after cache expiry)
```

**Implementation Notes:**
- Refine promotion list/create/edit pages with targeting rule form fields
- `targetDaysOfWeek`: multi-select checkboxes (Mon–Sun)
- `targetSeasons`: multi-select (Summer, Autumn, Winter, Spring)
- Bundle create form: flight search dropdown (by flight number), hotel search dropdown (by name/city), savings amount input, nights count
- Cache invalidation on promotion create/update: BullMQ `invalidate-promotion-cache` job

---

### Story 7.4 — Build Booking Management with Refund and Email Resend

**As an** admin,
**I want** to search bookings by email or reference code, view the status timeline, process refunds, and resend confirmation emails,
**So that** I can handle customer support requests without database access.

**FRs:** FR42, FR43, FR44, FR45

**Acceptance Criteria:**

```
Given I enter a user's email in the admin bookings search
When the search runs
Then all bookings for that email appear sorted by created date descending, showing reference code, status, total, and dates

Given I click on a booking
When the detail view opens
Then the booking event timeline shows: "Created — [timestamp]", "Payment Confirmed — [timestamp]", each event with its ISO timestamp

Given a booking is in `confirmed` status and I click "Process Refund"
When I enter the refund amount and confirm
Then `POST /api/v1/admin/bookings/:id/refund` calls Stripe Refunds API and updates the booking's `refundAmount` field

Given I click "Resend Confirmation Email" on a booking
When the action runs
Then a `resend-confirmation` BullMQ job is enqueued and the user receives the email within 60 seconds

Given I search by booking reference code "XK72P9A3"
When the search runs
Then only the exact booking with that reference code is returned
```

**Implementation Notes:**
- `GET /api/v1/admin/bookings?email=&referenceCode=`: supports both search params
- `GET /api/v1/admin/bookings/:id`: returns booking with nested `bookingEvents` array (timeline)
- `POST /api/v1/admin/bookings/:id/refund`: `{ refundAmountAud }` body; validates `refundAmountAud <= booking.totalAmountAud`
- `POST /api/v1/admin/bookings/:id/resend-email`: enqueues `resend-confirmation` job
- Refine `<Show>` for booking detail with custom timeline component

---

### Story 7.5 — Build User Management and Amadeus Data Sync Monitoring

**As an** admin,
**I want** to view and manage user accounts and monitor the Amadeus data sync status,
**So that** I can maintain platform health and handle account issues proactively.

**FRs:** FR46, FR50 (monitoring aspect)

**Acceptance Criteria:**

```
Given I navigate to the Users section in admin
When the user list loads
Then I see a table with: name, email, role, account created date, and total booking count

Given I click on a user's row
When the detail view opens
Then I see their full profile, all their bookings (linked to booking detail), and a "Change Role" action

Given I promote a user to admin via "Change Role: admin"
When `PUT /api/v1/admin/users/:id` is called with `{ role: "admin" }`
Then the user's next login reflects the new role in their session

Given I navigate to the Data Sync section
When the page loads
Then I see the last sync timestamp for flights and hotels, count of cached routes, and a "Trigger Manual Sync" button per data type

Given I click "Trigger Manual Sync" for flights
When the action fires
Then a BullMQ `sync-flight-prices` job is immediately enqueued and the "Last synced" timestamp updates within 35 minutes
```

**Implementation Notes:**
- `GET /api/v1/admin/users`: paginated, with booking count aggregation via Prisma `_count`
- `PUT /api/v1/admin/users/:id`: updates `role` only; other fields (email, name) are read-only in admin
- Data sync monitoring: `GET /api/v1/admin/sync-status` returns `{ flights: { lastSync, cachedRoutes }, hotels: { lastSync, cachedHotels } }` — queries Redis key metadata
- Manual sync: `POST /api/v1/admin/sync` with `{ type: "flights" | "hotels" }` enqueues immediate BullMQ job
- Refine custom page for sync status (not standard CRUD resource)

---

## Epic 8: PWA, Performance & Accessibility

**Goal:** Configure PWA capabilities (offline shell, home screen install), optimize for Lighthouse 90+, implement WCAG 2.1 AA accessibility, build responsive layouts for all breakpoints, and set up GitHub Actions CI/CD.

**FRs:** (cross-cutting quality; no specific FRs but enables all NFRs)
**NFRs:** NFR5, NFR12, NFR14, NFR15, NFR16, NFR17, NFR18, NFR19

---

### Story 8.1 — Configure PWA Service Worker, Manifest, and Install Prompt

**As a** mobile user,
**I want** to install TravelClone on my home screen and have the app shell load even when offline,
**So that** I can access my bookings anytime and the app feels native.

**FRs:** (PWA requirement from product scope)
**NFRs:** NFR5

**Acceptance Criteria:**

```
Given I visit TravelClone on Chrome Android for the first time
When the browser detects the PWA criteria are met (HTTPS, manifest, service worker)
Then an "Add to Home Screen" install prompt appears (or the browser's native install banner appears)

Given I have installed TravelClone on my home screen
When I launch it from the icon
Then the app opens in `standalone` mode (no browser chrome) with `theme_color: #0064D2` in the status bar

Given I lose network connectivity while using the app
When I navigate to a page previously visited
Then the app shell loads from service worker cache and shows a "You're offline — some content may be unavailable" banner

Given TravelClone has a manifest.json
When Lighthouse audits the page
Then it passes "Installable" criteria with correct icons (192×192 and 512×512 PNG)

Given a user visits for the third time (tracked via localStorage visit count)
When the homepage loads on their third visit
Then the PWA install prompt widget appears at the bottom of the screen via `pwa-install-prompt.tsx`
```

**Implementation Notes:**
- `apps/web/next.config.js`: `next-pwa` config with `dest: 'public'`, `register: true`, `skipWaiting: true`
- `apps/web/public/manifest.json`: `name, short_name, theme_color: "#0064D2"`, `background_color: "#F8FAFC"`, `display: "standalone"`, `icons`
- Service worker runtime caching: promotions (`StaleWhileRevalidate`, 15min), images (`CacheFirst`, 1 day)
- `apps/web/src/components/shared/pwa-install-prompt.tsx`: `beforeinstallprompt` event captured; shown on 3rd visit
- Visit count: localStorage key `tc_visit_count` incremented on each page load

---

### Story 8.2 — Implement Responsive Layouts for All Key Pages

**As a** mobile user,
**I want** all pages to be fully usable on my phone without horizontal scrolling or tiny tap targets,
**So that** I can complete bookings comfortably on a 375px screen.

**FRs:** (responsive design requirement)
**NFRs:** NFR12

**Acceptance Criteria:**

```
Given I view the homepage on a 375px wide device
When the page renders
Then deal cards display in a single column, the header shows only the logo and auth button, and no horizontal overflow occurs

Given I view the flight search results on a 375px device
When the results render
Then FlightCard components stack vertically, the filter panel is hidden by default behind a "Filter" button that opens a bottom sheet

Given I view the booking flow on a 375px device
When each step renders
Then the BookingStepIndicator, form fields, and CTA button all fit within the viewport without overflow

Given I use a 1024px+ desktop viewport
When any page renders
Then content is constrained to a max-width container (1200px), centered, with desktop-appropriate layouts (2–3 column grids)

Given any interactive button on any page
When measured
Then its tap target is at least 44×44px on mobile viewports (per WCAG 2.5.5)
```

**Implementation Notes:**
- Tailwind breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px` — follow mobile-first approach
- `apps/web/src/components/layout/page-container.tsx`: `max-w-screen-xl mx-auto px-4`
- Filter panels: use shadcn/ui `Sheet` (slides from bottom on mobile, appears inline on desktop via `md:block`)
- All CTA buttons: `min-h-[44px] min-w-[44px]` via Tailwind utilities

---

### Story 8.3 — Performance Optimization for Lighthouse 90+ Score

**As a** developer,
**I want** all key pages to score 90+ on Lighthouse Performance,
**So that** TravelClone meets its performance SLA and users on slow connections get a fast experience.

**FRs:** (performance requirement)
**NFRs:** NFR1, NFR2, NFR5

**Acceptance Criteria:**

```
Given Lighthouse runs on the homepage in a CI environment
When the audit completes
Then Performance score is >= 90, FCP < 1.5s, LCP < 2.5s, CLS < 0.1

Given a flight results page loads with 20 flight cards
When `next/image` renders hotel/airline images
Then images use `width`, `height`, and `priority` props correctly — no CLS from image loading

Given the bundle detail page loads with 3 hotel photos
When the Lighthouse audit runs
Then unused JavaScript is < 100KB (code splitting per route is effective)

Given search results are served from Redis cache
When `GET /api/v1/flights` is measured with k6 or curl
Then p95 response time is under 500ms for cached searches

Given the web app is built with `pnpm turbo build`
When bundle analysis is run
Then no single chunk exceeds 250KB gzipped
```

**Implementation Notes:**
- `next/image`: all images use `alt`, `width`, `height`; above-the-fold images use `priority`
- Dynamic imports for heavy Client Components: `FlightFilters`, `BudgetDiscoveryWidget`, `StripePaymentForm`
- `apps/web/next.config.js`: `images.domains` configured for Amadeus CDN URLs
- React Query `staleTime: 300000` prevents redundant refetches
- Tailwind CSS purge configured; no unused utility classes in production build

---

### Story 8.4 — WCAG 2.1 AA Compliance for All Booking Flows

**As a** user with accessibility needs,
**I want** to complete a booking using only a keyboard and screen reader,
**So that** TravelClone is usable for everyone, not just mouse users.

**FRs:** (accessibility requirement)
**NFRs:** NFR16, NFR17, NFR18, NFR19

**Acceptance Criteria:**

```
Given I navigate the flight search form using only Tab and Enter keys
When I move through origin, destination, dates, and passengers fields
Then focus moves in logical order, all fields are reachable, and I can submit the form without a mouse

Given a screen reader (VoiceOver on iOS or NVDA on Windows) reads the homepage
When deal cards are announced
Then each card reads: "[destination] from $[price], [deal type], activate to view details" — not just the raw image filename

Given any page is rendered
When the color contrast of body text (#111827 on #FFFFFF) is measured
Then the contrast ratio is >= 4.5:1 (passes WCAG AA for normal text)

Given `next/image` renders a destination photo
When the HTML is inspected
Then every image with meaningful content has a descriptive `alt` attribute; decorative images have `alt=""`

Given a modal (e.g., cancellation confirmation) opens
When focus is trapped inside the modal
Then pressing Tab cycles only within the modal and pressing Escape closes it
```

**Implementation Notes:**
- shadcn/ui components (Radix UI primitives) provide ARIA roles and keyboard handling by default
- Custom components (`DealCard`, `FlightCard`, `HotelCard`): add `role="article"`, `aria-label`
- `apps/web/src/components/bookings/cancellation-modal.tsx`: Radix `Dialog` handles focus trap automatically
- ESLint plugin `jsx-a11y` in `packages/eslint-config`: enforces `alt`, `aria-*`, `role` at lint time
- Color palette validation: `#0064D2` on white = 7.2:1 (passes); `#FF6B00` (accent/price) used only for large text (14px bold+) = 3.1:1 (passes AA large text)

---

### Story 8.5 — Set Up GitHub Actions CI/CD Pipeline

**As a** developer,
**I want** automated CI checks (lint, typecheck, test, build) and CD deployment on every main branch merge,
**So that** broken code never reaches production and deployments are consistent and repeatable.

**FRs:** (CI/CD requirement from project scope)
**NFRs:** NFR6, NFR15

**Acceptance Criteria:**

```
Given a developer pushes a branch and opens a pull request
When GitHub Actions CI runs
Then 4 stages execute in sequence: lint (turbo lint) → typecheck (turbo typecheck) → test (turbo test) → build (docker build all images)

Given the lint stage fails due to an ESLint error
When the PR check updates
Then the PR shows a red "lint" check with a link to the failure details, and merge is blocked

Given a merge to main branch occurs with all checks passing
When the CD pipeline runs
Then `docker compose up -d --build` is executed on the production server via SSH and the deployment completes without downtime

Given the CI pipeline runs
When `pnpm turbo typecheck` executes
Then all TypeScript files in apps/web, apps/api, and apps/admin compile without errors (`tsc --noEmit`)

Given the Docker build stage runs
When all 3 app images (web, api, admin) are built
Then each image is tagged with the git commit SHA and pushed to the container registry
```

**Implementation Notes:**
- `.github/workflows/ci.yml`: jobs: `lint`, `typecheck`, `test`, `build` — sequential with `needs`
- `.github/workflows/deploy.yml`: triggers on `push: branches: [main]`; SSH action to production server
- `turbo.json` pipeline: `lint`, `typecheck`, `test`, `build` all defined with correct `dependsOn`
- Docker images tagged: `travelclone/web:${{ github.sha }}`, `travelclone/api:${{ github.sha }}`, `travelclone/admin:${{ github.sha }}`
- Secrets: `SERVER_SSH_KEY`, `SERVER_HOST`, `SERVER_USER` stored in GitHub repo secrets

---

## Summary

| Epic | Stories | FRs | Status |
|------|---------|-----|--------|
| Epic 1: Foundation & Auth | 5 | FR33–36 | Pending |
| Epic 2: Flight Search & Promotions | 6 | FR1–4, FR6, FR10–11, FR47, FR49–50 | Pending |
| Epic 3: Hotel Search & Bundles | 5 | FR5, FR15–16, FR18–21, FR48 | Pending |
| Epic 4: Booking Flow & Payments | 6 | FR12–14, FR17, FR19, FR22–25 | Pending |
| Epic 5: Budget-First Discovery | 3 | FR7–9 | Pending |
| Epic 6: Post-Booking & Notifications | 5 | FR26–32 | Pending |
| Epic 7: Admin Dashboard | 5 | FR37–46 | Pending |
| Epic 8: PWA, Performance & A11y | 5 | NFR5, NFR12–19 | Pending |
| **Total** | **40** | **All 50 FRs + 23 NFRs** | |
