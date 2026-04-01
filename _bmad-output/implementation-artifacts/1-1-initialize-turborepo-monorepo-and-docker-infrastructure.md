# Story 1.1: Initialize Turborepo Monorepo and Docker Infrastructure

Status: ready-for-dev

## Story

As a developer,
I want a fully configured Turborepo monorepo with Next.js 15, NestJS 10, Refine admin, shared packages, and Docker Compose services,
So that the entire team can run all services with a single command and share types across the stack.

## Acceptance Criteria

1. **Given** a fresh clone of the repository **When** I run `docker compose -f docker-compose.dev.yml up -d` **Then** postgres:16, redis:7, and nginx containers start successfully with health checks passing

2. **Given** the monorepo is running **When** I run `pnpm turbo dev` **Then** apps/web (port 3000), apps/api (port 4000), and apps/admin (port 3001) all start with hot reload

3. **Given** the monorepo structure **When** I import a type from `packages/shared` **Then** apps/web, apps/api, and apps/admin all resolve the import without npm publish

4. **Given** Docker Compose is up **When** I call `GET /api/health` **Then** the response is `{ success: true, data: { db: "ok", redis: "ok" } }` within 500ms

5. **Given** the CI pipeline **When** I push to main branch **Then** `pnpm turbo lint` and `pnpm turbo typecheck` both pass before any deployment

## Tasks / Subtasks

- [ ] **Task 1: Initialize pnpm workspace + Turborepo root** (AC: 1, 2, 3, 5)
  - [ ] Create root `package.json` with workspaces field and turbo dependency
  - [ ] Create `pnpm-workspace.yaml` declaring `apps/*` and `packages/*`
  - [ ] Create `turbo.json` with `dev`, `build`, `lint`, `typecheck` pipeline tasks
  - [ ] Create root `.gitignore` (node_modules, .turbo, dist, .next, build)

