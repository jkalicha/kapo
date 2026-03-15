# CLAUDE.md

## Project Overview

This is a **Next.js** full-stack application. Claude Code should always prioritize correctness, type safety, and clean architecture over speed. Think before acting — read existing patterns before writing new code.

---

## Tech Stack

| Layer           | Technology               |
| --------------- | ------------------------ |
| Framework       | Next.js 15 (App Router)  |
| Language        | TypeScript (strict mode) |
| Styling         | Tailwind CSS v4          |
| Components      | shadcn/ui                |
| Database        | Neon (PostgreSQL)        |
| ORM             | Prisma                   |
| Auth            | Better Auth              |
| Deployment      | Vercel                   |
| Package Manager | pnpm                     |

---

## Core Principles

1. **Read before writing** — explore the codebase structure before adding code.
2. **Follow existing patterns** — match the style, naming, and architecture already in place.
3. **Type everything** — no `any`, no implicit types, no type assertions without justification.
4. **Server-first** — use Server Components and Server Actions by default. Only add `"use client"` when truly needed.
5. **Small, focused changes** — prefer multiple small commits over one large refactor.
6. **Never break what works** — run checks before finishing.

---

## Project Structure

```
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth route group (sign-in, sign-up)
│   ├── (dashboard)/            # Protected route group
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/       # Better Auth catch-all handler
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles + Tailwind
├── components/
│   ├── ui/                     # shadcn/ui primitives (DO NOT edit)
│   └── [feature]/              # Feature-specific components
├── lib/
│   ├── auth.ts                 # Better Auth server instance
│   ├── auth-client.ts          # Better Auth client instance
│   ├── db.ts                   # Prisma client singleton
│   ├── actions/                # Server Actions
│   ├── hooks/                  # Custom React hooks
│   ├── utils.ts                # Shared utilities (cn, etc.)
│   └── validations/            # Zod schemas
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Auto-generated migrations
├── types/                      # Global TypeScript types
├── public/                     # Static assets
└── middleware.ts               # Auth + route protection
```

---

## TypeScript Rules

- Strict mode is **always on** (`"strict": true` in tsconfig).
- Prefer `interface` for object shapes, `type` for unions/intersections.
- All async functions must have explicit return types.
- Use Zod for all runtime validation — never trust external input.
- Use `satisfies` operator instead of type casting where possible.

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// ❌ Bad
const user = data as any;
```

---

## Next.js Conventions

### Server vs Client Components

- Default to **Server Components**.
- Add `"use client"` only for: interactivity (useState, useEffect), browser APIs, event listeners.
- Never fetch data in Client Components — pass data as props from Server Components.

### Server Actions

- Place all mutations in `lib/actions/`.
- Always validate input with Zod.
- Return typed responses using a consistent pattern:

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

### Data Fetching

- Use `fetch` with proper caching in Server Components.
- Use `unstable_cache` or `cache()` for expensive queries.
- Never use `useEffect` for data fetching — use React Query or SWR if client-side fetching is required.

### Route Handlers

- Keep `/app/api/` handlers thin — logic belongs in `lib/`.
- Always validate request bodies with Zod.
- Return `NextResponse.json()` with appropriate status codes.

---

## Styling Rules

- Use **Tailwind utility classes** — no custom CSS unless absolutely necessary.
- Use `cn()` from `lib/utils.ts` for conditional class merging.
- Follow shadcn/ui conventions — don't override component internals, extend via `className`.
- Responsive design: mobile-first (`sm:`, `md:`, `lg:`).
- Dark mode: use CSS variables defined by shadcn, not hardcoded colors.

```typescript
// ✅ Good
<Button className={cn("w-full", isLoading && "opacity-50")} />

// ❌ Bad
<div style={{ backgroundColor: '#fff' }} />
```

---

## Database Rules (Prisma + Neon)

- Schema lives in `prisma/schema.prisma` — this is the single source of truth.
- Never edit migration files manually — use `pnpm db:migrate` to generate them.
- Prisma Client is a singleton in `lib/db.ts`:

```typescript
// lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

