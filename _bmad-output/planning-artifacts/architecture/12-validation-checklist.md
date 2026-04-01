# Section 8: Validation Checklist

[Back to index](index.md)

---

## 8. Validation Checklist

### 8.1 All 50 FRs Mapped to Architectural Components

| FR | Component | Status |
|---|---|---|
| FR1: Homepage deal cards (no login) | `app/page.tsx` RSC + `PromotionsService` | Covered |
| FR2: Geolocation/IP city detection | `use-geolocation.ts` + `GET /promotions?city=` | Covered |
| FR3: Time-aware promotions | `PromotionsService.evaluateRules()` — `target_days[]` field | Covered |
| FR4: Absolute prices | `PriceDisplay` component, all API responses return `price` in AUD | Covered |
| FR5: Bundle deals with savings | `BundlesModule`, `savings_amount` field, `BundleCard` | Covered |
| FR6: Personalized deals for logged-in users | `PromotionsService` reads `browsing_history` from user context | Covered |
| FR7: Budget discovery input | `BudgetDiscoveryWidget` + `GET /budget-discovery?budget=500&origin=SYD` | Covered |
| FR8: Destination cards sorted by cost | `BudgetDiscoveryService` — Prisma query with ORDER BY total_cost | Covered |
| FR9: Destination → flights/hotels | Destination card links to `/flights?origin=SYD&dest=MEL` | Covered |
| FR10: Flight search | `GET /flights?origin=SYD&dest=MEL&date=2026-04-10&pax=1` | Covered |
| FR11: Flight results | `FlightCard` — airline, times, duration, price | Covered |
| FR12: Select flight → passenger details | `/booking/flights/[flightId]` — `PassengerDetailsForm` | Covered |
| FR13: Passenger details (name, contact) | `CreateBookingDto` — `passengerName`, `passengerEmail`, `passportNumber` | Covered |
| FR14: Passenger validation | `class-validator` on DTO; Zod on client form | Covered |
| FR15: Hotel search | `GET /hotels?city=MEL&checkin=2026-04-10&checkout=2026-04-12&guests=1` | Covered |
| FR16: Hotel results | `HotelCard` — name, location, stars, amenities, price/night | Covered |
| FR17: Select hotel → guest details | `/booking/hotels/[hotelId]` — `GuestDetailsForm` | Covered |
| FR18: Hotel photos/descriptions | `hotel.image_url`, `hotel.description` fields in schema | Covered |
| FR19: Bundle booking | `/booking/bundles/[bundleId]` | Covered |
| FR20: Bundle savings display | `savings_amount` from `Bundle` model; `PriceBreakdown` component | Covered |
| FR21: Admin bundle management | `AdminBundlesController` CRUD | Covered |
| FR22: Stripe payment | `StripePaymentForm` + Stripe Elements; `PaymentsService` | Covered |
| FR23: Total cost breakdown | `PriceBreakdown` component at Step 3; total visible before pay | Covered |
| FR24: Booking summary review | `BookingSummaryCard` sticky component at bottom of viewport | Covered |
| FR25: Payment confirmation | Stripe webhook → `BookingsService.confirm()` → `confirmation_code` | Covered |
| FR26: My Bookings list | `GET /bookings` (authenticated) → `/my-bookings` RSC | Covered |
| FR27: Booking detail itinerary | `GET /bookings/:id` → `/my-bookings/[bookingId]` RSC | Covered |
| FR28: Cancellation policy display | Policy tiers in `calculateRefund()` util; shown in `BookingDetailCard` | Covered |
| FR29: Self-service cancel | `CancellationModal` → `DELETE /bookings/:id` | Covered |
| FR30: Refund calculation | `calculateRefund()` in `packages/shared/src/utils/booking.ts` | Covered |
| FR31: Booking confirmation email | `EmailWorker` processes `send-booking-confirmation` job | Covered |
| FR32: Cancellation confirmation email | `EmailWorker` processes `send-cancellation-confirmation` job | Covered |
| FR33: Google OAuth signup/login | Better Auth + Google provider + `/auth/signin` | Covered |
| FR34: Profile view/edit | `GET/PUT /users/me` → `/profile` page | Covered |
| FR35: Booking history | Same as FR26; auth required | Covered |
| FR36: Browsing history for personalization | `localStorage` (anon) + `user` context (logged-in) in `PromotionsService` | Covered |
| FR37: Admin portal login | Better Auth admin role check; `apps/admin` with `auth-provider.ts` | Covered |
| FR38: Admin flight CRUD | `AdminFlightsController` CRUD | Covered |
| FR39: Admin hotel CRUD | `AdminHotelsController` CRUD | Covered |
| FR40: Admin promotion CRUD with rules | `AdminPromotionsController` + `CreatePromotionDto` (geo, time, expiry) | Covered |
| FR41: Admin bundle management | `AdminBundlesController` CRUD | Covered |
| FR42: Admin booking search | `GET /admin/bookings?email=&code=` | Covered |
| FR43: Admin booking timeline | `BookingEvent` table + `BookingTimeline` component in admin | Covered |
| FR44: Admin refund processing | `POST /admin/bookings/:id/refund` → Stripe Refunds API | Covered |
| FR45: Admin email resend | `POST /admin/bookings/:id/resend-email` → BullMQ email queue | Covered |
| FR46: Admin user management | `AdminUsersController` → `GET /admin/users` | Covered |
| FR47: Amadeus flight data | `AmadeusService.searchFlights()` + `AmadeusSyncWorker` cron | Covered |
| FR48: Amadeus hotel data | `AmadeusService.searchHotels()` + `AmadeusSyncWorker` cron | Covered |
| FR49: Full-text search | PostgreSQL `tsvector` on `flights.airline + origin + destination`; `hotels.name + city` | Covered |
| FR50: Configurable cache refresh | `AmadeusSyncWorker` cron schedule via env var `AMADEUS_SYNC_INTERVAL_MIN` | Covered |