- [ ] **Task 2: Scaffold apps/web — Next.js 15** (AC: 2, 3)
  - [ ] Run `pnpm dlx create-next-app@15 apps/web --typescript --tailwind --app --src-dir --import-alias "@/*"`
  - [ ] Add `@repo/shared` and `@repo/database` to `apps/web/package.json` dependencies
  - [ ] Configure `apps/web/next.config.ts` to transpile `@repo/shared`
  - [ ] Add `apps/web/tailwind.config.ts` with design tokens (primary #0064D2, accent #FF6B00)
  - [ ] Add `GET /health` route: `apps/web/src/app/health/route.ts` returning `{ status: "ok" }`
  - [ ] Verify `pnpm --filter web dev` starts on port 3000

- [ ] **Task 3: Scaffold apps/api — NestJS 10** (AC: 2, 3, 4)
  - [ ] Run `pnpm dlx @nestjs/cli new apps/api --package-manager pnpm --skip-git`
  - [ ] Add `@repo/shared` and `@repo/database` to `apps/api/package.json` dependencies
  - [ ] Configure `apps/api/src/main.ts`: global prefix `/api/v1`, port 4000, `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`
  - [ ] Create `apps/api/src/health/health.module.ts` and `health.controller.ts` with `GET /api/health` endpoint
  - [ ] Create `apps/api/src/filters/http-exception.filter.ts` (GlobalExceptionFilter using `ApiResponse`)
  - [ ] Register `GlobalExceptionFilter` globally in `apps/api/src/app.module.ts`
  - [ ] Verify `pnpm --filter api dev` starts on port 4000

- [ ] **Task 4: Scaffold apps/admin — Refine** (AC: 2)
  - [ ] Run `pnpm create refine-app@latest apps/admin -- --preset refine-nextjs` (or manually scaffold Next.js + Refine packages)
  - [ ] Add `@repo/shared` to `apps/admin/package.json` dependencies
  - [ ] Configure port 3001 in `apps/admin/package.json` dev script: `next dev --port 3001`
  - [ ] Verify `pnpm --filter admin dev` starts on port 3001

- [ ] **Task 5: Create packages/shared** (AC: 3, 5)
  - [ ] Init `packages/shared/package.json` with name `@repo/shared`, `"main": "src/index.ts"`, `"types": "src/index.ts"`
  - [ ] Create `packages/shared/src/types/api-response.ts` — `ApiResponse<T>` interface (see Dev Notes)
  - [ ] Create `packages/shared/src/constants/error-codes.ts` — full `ErrorCode` enum (see Dev Notes)
  - [ ] Create `packages/shared/src/query-keys.ts` — TanStack Query key factories (see Dev Notes)
  - [ ] Create `packages/shared/src/index.ts` — barrel export of all above
  - [ ] Add `packages/shared/tsconfig.json` extending `@repo/tsconfig/base.json`

- [ ] **Task 6: Create packages/database** (AC: 3, 4)
  - [ ] Init `packages/database/package.json` with name `@repo/database`
  - [ ] Create `packages/database/prisma/schema.prisma` with stub: provider `postgresql`, generator `prisma-client-js`, and minimal `User` model
  - [ ] Create `packages/database/src/client.ts` — Prisma Client singleton (global singleton pattern for dev hot-reload)
  - [ ] Create `packages/database/src/index.ts` — exports `prisma` singleton and Prisma types
  - [ ] Add `packages/database/tsconfig.json` extending `@repo/tsconfig/base.json`

- [ ] **Task 7: Create packages/eslint-config** (AC: 5)
  - [ ] Init `packages/eslint-config/package.json` with name `@repo/eslint-config`
  - [ ] Create `packages/eslint-config/next.js` — ESLint config extending `eslint-config-next` + `plugin:@typescript-eslint/recommended`
  - [ ] Create `packages/eslint-config/nestjs.js` — ESLint config for NestJS with TypeScript rules
  - [ ] Create `packages/eslint-config/base.js` — shared rules (no-var, prefer-const, no-console warn)

- [ ] **Task 8: Create packages/tsconfig** (AC: 5)
  - [ ] Init `packages/tsconfig/package.json` with name `@repo/tsconfig`
  - [ ] Create `packages/tsconfig/base.json` — strict TypeScript base (strict, esModuleInterop, skipLibCheck)
  - [ ] Create `packages/tsconfig/nextjs.json` — extends base, adds Next.js jsx/paths settings
  - [ ] Create `packages/tsconfig/nestjs.json` — extends base, adds NestJS decorator settings (experimentalDecorators, emitDecoratorMetadata)
  - [ ] Create `packages/tsconfig/react-library.json` — extends base for shared packages

- [ ] **Task 9: Create docker-compose.dev.yml** (AC: 1)
  - [ ] Define `postgres` service: image `postgres:16-alpine`, port `5432:5432`, env vars from `.env`, volume `pgdata`, healthcheck `pg_isready -U ${POSTGRES_USER}`
  - [ ] Define `redis` service: image `redis:7-alpine`, port `6379:6379`, healthcheck `redis-cli ping`
  - [ ] Define `nginx` service: image `nginx:alpine`, port `80:80`, volume `./nginx/default.conf:/etc/nginx/conf.d/default.conf`
  - [ ] Add named volume `pgdata` at bottom of file
  - [ ] Note: apps (web/api/admin) run locally with `pnpm turbo dev` in dev mode — not containerized in dev

- [ ] **Task 10: Create nginx/default.conf** (AC: 1, 4)
  - [ ] Route `location /api/` → `proxy_pass http://host.docker.internal:4000;`
  - [ ] Route `location /admin/` → `proxy_pass http://host.docker.internal:3001;`
  - [ ] Route `location /` → `proxy_pass http://host.docker.internal:3000;`
  - [ ] Add `proxy_set_header Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Request-ID $request_id`
  - [ ] Add `location /_next/static/` block with `expires 1y; add_header Cache-Control "public, immutable"`

- [ ] **Task 11: Implement health check endpoint in NestJS** (AC: 4)
  - [ ] Install `@nestjs/terminus` and `ioredis` in apps/api
  - [ ] Create `apps/api/src/health/health.controller.ts` with `GET /api/health` (note: registered without global prefix `/api/v1`)
  - [ ] Import `PrismaService` from `@repo/database` for `$queryRaw\`SELECT 1\``
  - [ ] Import `Redis` from `ioredis`, call `redis.ping()`
  - [ ] Return `{ success: true, data: { db: "ok", redis: "ok" } }` on success
  - [ ] Return `{ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "..." } }` on failure with HTTP 503

- [ ] **Task 12: Create .env.example** (AC: 1)
  - [ ] Include all required env vars with placeholder values (see Dev Notes — Environment Variables)
  - [ ] Add comments grouping vars by service (Database, Redis, Amadeus, Stripe, Auth, Email, Frontend)

- [ ] **Task 13: Configure turbo.json pipeline** (AC: 5)
  - [ ] `build`: depends on `^build`, outputs `dist/**`, `.next/**`, `build/**`
  - [ ] `dev`: persistent true, cache false
  - [ ] `lint`: outputs `[]`
  - [ ] `typecheck`: outputs `[]`, depends on `^typecheck`
  - [ ] Add `globalEnv` list for all env vars used across apps

- [ ] **Task 14: Create GitHub Actions CI workflow** (AC: 5)
  - [ ] Create `.github/workflows/ci.yml`
  - [ ] Steps: checkout, pnpm setup, install, `pnpm turbo lint`, `pnpm turbo typecheck`
  - [ ] Trigger: `push` to `main` and `pull_request` targeting `main`

## Dev Notes

### Architecture Compliance

- Monorepo: Turborepo + pnpm workspaces
- Package naming convention: `@repo/shared`, `@repo/database`, `@repo/eslint-config`, `@repo/tsconfig`
- Frontend: Next.js 15 App Router on port 3000
- Backend: NestJS 10 on port 4000 (global prefix `/api/v1/`, except `/api/health`)
- Admin: Refine on port 3001
- Database: PostgreSQL 16 + Redis 7
- Deployment: Docker Compose + Nginx reverse proxy

### Naming Conventions (from architecture.md §4.1)

| Context | Convention | Example |
|---|---|---|
| DB tables | snake_case plural | `booking_flights`, `users` |
| DB columns | snake_case | `created_at`, `user_id` |
| API endpoints | kebab-case plural | `/api/v1/hotel-bookings` |
| TS vars/functions | camelCase | `totalPrice`, `cancelBooking()` |
| TS classes/components | PascalCase | `BookingService`, `FlightCard` |
| TS constants | UPPER_SNAKE_CASE | `MAX_PASSENGERS`, `CACHE_TTL_SECONDS` |
| Files | kebab-case | `flight-search.controller.ts` |
| NestJS modules | PascalCase + Module | `FlightsModule`, `HealthModule` |
| NestJS DTOs | PascalCase + Dto | `CreateBookingDto` |
| Prisma models | PascalCase singular | `User`, `BookingFlight` |
| React hooks | camelCase + use prefix | `useBookingFlow` |
| Env vars | UPPER_SNAKE_CASE | `DATABASE_URL`, `REDIS_URL` |

### packages/shared Must Export

**`packages/shared/src/types/api-response.ts`:**
```typescript
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    total?: number;
    limit?: number;
    cursor?: string;
  };
}
```

**`packages/shared/src/constants/error-codes.ts`:**
```typescript
export enum ErrorCode {
  // Auth
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  // Booking
  BOOKING_NOT_FOUND = 'BOOKING_NOT_FOUND',
  BOOKING_ALREADY_CANCELLED = 'BOOKING_ALREADY_CANCELLED',
  BOOKING_CANCELLATION_WINDOW_EXPIRED = 'BOOKING_CANCELLATION_WINDOW_EXPIRED',
  // Payment
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_ALREADY_PROCESSED = 'PAYMENT_ALREADY_PROCESSED',
  STRIPE_WEBHOOK_INVALID = 'STRIPE_WEBHOOK_INVALID',
  // Inventory
  FLIGHT_NOT_FOUND = 'FLIGHT_NOT_FOUND',
  HOTEL_NOT_FOUND = 'HOTEL_NOT_FOUND',
  BUNDLE_NOT_FOUND = 'BUNDLE_NOT_FOUND',
  PROMOTION_NOT_FOUND = 'PROMOTION_NOT_FOUND',
  // External
  AMADEUS_API_ERROR = 'AMADEUS_API_ERROR',
  AMADEUS_RATE_LIMIT = 'AMADEUS_RATE_LIMIT',
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_DATE_RANGE = 'INVALID_DATE_RANGE',
  BUDGET_TOO_LOW = 'BUDGET_TOO_LOW',
  // Generic
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
}
```

**`packages/shared/src/query-keys.ts`:**
```typescript
export const queryKeys = {
  flights: {
    all: () => ['flights'] as const,
    search: (params: Record<string, unknown>) => ['flights', 'search', params] as const,
  },
  hotels: {
    all: () => ['hotels'] as const,
    search: (params: Record<string, unknown>) => ['hotels', 'search', params] as const,
  },
  bookings: {
    all: () => ['bookings'] as const,
    byId: (bookingId: string) => ['bookings', bookingId] as const,
    myBookings: () => ['bookings', 'my'] as const,
  },
  promotions: {
    all: () => ['promotions'] as const,
    active: (city?: string) => ['promotions', 'active', city] as const,
  },
  user: {
    profile: () => ['user', 'profile'] as const,
  },
};
```

### packages/database Prisma Client Singleton

**`packages/database/src/client.ts`:**
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**`packages/database/prisma/schema.prisma` (stub):**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Full schema added in Story 1.2 (auth) and Story 2.1+ (flights/hotels/bookings)
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      String   @default("user")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

### Docker Compose Services (docker-compose.dev.yml)

```yaml
# docker-compose.dev.yml — dev only: runs postgres, redis, nginx
# apps (web/api/admin) run locally via `pnpm turbo dev`
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-travelclone}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-travelclone}
      POSTGRES_DB: ${POSTGRES_DB:-travelclone}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-travelclone}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - postgres
      - redis

volumes:
  pgdata:
```

### Nginx Configuration (nginx/default.conf)

```nginx
server {
  listen 80;
  server_name localhost;

  location /api/ {
    proxy_pass http://host.docker.internal:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Request-ID $request_id;
  }

  location /admin/ {
    proxy_pass http://host.docker.internal:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /_next/static/ {
    proxy_pass http://host.docker.internal:3000;
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location / {
    proxy_pass http://host.docker.internal:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Request-ID $request_id;
  }
}
```

> Note: `host.docker.internal` resolves to the Docker host machine (where `pnpm turbo dev` runs). On Linux, add `extra_hosts: - "host.docker.internal:host-gateway"` to nginx service in docker-compose.dev.yml.

### NestJS main.ts Configuration

```typescript
// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1', {
    exclude: ['api/health'],  // health check lives at /api/health not /api/v1/health
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
```

### Health Check Endpoint

```typescript
// apps/api/src/health/health.controller.ts
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { prisma } from '@repo/database';
import Redis from 'ioredis';
import { ApiResponse } from '@repo/shared';

@Controller('api/health')  // explicit path, not under global prefix
export class HealthController {
  private readonly redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');

  @Get()
  async check(): Promise<ApiResponse<{ db: string; redis: string }>> {
    const results = { db: 'error', redis: 'error' };

    try {
      await prisma.$queryRaw`SELECT 1`;
      results.db = 'ok';
    } catch {
      // db check failed — keep 'error'
    }

    try {
      const pong = await this.redis.ping();
      if (pong === 'PONG') results.redis = 'ok';
    } catch {
      // redis check failed — keep 'error'
    }

    const allOk = results.db === 'ok' && results.redis === 'ok';
    if (!allOk) {
      throw new HttpException(
        { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Service degraded', data: results } },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    return { success: true, data: results };
  }
}
```

### GlobalExceptionFilter

```typescript
// apps/api/src/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ErrorCode, ApiResponse } from '@repo/shared';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof Error ? exception.message : 'Internal server error';

    const body: ApiResponse = {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message,
      },
    };

    response.status(status).json(body);
  }
}
```

### turbo.json Pipeline

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalEnv": [
    "DATABASE_URL", "REDIS_URL",
    "AMADEUS_API_KEY", "AMADEUS_API_SECRET",
    "STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET",
    "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "BETTER_AUTH_SECRET",
    "MAILTRAP_HOST", "MAILTRAP_PORT", "MAILTRAP_USER", "MAILTRAP_PASS",
    "NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "NODE_ENV", "PORT"
  ],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^typecheck"],
      "outputs": []
    }
  }
}
```

### Environment Variables (.env.example)

```bash
# Database
DATABASE_URL=postgresql://travelclone:travelclone@localhost:5432/travelclone
POSTGRES_USER=travelclone
POSTGRES_PASSWORD=travelclone
POSTGRES_DB=travelclone

