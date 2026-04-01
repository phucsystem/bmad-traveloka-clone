# Architecture Decision Document — TravelClone

**Author:** Phuc
**Date:** 2026-04-01
**Status:** Final
**Domain:** Travel Booking PWA — Greenfield MVP

Source document: [`architecture.md`](../architecture.md) (1,502 lines)

---

## Shards

| # | File | Section | Description | Source lines |
|---|---|---|---|---|
| 1 | [01-project-context.md](01-project-context.md) | Section 1 | FR/NFR mapping tables (50 FRs × 10 areas, 23 NFRs), complexity assessment, cross-cutting concerns summary | ~75 |
| 2 | [02-starter-template.md](02-starter-template.md) | Section 2 | Turborepo monorepo structure, `create-turbo` init commands, starter-provides vs we-build table | ~48 |
| 3 | [03-data-architecture.md](03-data-architecture.md) | Section 3.1 | PostgreSQL/Prisma setup, Redis cache key patterns with TTLs, cache-aside pattern, eviction policy, DB schema overview | ~48 |
| 4 | [04-authentication-security.md](04-authentication-security.md) | Section 3.2 | Better Auth config snippet, RBAC roles table, security controls table (rate limiting, validation, XSS, CSRF, PCI, HTTPS) | ~42 |
| 5 | [05-api-communication.md](05-api-communication.md) | Section 3.3 | REST design rationale, `ApiResponse<T>` envelope, `ErrorCode` enum, `GlobalExceptionFilter`, BullMQ queue/job table | ~112 |
| 6 | [06-frontend-architecture.md](06-frontend-architecture.md) | Section 3.4 | App Router rendering strategy per route, state management table, PWA config snippet, design system tokens, custom components list | ~80 |
| 7 | [07-infrastructure-deployment.md](07-infrastructure-deployment.md) | Section 3.5 | Docker Compose services table, Nginx config snippet, CI/CD pipeline stages, logging table, health check endpoints | ~78 |
| 8 | [08-implementation-patterns.md](08-implementation-patterns.md) | Section 4 | Naming conventions table, API response format examples, error handling (backend + frontend), data flow patterns (4 flows) | ~96 |
| 9 | [09-project-structure.md](09-project-structure.md) | Section 5 | Complete annotated file tree — all apps (`web`, `api`, `admin`) and all packages (`shared`, `database`, `eslint-config`, `tsconfig`) | ~318 |
| 10 | [10-database-schema.md](10-database-schema.md) | Section 6 | Full Prisma schema (all models, enums, indexes, relations) + Mermaid ER diagram | ~220 |
| 11 | [11-system-architecture-diagrams.md](11-system-architecture-diagrams.md) | Section 7 | Mermaid C4 Context+Container diagram, component-level flowchart showing all service interactions | ~122 |
| 12 | [12-validation-checklist.md](12-validation-checklist.md) | Section 8 | All 50 FRs mapped to components, NFR coverage confirmation, conflict resolution table, cross-cutting concerns table, app boundary table | ~102 |

---

## Quick Reference

### Key architectural decisions

- **Monorepo:** Turborepo + pnpm workspaces — `apps/{web,api,admin}` + `packages/{shared,database,eslint-config,tsconfig}`
- **API:** NestJS 10 REST-only, `/api/v1/` prefix, `ApiResponse<T>` envelope on all responses
- **Auth:** Better Auth + Google OAuth, httpOnly cookies, 15min access / 7d refresh tokens, RBAC via `RolesGuard`
- **Cache:** Redis cache-aside — Amadeus results 1h TTL, promotions 15min TTL, BullMQ on Redis DB 1
- **Payments:** Stripe.js client-side tokenization — card data never reaches NestJS
- **Frontend:** Next.js 15 App Router — RSC for data-heavy pages, Client Components for interactive flows
- **Async:** BullMQ workers for email delivery, Amadeus price sync (cron), cache invalidation
- **Deploy:** Docker Compose — 6 services behind Nginx reverse proxy; GitHub Actions CI/CD

### Navigation by concern

| I need to understand… | Go to |
|---|---|
| Which FRs map to which components | [01-project-context.md](01-project-context.md) § 1.1 |
| How NFRs are addressed architecturally | [01-project-context.md](01-project-context.md) § 1.2 |
| How to bootstrap the monorepo | [02-starter-template.md](02-starter-template.md) |
| Redis cache key patterns and TTLs | [03-data-architecture.md](03-data-architecture.md) § 3.1.2 |
| Better Auth configuration | [04-authentication-security.md](04-authentication-security.md) § 3.2.1 |
| Security controls (rate limiting, CSRF, etc.) | [04-authentication-security.md](04-authentication-security.md) § 3.2.3 |
| API response envelope and error codes | [05-api-communication.md](05-api-communication.md) § 3.3.1 |
| BullMQ queues and job types | [05-api-communication.md](05-api-communication.md) § 3.3.3 |
| Which routes use RSC vs Client Components | [06-frontend-architecture.md](06-frontend-architecture.md) § 3.4.1 |
| State management decisions | [06-frontend-architecture.md](06-frontend-architecture.md) § 3.4.2 |
| Design system tokens | [06-frontend-architecture.md](06-frontend-architecture.md) § 3.4.4 |
| Docker services and Nginx routing | [07-infrastructure-deployment.md](07-infrastructure-deployment.md) |
| Naming conventions | [08-implementation-patterns.md](08-implementation-patterns.md) § 4.1 |
| End-to-end data flow (booking, cache hit/miss) | [08-implementation-patterns.md](08-implementation-patterns.md) § 4.4 |
| Full file tree with annotations | [09-project-structure.md](09-project-structure.md) |
| Prisma schema and ER diagram | [10-database-schema.md](10-database-schema.md) |
| C4 and component diagrams | [11-system-architecture-diagrams.md](11-system-architecture-diagrams.md) |
| FR/NFR coverage validation | [12-validation-checklist.md](12-validation-checklist.md) |
| App ownership boundaries | [12-validation-checklist.md](12-validation-checklist.md) § 8.5 |
