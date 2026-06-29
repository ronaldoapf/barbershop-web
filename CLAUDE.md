# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

**Read `architecture.md` before making any non-trivial change.** It is the authoritative source of truth for all conventions in this project — component structure, API layer, forms, routing, TypeScript rules, state management, utilities, environment variables, and git conventions.

## Commands

```bash
npm run dev       # start dev server
npm run build     # type-check + production build (tsc -b && vite build)
npm run lint      # run ESLint
npm run preview   # preview production build locally
```

There is no test runner configured. There are no test commands.

To add a new shadcn component:
```bash
npx shadcn@latest add <component>
```

## Runtime & Package Manager

- **Node.js 24.14** — run `node --version` to confirm before any command.
- **npm only** — never use `pnpm` or `yarn`.

## Key Architectural Rules (summary — see `architecture.md` for full detail)

- **Language split:** source code and commits in English; all UI copy/labels in pt-BR.
- **Component style:** function declarations (`export function Foo()`) and named exports only — no arrow assignments, no `export default`.
- **`src/components/ui/`** is owned by shadcn — never hand-edit files there.
- **API layer:** raw Axios calls only in `src/api/[domain]/index.ts`; TanStack Query hooks in `src/api/[domain]/hooks.ts`; components never call Axios directly.
- **Forms:** form markup lives in a page-local `components/` folder, never in the page's `index.tsx`; use `useController` wrappers from `src/components/form/`, never `register()` directly.
- **Routing:** React Router v7, route definitions in `src/router/` only; all page-level components must be lazy-loaded.
- **State:** server state lives in React Query only; Context is for static/near-static values (theme, locale, authed user).
- **TypeScript:** no `any`, no non-null assertions (`!`), no unsafe `as X`; all exported functions/hooks must declare return types explicitly.
- **Env vars:** all browser-exposed vars prefixed `VITE_`; read only through the Zod-validated wrapper at `src/lib/env.ts`.
- **Path aliases:** always use `@/` — no relative paths traversing more than one level.
- **Commits:** Conventional Commits format (`feat(scope): description`), English, one logical change per commit, never commit directly to `main`.