# Redis
REDIS_URL=redis://localhost:6379

# Amadeus API
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret

# Stripe (test mode)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Google OAuth (Better Auth)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
BETTER_AUTH_SECRET=generate_32_char_random_string

# Email (Mailtrap)
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass

# Frontend (Next.js public)
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# App
NODE_ENV=development
PORT=4000
```

### Tailwind Design Tokens (apps/web/tailwind.config.ts)

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#EFF6FF', 100: '#DBEAFE',
        500: '#2980E8', 600: '#0064D2', 700: '#0052A8'
      },
      accent: {
        50: '#FFF8F1', 100: '#FFF7ED',
        600: '#FF6B00', 700: '#D45800'
      },
      success:  { 100: '#DCFCE7', 600: '#16A34A' },
      warning:  { 100: '#FEF3C7', 600: '#D97706' },
      error:    { 100: '#FEE2E2', 600: '#DC2626' },
    },
    borderRadius: {
      DEFAULT: '8px', lg: '12px', xl: '16px',
    },
  },
},
```

### Exact File Tree to Create

```
travelclone/                               ← repo root
├── apps/
│   ├── web/                               ← Next.js 15 (port 3000)
│   │   ├── src/app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── health/route.ts
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json                  ← extends @repo/tsconfig/nextjs.json
│   │   └── package.json
│   ├── api/                               ← NestJS 10 (port 4000)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── health/
│   │   │   │   ├── health.module.ts
│   │   │   │   └── health.controller.ts
│   │   │   └── filters/
│   │   │       └── http-exception.filter.ts
│   │   ├── tsconfig.json                  ← extends @repo/tsconfig/nestjs.json
│   │   └── package.json
│   └── admin/                             ← Refine (port 3001)
│       ├── src/app/
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── types/api-response.ts
│   │   │   ├── constants/error-codes.ts
│   │   │   ├── query-keys.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── database/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── eslint-config/
│   │   ├── base.js
│   │   ├── next.js
│   │   ├── nestjs.js
│   │   └── package.json
│   └── tsconfig/
│       ├── base.json
│       ├── nextjs.json
│       ├── nestjs.json
│       ├── react-library.json
│       └── package.json
├── nginx/
│   └── default.conf
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.dev.yml
├── docker-compose.yml                     ← production (all services containerized)
├── turbo.json
├── pnpm-workspace.yaml
├── package.json                           ← root: workspaces, turbo, engines
├── .env.example
└── .gitignore
```