### 8.2 All 23 NFRs Addressed

All 23 NFRs mapped in Section 1.2 ([01-project-context.md](01-project-context.md)). Confirmed no gaps.

### 8.3 No Conflicting Decisions

| Decision Pair | Conflict? | Resolution |
|---|---|---|
| REST-only vs. admin data needs | No — Refine works natively with REST; no GraphQL needed | Resolved |
| Redis for cache + BullMQ | No — separate DB indices (DB 0 cache, DB 1 BullMQ); same Redis instance | Resolved |
| Better Auth + admin role | No — same auth system; role field gates admin routes | Resolved |
| Prisma + PostgreSQL FTS | No — Prisma supports raw queries for tsvector operations | Resolved |
| Next.js App Router + RSC + React Query | No — RSC for initial data; React Query for mutations/client refetch; no overlap | Resolved |

### 8.4 Cross-Cutting Concerns Coverage

| Concern | Covered By | Location |
|---|---|---|
| Authentication | Better Auth + Google OAuth + JWT + httpOnly cookies | `apps/api/src/modules/auth/` |
| Authorization | `RolesGuard` + `@Roles('admin')` + `AdminAuthGuard` | `apps/api/src/modules/auth/guards/` |
| Caching | Redis cache-aside in all services + `CacheService` | `apps/api/src/cache/` |
| Error handling | `GlobalExceptionFilter` (backend) + `error.tsx` boundaries (frontend) | `apps/api/src/filters/` + `apps/web/src/app/**/error.tsx` |
| Logging | Pino structured JSON (api) + console structured (web) + request-id correlation | `apps/api/src/main.ts` + Nginx config |
| Promotion engine | Rule evaluation: geo (target_cities[]), time (target_days[]), history | `apps/api/src/modules/promotions/promotions.service.ts` |
| Input validation | `ValidationPipe` global (NestJS) + Zod schemas (Next.js forms) | `apps/api/src/main.ts` + form components |
| Async operations | BullMQ queues + workers for email, sync, cache invalidation | `apps/api/src/workers/` |
| Database migrations | `prisma migrate` in CI/CD pipeline before deployment | `packages/database/prisma/migrations/` |
| Environment config | `@nestjs/config` + Joi validation; `.env.example` documented | `apps/api/src/config/` |

### 8.5 Clear Boundaries Between Apps

| App | Owns | Never touches |
|---|---|---|
| `apps/web` | All user-facing pages, components, hooks, PWA logic | Database directly; Amadeus API; Stripe server-side |
| `apps/api` | All business logic, data access, external integrations, job queues | UI rendering; Next.js router |
| `apps/admin` | Admin UI only; calls `/api/v1/admin/*` exclusively | Direct DB access; any user-facing route |
| `packages/shared` | Types, constants, pure utils | Side effects; API calls; DB queries |
| `packages/database` | Prisma schema + migrations + seed | Business logic; HTTP concerns |

---

*Document End — Architecture Decision Document v1.0 — TravelClone — 2026-04-01*
