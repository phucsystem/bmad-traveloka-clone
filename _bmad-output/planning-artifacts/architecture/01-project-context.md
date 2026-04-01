# Section 1: Project Context Analysis

[Back to index](index.md)

---

## 1. Project Context Analysis

### 1.1 Functional Requirements Coverage (50 FRs across 10 capability areas)

| Capability Area | FR IDs | Count | Primary Architectural Component |
|---|---|---|---|
| User Discovery & Promotions | FR1–FR6 | 6 | Next.js RSC + Promotion API + Redis TTL 15min |
| Budget-First Discovery | FR7–FR9 | 3 | PostgreSQL SQL query + NestJS BudgetModule |
| Flight Booking | FR10–FR14 | 5 | Amadeus API + FlightsModule + BookingModule |
| Hotel Booking | FR15–FR18 | 4 | Amadeus API + HotelsModule + BookingModule |
| Bundle Booking | FR19–FR21 | 3 | BundlesModule + admin-curated Prisma records |
| Payment & Checkout | FR22–FR25 | 4 | Stripe.js (client) + PaymentsModule (server) |
| Post-Booking Management | FR26–FR32 | 7 | BookingsModule + BullMQ email worker |
| User Accounts & Auth | FR33–FR36 | 4 | Better Auth + Google OAuth + UsersModule |
| Admin Dashboard | FR37–FR46 | 10 | apps/admin (Refine) + AdminModule (NestJS) |
| Data & Search | FR47–FR50 | 4 | Amadeus API + Redis + PostgreSQL FTS |

### 1.2 Non-Functional Requirements Mapping (23 NFRs)

| NFR | Category | Architectural Resolution |
|---|---|---|
| NFR1: FCP < 1.5s | Performance | Next.js RSC + Redis cache for promotions (15min TTL) + CDN static assets |
| NFR2: Search < 500ms p95 | Performance | Redis cache hit for Amadeus results (1h TTL); cache-aside pattern |
| NFR3: Page transitions < 300ms | Performance | Next.js App Router client navigation + React Query prefetch |
| NFR4: Budget discovery < 3s | Performance | Indexed PostgreSQL query on flights/hotels tables |
| NFR5: Lighthouse 90+ | Performance | next/image, next-pwa, Tailwind purge, RSC default |
| NFR6: HTTPS/TLS 1.2+ | Security | Nginx SSL termination; HSTS header |
| NFR7: httpOnly cookies | Security | Better Auth refresh tokens in httpOnly, Secure, SameSite=Strict cookies |
| NFR8: Stripe.js tokenization | Security | Card data never touches NestJS — Stripe Elements client-side only |
| NFR9: Admin RBAC | Security | Better Auth role:admin check; separate /admin route guard |
| NFR10: Input validation | Security | class-validator (NestJS DTOs) + Zod (Next.js server actions) |
| NFR11: Rate limiting auth | Security | @nestjs/throttler 10 req/min/IP on /auth/* endpoints |
| NFR12: 100 concurrent users | Scalability | Single Docker Compose sufficient; Nginx worker_connections 1024 |
| NFR13: 90%+ cache hit rate | Scalability | Redis cache-aside; BullMQ cron refreshes stale entries |
| NFR14: Read replica ready | Scalability | Prisma datasource supports multiple URLs; schema has no circular FKs |
| NFR15: K8s-migratable | Scalability | Docker Compose services map 1:1 to K8s Deployments; no host-level coupling |
| NFR16: WCAG 2.1 AA | Accessibility | shadcn/ui headless primitives (Radix UI); aria-* on all custom components |
| NFR17: Keyboard navigable | Accessibility | Radix UI focus management; tabIndex discipline |
| NFR18: Color contrast AA | Accessibility | Design tokens validated: #0064D2 on #FFFFFF = 7.2:1; #FF6B00 on white = 3.1:1 (large text only) |
| NFR19: Alt text | Accessibility | next/image requires alt prop; ESLint jsx-a11y enforced |
| NFR20: Amadeus retry | Integration | Axios interceptor: 3 retries, exponential backoff (1s, 2s, 4s) |
| NFR21: Stripe webhook idempotency | Integration | Stripe event ID stored in BookingEvents; duplicate check before processing |
| NFR22: Mailtrap + React Email | Integration | BullMQ email worker + @react-email/components templates |
| NFR23: Better Auth token refresh | Integration | Better Auth SDK handles silent refresh; access token 15min, refresh 7d |

### 1.3 Complexity Assessment

- **Complexity:** Medium — 8 integrated subsystems (auth, payments, external API, cache, async jobs, admin, search, PWA), no regulatory hurdles for internal MVP (ATAS/PCI-DSS deferred to public launch)
- **Primary domain:** Full-stack web application (PWA) — Next.js SSR + NestJS REST API
- **Cross-cutting concerns:**
  - **Auth:** Better Auth session propagated via httpOnly cookie; NestJS `AuthGuard` on protected routes; admin role checked via `RolesGuard`
  - **Caching:** Redis cache-aside on all Amadeus API calls; cache invalidated on admin data updates
  - **Error handling:** NestJS global `HttpExceptionFilter` → standardized `ApiResponse` envelope; React Error Boundaries per route segment
  - **Logging:** Pino structured JSON (NestJS); `request-id` header propagated for log correlation; Next.js `console` structured to stdout
  - **Promotion engine:** Rule evaluation at request time: geolocation match (city), time match (day/season/holiday), browsing history (localStorage for anon, Postgres for logged-in)
