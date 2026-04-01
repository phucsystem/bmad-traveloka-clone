# Debugger Report: NestJS API Health Endpoint Fix

**Date:** 2026-04-01
**Status:** DONE

---

## Root Cause

`packages/database` and `packages/shared` had `"main": "src/index.ts"` in their `package.json`. Node.js cannot execute raw `.ts` files — when `node dist/main.js` (compiled NestJS output) tried to `require('@repo/database')`, it followed the `main` field to a `.ts` file and threw `ERR_MODULE_NOT_FOUND` for the `.ts` imports inside it.

**Evidence chain:**
1. `packages/database/package.json` → `"main": "src/index.ts"` (confirmed)
2. `packages/shared/package.json` → `"main": "src/index.ts"` (confirmed)
3. Error: `Cannot find module '.../packages/database/src/client'` — Node loading `.ts`, failing on its own `.ts` import
4. NestJS `nest start --watch` compiles `apps/api/src/` → `dist/` correctly; problem was entirely in workspace package resolution

---

## Hypotheses Considered

| # | Hypothesis | Verdict |
|---|-----------|---------|
| 1 | Workspace packages point to raw `.ts` → Node can't execute | **CONFIRMED — root cause** |
| 2 | NestJS webpack builder failing to bundle workspace `.ts` files | Eliminated — webpack wasn't the issue; packages simply had no compiled output |
| 3 | Missing Prisma client generation | Eliminated — client was already generated; DB schema in sync |

---

## Fix Applied

### 1. Added `tsup` to both packages

```
packages/database/tsup.config.ts  — CJS output, externals: @prisma/client
packages/shared/tsup.config.ts    — CJS output
```

### 2. Updated `package.json` in both packages

Changed `main`/`types`/`exports` from `src/index.ts` → `dist/index.js` / `dist/index.d.ts`.
Added `"build": "tsup"` and `"dev": "tsup --watch"` scripts.

### 3. Reverted `nest-cli.json` to default tsc builder

Removed `builder: webpack` — unnecessary now packages emit CJS JS.

### 4. Added `pino-pretty` as direct dep to `apps/api`

pnpm strict hoisting meant `pino-pretty` (only a root-level transitive dep) wasn't resolvable by pino's runtime transport loader. `pnpm add pino-pretty --filter api` fixed it.

---

## Verification

```
curl http://localhost:4000/api/health
→ {"success":true,"data":{"db":"ok","redis":"ok"}}
```

Startup log: 0 TypeScript errors, NestJS bootstrapped cleanly.

---

## Files Changed

- `packages/database/package.json` — main/types/exports + build scripts
- `packages/database/tsup.config.ts` — new
- `packages/shared/package.json` — main/types/exports + build scripts
- `packages/shared/tsup.config.ts` — new
- `apps/api/nest-cli.json` — reverted to tsc builder
- `apps/api/package.json` — added `pino-pretty` dep

---

## Recurrence Prevention

- **Turbo pipeline gap:** `turbo.json` should add a `build` task for packages that must run before `api#dev`. Currently `pnpm turbo dev` would not pre-build packages, causing the same failure.
- **Recommendation:** Add to `turbo.json`:
  ```json
  "api#dev": { "dependsOn": ["@repo/database#build", "@repo/shared#build"] }
  ```
- **Monitoring:** No monitoring gap — error was deterministic at startup, not intermittent.
