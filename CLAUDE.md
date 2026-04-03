# CLAUDE.md

## Workflows
For complicated tasks, spawn multiple agents (2-5) in parallel to maximize throughput. Use sequential chaining when tasks have dependencies.

### Dev Story Workflow (MANDATORY)
Every dev story MUST include tests. Follow this sequence:
1. **Before implementation**: Ensure tests exist for the story's acceptance criteria. If no tests exist, write them first (unit + integration as appropriate). Tests should initially fail (TDD red phase).
2. **During implementation**: Write code to make tests pass (TDD green phase).
3. **After implementation**: Run `pnpm turbo test` to verify all tests pass. Fix any failures before marking the story as done.
4. **Never skip tests**: Do not mark a dev story as complete without passing tests. No mocks, fakes, or shortcuts to force tests to pass.

## Project Overview
TravelClone is a travel booking PWA for young Australian budget travelers (18-35). Promotion-first discovery, budget-first search, 3-step booking flow. Internal MVP phase.

## Tech Stack
- **Monorepo:** Turborepo + pnpm workspaces
- **Frontend:** Next.js 15 (App Router, Server Components, PWA) + shadcn/ui (Radix UI) + Tailwind CSS
- **Backend:** NestJS 10 + Prisma 5 ORM + PostgreSQL 16
- **Cache:** Redis 7 (cache-aside pattern, BullMQ job queues)
- **Auth:** Better Auth (Google OAuth, httpOnly cookies, RBAC)
- **Payment:** Stripe (test mode, client-side tokenization via Stripe.js)
- **Email:** React Email + BullMQ workers + Mailtrap
- **Admin:** Refine (React Admin Dashboard)
- **Deploy:** Docker Compose + Nginx reverse proxy
- **CI/CD:** GitHub Actions

## Quick Start
```bash
pnpm install
docker compose -f docker-compose.dev.yml up -d  # postgres:16, redis:7
cp .env.example .env.local
pnpm turbo dev  # starts web, api, admin with hot reload
```

## Monorepo Structure
```
travelclone/
├── apps/
│   ├── web/             — Next.js 15 PWA frontend
│   ├── api/             — NestJS 10 REST API
│   └── admin/           — Refine admin dashboard
├── packages/
│   ├── shared/          — TypeScript types, constants, utils
│   ├── database/        — Prisma schema, migrations, seed scripts
│   ├── eslint-config/   — Shared ESLint rules
│   └── tsconfig/        — Shared tsconfig.json bases
├── nginx/               — Nginx config (reverse proxy, TLS, CORS)
├── docker-compose.yml   — Production configuration
├── docker-compose.dev.yml
├── turbo.json           — Monorepo pipeline config
└── pnpm-workspace.yaml
```

## Key Commands
- `pnpm turbo dev` — Start all apps with hot reload
- `pnpm turbo build` — Build all apps
- `pnpm turbo lint` — Run ESLint across all apps
- `pnpm turbo typecheck` — Type-check all apps
- `pnpm turbo test` — Run all tests (required after every dev story)
- `pnpm prisma migrate dev` — Create/apply database migration
- `pnpm prisma db seed` — Populate seed data
- `docker compose -f docker-compose.dev.yml up -d` — Start databases locally
- `docker compose -f docker-compose.dev.yml down` — Stop databases

## Core Architecture Decisions

### REST API (No GraphQL)
Simpler for MVP, easier for admin dashboard integration.

### API Versioning & Response Format
- Routes prefixed `/api/v1/`
- Standard envelope:
```typescript
{ success: boolean; data?: T; error?: { code: ErrorCode; message: string }; meta?: { page, total, limit } }
```

### Caching Strategy (Cache-Aside)
- Redis for Amadeus flights (1h TTL), hotels (1h TTL), promotions (15min TTL)
- BullMQ cron jobs refresh popular routes every 30min
- Cache invalidation triggered by admin updates