### Key Dependency Versions

| Package | Version | Location |
|---|---|---|
| turbo | ^2.x | root devDependency |
| next | 15.x | apps/web |
| @nestjs/core | ^10.x | apps/api |
| @nestjs/common | ^10.x | apps/api |
| @nestjs/platform-express | ^10.x | apps/api |
| @nestjs/cli | ^10.x | apps/api devDep |
| prisma | ^5.x | packages/database devDep |
| @prisma/client | ^5.x | packages/database |
| ioredis | ^5.x | apps/api |
| class-validator | ^0.14.x | apps/api |
| class-transformer | ^0.5.x | apps/api |
| typescript | ^5.x | all packages |

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Root package.json

```json
{
  "name": "travelclone",
  "private": true,
  "engines": {
    "node": ">=20",
    "pnpm": ">=9"
  },
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md §2.1 — Monorepo Structure]
- [Source: _bmad-output/planning-artifacts/architecture.md §2.2 — Initialization]
- [Source: _bmad-output/planning-artifacts/architecture.md §3.3.1 — REST API Design + ApiResponse]
- [Source: _bmad-output/planning-artifacts/architecture.md §3.5.1 — Docker Compose Services]
- [Source: _bmad-output/planning-artifacts/architecture.md §3.5.2 — Nginx Routing]
- [Source: _bmad-output/planning-artifacts/architecture.md §3.5.5 — Health Checks]
- [Source: _bmad-output/planning-artifacts/architecture.md §4.1 — Naming Conventions]
- [Source: _bmad-output/planning-artifacts/epics.md §Story 1.1 — Acceptance Criteria]
- [Source: CLAUDE.md — Monorepo Structure, Naming Conventions, Design System]

## Dev Agent Record

### Agent Model Used
(to be filled by dev agent)

### Completion Notes List
(to be filled by dev agent)

### File List
(to be filled by dev agent)
