# Section 3.1: Data Architecture

[Back to index](index.md)

---

### 3.1 Data Architecture

#### 3.1.1 PostgreSQL via Prisma ORM

- **Database:** PostgreSQL 16 (Docker image `postgres:16-alpine`)
- **ORM:** Prisma 5 — type-safe query builder, migration engine, seed runner
- **Connection:** Prisma Client singleton in `packages/database/src/client.ts`; imported by `apps/api` only
- **Migration strategy:**
  - `prisma migrate dev` — development (auto-applies + generates client)
  - `prisma migrate deploy` — production (applies pending migrations only, no destructive auto-reset)
  - Migrations stored in `packages/database/prisma/migrations/` and committed to git
  - Schema changes follow: add-only in MVP (no destructive column drops until post-launch)
- **Connection pooling:** PgBouncer not needed at MVP scale (100 concurrent users); Prisma connection pool default (10 connections) sufficient

#### 3.1.2 Redis Caching Strategy

- **Redis:** Redis 7 (Docker image `redis:7-alpine`)
- **Client:** `ioredis` in NestJS; injected via `CacheModule` (custom wrapper, not `@nestjs/cache-manager` to avoid abstraction overhead)
- **Cache patterns:**

| Cache Key Pattern | TTL | Invalidation Trigger |
|---|---|---|
| `amadeus:flights:{origin}:{dest}:{date}:{pax}` | 3600s (1h) | BullMQ cron job every 30min for popular routes |
| `amadeus:hotels:{city}:{checkin}:{checkout}:{guests}` | 3600s (1h) | BullMQ cron job every hour |
| `promotions:active:{city}:{dayOfWeek}` | 900s (15min) | Admin promotion update triggers `DEL` |
| `budget:discovery:{origin}:{budget}` | 1800s (30min) | Cleared on flight/hotel price update |
| `session:{userId}` | 86400s (24h) | Logout / Better Auth session revocation |

- **Cache-aside pattern:** NestJS service checks Redis → if miss, calls Amadeus API → stores result → returns data
- **Redis eviction policy:** `allkeys-lru` (evict least-recently-used keys when memory full)

#### 3.1.3 Database Schema Overview

See [10-database-schema.md](10-database-schema.md) for full Prisma schema and ER diagram.

Core tables and their primary responsibilities:

| Table | Responsibility |
|---|---|
| `users` | Auth identity, profile, role |
| `flights` | Amadeus-sourced flight inventory |
| `hotels` | Amadeus-sourced hotel inventory |
| `bookings` | Central booking record (flight/hotel/bundle) |
| `booking_flights` | Passenger details per flight booking |
| `booking_hotels` | Guest details per hotel booking |
| `promotions` | Admin-curated deals with targeting rules |
| `bundles` | Flight+hotel combo deals with pricing |
| `booking_events` | Audit log of booking state transitions (Stripe event IDs for idempotency) |
