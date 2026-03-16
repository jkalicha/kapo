# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Kapo is a used car marketplace for Uruguay built with Next.js 16, Prisma (Neon serverless adapter), Better Auth, and Tailwind CSS v4. See `CLAUDE.md` for full architecture details and coding conventions.

### Services

| Service | How to start |
|---|---|
| PostgreSQL | `sudo service postgresql start` (local, user: `kapo`, password: `kapo123`, db: `kapo`) |
| WebSocket proxy | `node scripts/local-ws-proxy.mjs` (bridges Neon adapter to local PG on port 5433) |
| Next.js dev server | `pnpm dev` (port 3000) |

### Key gotchas

- **Neon adapter requires WebSocket proxy**: The app uses `@prisma/adapter-neon` which communicates via WebSockets. Local PostgreSQL doesn't support WebSockets natively. The `scripts/patch-neon-local.cjs` script patches `@neondatabase/serverless` to use the local WS proxy when `LOCAL_DB_WS_PROXY` env var is set. Run it after every `pnpm install`.
- **Turbopack module isolation**: The `src/instrumentation.ts` configures `neonConfig` at server startup, but Turbopack bundles create separate module scopes. The patch script is the primary mechanism that makes local DB work — it patches both `index.js` (CJS) and `index.mjs` (ESM) entry points.
- **Seed password incompatibility**: The seed script (`prisma/seed.ts`) uses `bcryptjs` to hash passwords, but Better Auth uses a different hashing algorithm (scrypt-like). Seed-created users **cannot sign in** via the UI. Create users through the API (`POST /api/auth/sign-up/email`) or the sign-up UI for testing.
- **Seed requires explicit env var**: Run seed as `LOCAL_DB_WS_PROXY=localhost:5433 pnpm db:seed` because `tsx` ESM hoisting loads `@neondatabase/serverless` before `dotenv` populates `.env.local`.
- **`pnpm.onlyBuiltDependencies`**: Added to `package.json` to allow build scripts for `@prisma/engines`, `esbuild`, `prisma`, `sharp`, and `unrs-resolver`. Without this, `pnpm install` skips required postinstall scripts.

### Standard commands

See `CLAUDE.md` Commands Reference for `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, and database commands.

### Starting the dev environment

1. Start PostgreSQL: `sudo service postgresql start`
2. Start WebSocket proxy: `node scripts/local-ws-proxy.mjs &`
3. Start dev server: `pnpm dev`

Ensure `.env.local` exists with `DATABASE_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, and `LOCAL_DB_WS_PROXY=localhost:5433`.
