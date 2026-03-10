# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev       # Start development server (http://localhost:3000)
pnpm build     # Build for production
pnpm start     # Start production server
pnpm lint      # Run ESLint
```

> Use `pnpm` as the package manager.

## Environment

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Architecture

**Next.js 16 App Router** — no `src/` prefix, code lives at the root level.

### Route Structure

| Group | Path | Purpose |
|---|---|---|
| `app/(auth)/` | `/login`, `/register` | Public auth pages (split-panel layout) |
| `app/(landing)/` | `/` → `app/page.tsx` | Landing page (currently root page.tsx) |
| `app/(app)/` | `/dashboard`, etc. | Protected app shell (to be built) |

### API Layer (`lib/api/`)

Two preconfigured axios instances — same factory, different token sources:

- `publicApi` → reads `localStorage.getItem('token')` → targets `/api/v1/*`
- `tenantApi` → reads `localStorage.getItem('tenant_token')` → targets `/api/v1/tenant/*`

Both created via `createApiClient(getToken)` in `lib/api/client.ts`.

### Services (`services/`)

Thin wrappers over the API clients. One file per domain:
- `auth.service.ts` — public auth (login, register, forgot/reset password)
- `tenant-auth.service.ts` — tenant auth (login, forgot/reset password)

Add new service files here as domains expand (users, roles, tenants, etc.).

### State Management (`stores/`)

Zustand with `persist` middleware (localStorage key: `auth-storage`):
- `auth.store.ts` — `token`, `tenantToken`, `user`, `setAuth()`, `setTenantToken()`, `logout()`

### Types (`types/`)

- `api.ts` — `ApiResponse<T>`, `PaginatedData<T>` wrappers
- `auth.ts` — `User`, `Role`, `AuthData`, login/register payload types

### UI Components

shadcn/ui (`base-nova` style, neutral base color) — components in `components/ui/`.
Available: `button`, `badge`, `card`, `checkbox`, `input`, `label`, `separator`.

## Backend Context

- Base URL: `http://localhost:8080/api/v1`
- Two JWT systems: **public** (platform-level) and **tenant** (company-level)
- Public auth header: `Authorization: Bearer <token>`
- Tenant auth header: `Authorization: Bearer <tenant_token>`
- Tenant login requires `schema_name` field (e.g. `"tenant_3"`)
- Money values are BIGINT in IDR (e.g. `150000` = Rp 150.000)

## Coding Principles

- **KISS** — Keep It Simple Stupid. Write code everyone can understand.
- No `any` in TypeScript — strictly typed.
- Components have one responsibility. Keep them small and focused.
- Build what is needed now — no over-engineering for hypothetical future needs.
