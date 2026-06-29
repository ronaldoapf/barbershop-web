# Vite Boilerplate

A production-ready React boilerplate with a built-in Design System, opinionated architecture, and a full set of reusable UI components out of the box.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Routing | React Router v7 |
| Data Fetching | Axios + TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Tables | TanStack React Table v8 |
| Notifications | Sonner |
| Theme | next-themes (light / dark / system) |
| Package Manager | npm |
| Node.js | 24.14 |

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── api/                    # Axios calls + TanStack Query hooks, grouped by domain
│   └── [domain]/
│       ├── index.ts        # raw Axios functions
│       └── hooks.ts        # useQuery / useMutation wrappers
├── components/
│   ├── ui/                 # shadcn primitives — never hand-edit
│   ├── form/               # controlled field wrappers (InputForm, etc.)
│   └── layout/             # shared layout shells
├── contexts/               # React Context providers and their hooks
├── hooks/                  # shared custom hooks
├── lib/                    # utilities, env validation, API client, QueryClient
├── pages/                  # page shells grouped by scope
│   └── [scope]/[page]/
│       ├── index.tsx       # page shell — declarative only
│       └── components/     # page-local components
├── routes/                 # React Router route definitions
├── schemas/                # Zod schemas + inferred TypeScript types
└── utils/                  # pure domain utility functions
```

## Design System

The boilerplate ships a live Design System at `/design-system/*` — no external Storybook needed.

| Route | Description |
|---|---|
| `/design-system/colors` | All semantic color tokens with light / dark values and oklch lightness spectrum |
| `/design-system/components` | Every UI component with all variants and interactive states |
| `/design-system/data-table` | Full `DataTable` demo — search, filters, sorting, column visibility, row actions, pagination |

The Design System header provides route navigation and a light/dark theme toggle.

## UI Components

All primitives live in `src/components/ui/` and are installed via the shadcn CLI.

| Component | Description |
|---|---|
| `Avatar` | Profile image with fallback, notification badge, and group |
| `Badge` | Status label with 6 variants |
| `Button` | Action button with 6 variants and 8 sizes |
| `DatePicker` | Masked date input with calendar popover (pt-BR locale) |
| `DropdownMenu` | Contextual menu built on Radix UI |
| `Input` | Text field with focus, disabled, and invalid states |
| `Label` | Accessible form label |
| `Pagination` | Page navigation with ellipsis |
| `Select` | Single-value dropdown |
| `Separator` | Horizontal and vertical divider |
| `Sheet` | Slide-in panel from any side |
| `Skeleton` | Animated loading placeholder |
| `Tabs` | Tab navigation in `pill` and `line` variants |
| `Tooltip` | Contextual hint on hover |

### DataTable

A composable table system in `src/components/data-table/` built on TanStack React Table:

- Global text search with debounce
- Per-column filters: `select` (single) and `multiple` (multi-checkbox)
- Column sorting
- Column visibility toggle
- Pinned `actions` column with dropdown row actions
- Skeleton loading state
- Animated empty state
- Pagination with page-size selector

## Architecture Conventions

Full details are in [`architecture.md`](./architecture.md). Key rules:

- **Function declarations only** — never arrow-function component assignments
- **Named exports only** — no `export default`
- **`@/` alias** — all internal imports use `@/`, never relative paths beyond one level
- **No hardcoded colors** — always use Tailwind semantic tokens (`text-foreground`, `bg-background`, etc.)
- **Forms** — React Hook Form + Zod; field wrappers live in `src/components/form/`; page shells never contain form markup directly
- **API layer** — raw Axios calls in `src/api/[domain]/index.ts`; TanStack Query hooks in `src/api/[domain]/hooks.ts`; components never call Axios directly
- **Server state** — lives exclusively in React Query; never duplicated into Context
- **Env vars** — validated with Zod in `src/lib/env.ts`; `import.meta.env` never used outside that file

## Language Split

| Layer | Language |
|---|---|
| Product copy, labels, UI text | pt-BR |
| Code, file names, comments, docs | English |

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build (tsc + vite)
npm run preview  # preview production build
npm run lint     # run ESLint
```