### Database
- PostgreSQL 16 with Prisma ORM
- No connection pooling layer needed at 100-user MVP scale
- Migrations committed to git, applied via `prisma migrate deploy`

### Authentication
- Better Auth with Google OAuth
- Sessions in httpOnly, Secure, SameSite=Strict cookies
- Access token: 15min; Refresh token: 7 days
- RBAC via user.role (user | admin)

### Payment
- Stripe.js client-side tokenization (card data never touches NestJS)
- Webhook idempotency via BookingEvents table (event ID stored)
- Test mode for MVP

### Email
- React Email templates + BullMQ queue + Mailtrap SMTP
- Async worker pattern (fire-and-forget from API)

## Naming Conventions
- **DB tables:** snake_case plural (booking_flights, promotion_rules)
- **DB columns:** snake_case (created_at, user_id)
- **API endpoints:** kebab-case plural (/api/v1/hotel-bookings)
- **TS variables/functions:** camelCase
- **TS classes/components:** PascalCase
- **TS constants:** UPPER_SNAKE_CASE
- **Files:** kebab-case (flight-search.controller.ts)
- **NestJS modules:** PascalCase + Module suffix (FlightsModule)
- **NestJS DTOs:** PascalCase + Dto suffix (CreateBookingDto)
- **Prisma models:** PascalCase singular (BookingFlight)
- **React hooks:** camelCase + use prefix (useFlightSearch)
- **Env vars:** UPPER_SNAKE_CASE

## Environment Variables
```
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mtxprd

# Redis
REDIS_URL=redis://localhost:6379

# Amadeus API
AMADEUS_API_KEY=xxx
AMADEUS_API_SECRET=xxx

# Stripe (test mode)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Google OAuth (Better Auth)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
BETTER_AUTH_SECRET=xxx

# Email (Mailtrap)
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=xxx
MAILTRAP_PASS=xxx

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

## Design System
- **Primary color:** #0064D2 (Traveloka blue)
- **Accent color:** #FF6B00 (Traveloka orange) — prices, CTAs
- **Font:** Inter (variable weight)
- **Spacing unit:** 4px (tailwind default)
- **Border radius:** 8px default
- **Components:** shadcn/ui (Radix UI primitives + Tailwind)

## Documentation
All docs in `./docs/` — read before implementing features:
- `project-overview-pdr.md` — Product requirements (50 FRs, 23 NFRs)
- `code-standards.md` — Naming conventions and code standards
- `system-architecture.md` — Architecture, data models, API design
- `codebase-summary.md` — Codebase structure overview
- `project-roadmap.md` — Development phases and milestones
- `design-guidelines.md` — Design system, colors, typography

## Planning Artifacts
BMad methodology outputs in `./_bmad-output/planning-artifacts/`:
- `product-brief-bmad-traveloka-clone.md` — User needs analysis
- `prd.md` — Product requirements (50 FRs, 23 NFRs)
- `architecture.md` — Technical architecture and decisions
- `ux-design-specification.md` — UI/UX design specs

## Security & Compliance
- Input validation: class-validator (NestJS) + Zod (Next.js)
- Rate limiting: 10 req/min on /auth/* endpoints
- PCI: Stripe.js tokenization (no card data on server)
- HTTPS: Nginx TLS termination + HSTS headers
- CSRF: Better Auth tokens + SameSite=Strict cookies
- SQL injection: Prisma parameterized queries (no raw SQL in app code)

## Performance Targets
- FCP < 1.5s (Next.js RSC + Redis cache)
- Search p95 < 500ms (Redis hit rate 90%)
- Budget discovery < 3s (indexed PostgreSQL queries)
- Lighthouse score ≥ 90 (next/image + PWA manifest)

## Deployment
- Docker Compose local: postgres, redis, web, api, admin, nginx
- Production: Apps containerized, Nginx reverse proxy on port 80/443
- Migrations: `prisma migrate deploy` on startup
- Secrets: Injected via .env, never committed to git