- All queries go in `lib/actions/` or dedicated query files — never inline in components.
- Use transactions (`db.$transaction`) for multi-step mutations.
- Use Neon's connection pooling URL (`DATABASE_URL`) for queries and a direct URL (`DIRECT_URL`) for migrations:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // pooled (for runtime)
  directUrl = env("DIRECT_URL")        // direct (for migrations)
}
```

- Never expose `DATABASE_URL` or `DIRECT_URL` client-side.

---

## Authentication (Better Auth)

Better Auth is the auth layer. It handles sessions, users, OAuth, and more — fully type-safe and framework-agnostic.

### Setup files

```typescript
// lib/auth.ts — server instance
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
```

```typescript
// lib/auth-client.ts — browser/client instance
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signOut, signUp, useSession } = authClient;
```

### API Route Handler

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### Accessing the session

```typescript
// Server Component or Server Action
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect("/sign-in");
```

```typescript
// Client Component
import { useSession } from "@/lib/auth-client";

const { data: session, isPending } = useSession();
```

### Middleware protection

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isProtected = request.nextUrl.pathname.startsWith("/dashboard");

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

### Rules

- Never store passwords manually — Better Auth handles hashing.
- Always check session server-side for protected Server Actions.
- Use `useSession()` only in Client Components — use `auth.api.getSession()` in server contexts.
- OAuth providers are configured once in `lib/auth.ts` — don't duplicate config.

---

## Environment Variables

- All secrets in `.env.local` (never committed).
- Validate env vars at startup with Zod in `lib/env.ts`:

```typescript
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  // Optional OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

- Prefix browser-safe vars with `NEXT_PUBLIC_`.
- Document all required vars in `.env.example`.

---

## Error Handling

- Use `error.tsx` boundary files per route segment.
- Server Actions return typed error results — never throw to the client.
- Log errors server-side with context (user ID, route, timestamp).
- Show user-friendly messages, never raw error strings.

---

## Component Patterns

### File naming

- Components: `PascalCase.tsx`
- Hooks: `use-kebab-case.ts`
- Utils/helpers: `kebab-case.ts`
- Server Actions: `kebab-case.ts`

### Component structure

```typescript
// 1. Imports
// 2. Types/interfaces
// 3. Component function
// 4. Sub-components (if small and tightly coupled)
// 5. Export

interface Props {
  title: string
  children: React.ReactNode
}

export function Card({ title, children }: Props) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  )
}
```

---

## Git Workflow

- Branch naming: `feat/description`, `fix/description`, `chore/description`
- Commit format: `feat: add user authentication` (conventional commits)
- Every PR must have a clear description of **what** and **why**
- Use the installed `/commit` and `/commit-push-pr` commands for consistency

---

## Commands Reference

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm typecheck        # Run tsc --noEmit
pnpm lint             # ESLint
pnpm db:generate      # Generate Prisma Client after schema changes
pnpm db:migrate       # Create and apply a new migration
pnpm db:push          # Push schema (dev only, no migration file)
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Run seed script
```

---

## Claude Code Slash Commands (installed)

| Command             | Purpose                                 |
| ------------------- | --------------------------------------- |
| `/feature-dev`      | Guided feature development              |
| `/frontend-design`  | Production-grade UI components          |
| `/simplify`         | Review changed code for quality         |
| `/commit`           | Create a git commit                     |
| `/commit-push-pr`   | Commit, push, and open PR               |
| `/review-pr`        | Comprehensive PR review                 |
| `/revise-claude-md` | Update this file with session learnings |
| `/vercel:deploy`    | Deploy to Vercel                        |
| `/vercel:logs`      | View deployment logs                    |

---

## What Claude Should NOT Do

- ❌ Use `any` type
- ❌ Add `"use client"` without justification
- ❌ Fetch data inside Client Components with `useEffect`
- ❌ Edit files in `components/ui/` (shadcn primitives)
- ❌ Hardcode secrets or API keys
- ❌ Edit migration files in `prisma/migrations/` manually
- ❌ Create a second Prisma Client instance — always import from `lib/db.ts`
- ❌ Skip Zod validation on user input
- ❌ Check session only client-side for protected operations
- ❌ Create files outside the established structure without asking

---

## Before Finishing Any Task

- [ ] `pnpm typecheck` passes with no errors
- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm build` succeeds locally
- [ ] New env vars are added to `.env.example`
- [ ] No unused imports or variables
- [ ] Loading and error states are handled in UI

---

## Notes

> This file is actively maintained. After significant sessions, run `/revise-claude-md` to capture new patterns and decisions made during development.
