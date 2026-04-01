# Section 2: Starter Template & Initialization

[Back to index](index.md)

---

## 2. Starter Template & Initialization

### 2.1 Monorepo Structure (Turborepo)

```
TravelClone monorepo
├── apps/
│   ├── web          — Next.js 15 App Router (PWA frontend)
│   ├── api          — NestJS 10 (REST API backend)
│   └── admin        — Refine + React (admin dashboard)
├── packages/
│   ├── shared       — TypeScript types, constants, utils (consumed by all apps)
│   ├── database     — Prisma schema, migrations, seed scripts
│   ├── eslint-config — Shared ESLint rules (extends eslint-config-next + nestjs)
│   └── tsconfig     — Shared tsconfig base files
```

### 2.2 Initialization

```bash
# Bootstrap Turborepo monorepo
npx create-turbo@latest travelclone --package-manager pnpm

# Add apps
cd travelclone
pnpm dlx create-next-app@15 apps/web --typescript --tailwind --app --src-dir --import-alias "@/*"
pnpm dlx @nestjs/cli new apps/api --package-manager pnpm
pnpm create refine-app@latest apps/admin -- --preset refine-nextjs

# Add packages
mkdir -p packages/{shared,database,eslint-config,tsconfig}
pnpm add -w prisma @prisma/client
pnpm add -w turbo
```

**Rationale for Turborepo:** Single repo enables type-safe imports across `apps/web`, `apps/api`, `apps/admin` via `packages/shared` without npm publish cycle. `turbo build` parallelizes all builds; `turbo dev` hot-reloads all services. Remote cache (Vercel/self-hosted) cuts CI build time 60%+.

### 2.3 What Starter Provides vs What We Build

| Provided by Starter | We Build |
|---|---|
| Next.js App Router scaffold | All pages, components, layouts |
| NestJS app shell + DI container | All modules, services, controllers |
| Refine CRUD scaffold | Customized resources, auth provider |
| Turborepo pipeline config | Per-package build scripts, env handling |
| Tailwind base config | Design system tokens, component variants |
| Prisma CLI | Full schema, all migrations, seed data |
