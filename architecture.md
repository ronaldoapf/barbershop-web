# Architecture & Constraints

This repository is built with **React 19**, **Vite**, **Tailwind CSS v4**, and **shadcn/ui**, following a modular, domain-driven structure that enforces clean separation between UI components, form state, and API layers.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Data Fetching | Axios + TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Notifications | Sonner (toast) |
| Language | TypeScript (strict) |
| Package Manager | npm |
| Node.js | 24.14 |

---

## Runtime & Package Manager

- **Node.js version: 24.14.** Always use this version. If a version manager is present (nvm, fnm, volta), run `node --version` to confirm before executing any command.
- **Package manager: npm.** Never use `pnpm` or `yarn`. All install, add, and script commands must go through `npm`.

```bash
# correct
npm install
npm add zod
npm dev

# wrong
pnpm install
yarn add zod
```

---

## Global Constraints

### Language Split

- **Product Layer (pt-BR):** copy, interface texts, product labels, and all business-facing terms visible to the end user.
- **Engineering Layer (English):** all source code, file names, folder names, variables, comments, and technical documentation.

### Component Style

Always use **function declarations** for components. Never use arrow function assignments.

```tsx
// correct
export function UserProfile() { ... }

// wrong
export const UserProfile = () => { ... }
```

### Exports

Use **named exports only**. Never use `export default` for components, hooks, or utilities.

```tsx
// correct
export function MyComponent() { ... }

// wrong
export default function MyComponent() { ... }
```

### Naming Conventions

| Target | Convention | Example |
|---|---|---|
| Files & folders | kebab-case | `user-profile.tsx` |
| Components | PascalCase | `UserProfile` |
| Hooks | camelCase prefixed with `use` | `useUserProfile` |
| Variables & functions | camelCase | `fetchUserData` |
| Zod schemas | camelCase suffixed with `Schema` | `userFormSchema` |
| TypeScript types from Zod | PascalCase | `UserFormData` |

---

## Directory Structure

```
src/
├── api/
│   └── [domain]/
│       ├── index.ts        # raw Axios calls only
│       └── hooks.ts        # TanStack Query hooks (useQuery / useMutation)
├── components/
│   ├── ui/                 # shadcn generated components — never hand-edit
│   └── form/               # reusable controlled field wrappers (InputForm, etc.)
├── contexts/               # React Context providers and their hooks
├── lib/
│   ├── utils.ts            # cn() and other shared utilities
│   ├── env.ts              # Zod-validated environment variables
│   ├── api-client.ts       # Axios instance with JWT handling
│   └── query-client.ts     # shared QueryClient instance
├── pages/
│   └── [scope]/
│       └── [page]/
│           ├── index.tsx   # page shell — declarative, no form state
│           └── components/ # page-local components (forms, sections, cards)
├── schemas/                # Zod schemas + inferred TS types
├── hooks/                  # shared custom hooks
├── utils/                  # pure utility functions grouped by domain
├── router/                 # route definitions
└── main.tsx
```

---

## 1. Component & Styling Guardrails

### Reusability First

Never recreate primitive components (Button, Input, Dialog, Badge, etc.) that already exist in `src/components/ui`. If a needed shadcn component is missing, install it via CLI:

```bash
npx shadcn@latest add <component>
```

Do **not** hand-edit any file inside `src/components/ui`. Those are owned by shadcn.

### Component File Anatomy

Every component file must follow this internal order:

1. **Imports**
2. **Types & interfaces** — props and any local types
3. **Main component** — the single exported component of the file

```tsx
// 1. Imports
import { cn } from "@/lib/utils"

// 2. Types
interface UserCardProps {
  name: string
  email: string
  isActive?: boolean
}

// 3. Main component
export function UserCard({ name, email, isActive = false }: UserCardProps) {
  return (
    <div className={cn("rounded-md border p-4", isActive && "border-primary")}>
      <p className="font-medium">{name}</p>
      <p className="text-muted-foreground text-sm">{email}</p>
    </div>
  )
}
```

---

### Component Decomposition

When a component grows to contain multiple distinct sub-components, split each piece into its own file inside the same directory. Expose everything through a single `index.ts` barrel — consumers import from the folder, never from internal files directly.

```
src/components/data-table/
├── data-table.tsx              # root component
├── data-table-toolbar.tsx
├── data-table-pagination.tsx
├── data-table-column-header.tsx
├── data-table-empty.tsx
├── types.ts                    # shared types for this component family
└── index.ts                    # re-exports everything
```

```ts
// index.ts
export { DataTable } from './data-table'
export { DataTableToolbar } from './data-table-toolbar'
export { DataTablePagination } from './data-table-pagination'
export type { DataTableFilterField } from './types'
```

```tsx
// correct — import from the barrel
import { DataTable, DataTableToolbar } from "@/components/data-table"

// wrong — import from internal files
import { DataTable } from "@/components/data-table/data-table"
```

The same pattern applies to page-local `components/` folders when a page accumulates several sub-components.

---

### No Inline Styles

Use Tailwind utility classes combined with the `cn()` helper for all conditional styling. Map rare one-off CSS rules to `src/index.css`.

```tsx
// correct
<div className={cn("rounded-md p-4", isActive && "bg-primary")} />

// wrong
<div style={{ borderRadius: 6, padding: 16 }} />
```

### Theming

Support both Dark and Light modes natively using shadcn semantic variables. Never hardcode colors.

```tsx
// correct
<p className="text-foreground bg-background" />

// wrong
<p className="text-gray-900 bg-white" />
```

---

## 2. Forms & Creation Workflow

Every form must enforce strict separation of validation, layout, and state orchestration.

### Rule: Isolate the Form from the Page

Never build form markup directly inside a page's root `index.tsx`. Always extract it to a dedicated component inside the page's local `components/` folder.

```
pages/private/users/
├── index.tsx              # page shell — renders <UserForm />, nothing more
└── components/
    └── user-form.tsx      # all form markup, fields, and submit handler live here
```

### Rule: Schema & Type Location

All Zod schemas and their inferred types belong in `src/schemas/`. Export both from the same file.

```ts
// src/schemas/user-form.ts
import { z } from "zod"

export const userFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export type UserFormData = z.infer<typeof userFormSchema>
```

### Rule: Use Form Field Wrappers

Always consume the pre-built wrappers in `src/components/form/` (e.g. `<InputForm<T> />`). If a new field type is needed, add it to `src/components/form/` — do not write one-off field implementations inside page components.

```tsx
<InputForm
  control={form.control}
  name="email"
  label="E-mail"
  placeholder="usuario@exemplo.com"
/>
```

### Rule: useController, Not register

Field wrappers must encapsulate state using `useController`. The primitive `<Controller />` from `react-hook-form` is only acceptable in extreme edge cases where hook integration is technically impossible. Never wire `register()` manually inside page scope.

```tsx
// correct — inside src/components/form/input-form.tsx
import { useController } from "react-hook-form"

export function InputForm<T>({ control, name, label, ...props }) {
  const { field, fieldState } = useController({ control, name })
  return (
    <div>
      <label>{label}</label>
      <Input {...field} {...props} />
      {fieldState.error && <p>{fieldState.error.message}</p>}
    </div>
  )
}
```

---

## 3. API Layer — Axios + TanStack Query

### Rule: Domain Isolation

Direct Axios calls live **exclusively** in `src/api/[domain]/index.ts`. Components and pages never call Axios directly — they only consume the TanStack Query hooks defined in `src/api/[domain]/hooks.ts`.

```
src/api/users/
├── index.ts   # getUser(), createUser(), updateUser() — Axios only
└── hooks.ts   # useGetUser(), useCreateUser() — TanStack wrappers
```

```ts
// src/api/users/index.ts
import { apiClient } from "@/lib/api-client"
import type { User } from "@/schemas/user"

export async function getUser(id: string): Promise<User> {
  const { data } = await apiClient.get(`/users/${id}`)
  return data
}
```

```ts
// src/api/users/hooks.ts
import { useQuery } from "@tanstack/react-query"
import { getUser } from "."

export function useGetUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
  })
}
```

### Axios Instance

`apiClient` (`src/lib/api-client.ts`) manages JWT authentication:

- Reads `access_token` and `user` from `localStorage` under the app-specific namespace key (e.g. `@app:access_token`).
- Automatically refreshes tokens expiring within 60 seconds.
- Queues concurrent requests during the refresh cycle.
- Redirects to `/login` on non-auth 401 responses.

### QueryClient Defaults

The shared `QueryClient` (`src/lib/query-client.ts`) is configured with:

| Option | Value |
|---|---|
| `staleTime` | 5 minutes |
| `gcTime` | 10 minutes |
| `retry` | 1 |
| `refetchOnWindowFocus` | `false` |

### Feedback Protocol

Always use `toast` from **sonner** to report mutation outcomes.

```ts
useMutation({
  mutationFn: createUser,
  onSuccess: () => toast.success("Usuário criado com sucesso."),
  onError: () => toast.error("Erro ao criar usuário."),
})
```

---

## 4. Routing

### Library

Use **React Router v7** (declarative mode). Route definitions live exclusively in `src/router/`. Never declare routes inline inside page components or `main.tsx`.

### Structure

```
src/router/
├── index.tsx          # root router — composes public and private trees
├── public-routes.tsx  # unauthenticated routes (/login, /register, etc.)
└── private-routes.tsx # authenticated routes wrapped in <PrivateGuard />
```

### Route Guard

All authenticated pages must be nested under a `<PrivateGuard />` component that checks for a valid session and redirects to `/login` when absent. Never add auth checks directly inside page components.

```tsx
// src/router/private-routes.tsx
export function PrivateRoutes() {
  return (
    <Route element={<PrivateGuard />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
    </Route>
  )
}
```

### Code Splitting

Every page-level component must be lazy-loaded. Wrap the router root with a single `<Suspense>` boundary.

```tsx
const Dashboard = lazy(() => import("@/pages/private/dashboard"))

// root router
<Suspense fallback={<PageSkeleton />}>
  <RouterProvider router={router} />
</Suspense>
```

### URL Parameters & Search Params

Read path params via `useParams` and search params via `useSearchParams`. Never read from `window.location` directly.

---

## 5. TypeScript Strictness

### No `any`

Never use `any` explicitly. If a type is genuinely unknown, use `unknown` and narrow it before use.

```ts
// correct
function parse(value: unknown): string {
  if (typeof value !== "string") throw new Error()
  return value
}

// wrong
function parse(value: any): string {
  return value
}
```

### No Unsafe Type Assertions

Avoid `as X` unless narrowing is provably impossible through other means. When required, add a comment explaining why.

```ts
// wrong
const user = data as User

// correct — validate at the boundary instead
const user = userSchema.parse(data)
```

### Explicit Return Types on Public Functions

All exported functions and hooks must declare their return type explicitly. Internal helpers may omit it when the type is obvious from the implementation.

```ts
// correct
export function useGetUser(id: string): UseQueryResult<User> { ... }

// wrong
export function useGetUser(id: string) { ... }
```

### No Non-Null Assertions

Avoid `!` (non-null assertion). Use optional chaining or explicit checks instead.

```ts
// wrong
const name = user!.name

// correct
const name = user?.name ?? "—"
```

---

## 6. Loading & Error States

### Loading

Use the `<Skeleton />` component from shadcn for all loading states. Never create custom spinners or ad-hoc loading indicators.

```tsx
// correct
import { Skeleton } from "@/components/ui/skeleton"

if (isLoading) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}
```

### Empty States

Always render an explicit empty state when a query returns an empty list. Never render nothing silently.

```tsx
if (!data?.length) {
  return <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
}
```

### Query Errors

Handle `isError` from TanStack Query at the component level for inline errors. Reserve `toast.error()` for mutation failures only — do not toast query errors.

```tsx
if (isError) {
  return <p className="text-destructive">Erro ao carregar os dados.</p>
}
```

### Pattern per Page

Every page that fetches data must handle all three states in this order before rendering content:

```tsx
if (isLoading) return <PageSkeleton />
if (isError) return <PageError />
return <PageContent data={data} />
```

---

## 7. Git Conventions

### Commit Messages — Conventional Commits

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

```
<type>(<scope>): <short description in English>
```

| Type | When to use |
|---|---|
| `feat` | new feature or capability |
| `fix` | bug fix |
| `refactor` | code change that neither fixes a bug nor adds a feature |
| `style` | formatting, missing semicolons, etc. — no logic change |
| `chore` | build process, deps update, tooling |
| `docs` | documentation only |
| `test` | adding or updating tests |

```bash
# correct
git commit -m "feat(users): add user creation form"
git commit -m "fix(api): handle 401 redirect on token expiry"
git commit -m "chore: update npm lockfile"

# wrong
git commit -m "fix stuff"
git commit -m "WIP"
```

### Branch Naming

Two accepted formats — use whichever applies to the project workflow:

**Descriptive (no ticket system):**
```
<type>/<short-kebab-description>
```

**Ticket-based (Jira, Linear, etc.):**
```
<type>/<PROJECT-PREFIX>-<task-number>
```

```bash
# descriptive
feat/user-creation-form
fix/token-refresh-race-condition
chore/upgrade-tanstack-query

# ticket-based
feat/PROJ-123
fix/PROJ-456
refactor/PROJ-789
```

When a ticket ID is available, prefer the ticket-based format — it links the branch directly to the task tracker.

### Rules

- Never commit directly to `main`. All changes go through a pull request.
- One logical change per commit. Avoid mixing unrelated changes in a single commit.
- Write commit messages in **English**, even though the product layer is pt-BR.

---

## 8. Environment Variables

### Naming & Prefix

All variables exposed to the browser must be prefixed with `VITE_`. Variables without this prefix are stripped at build time and will be `undefined` at runtime.

```bash
# correct — accessible via import.meta.env.VITE_API_URL
VITE_API_URL=https://api.example.com

# wrong — will be undefined in the browser
API_URL=https://api.example.com
```

### File

Use a single `.env` file at the project root. Never commit real secrets — only public, non-sensitive values belong here.

Always add `.env` to `.gitignore` and provide a `.env.example` with all required keys and placeholder values so other developers know what to fill in.

### What Must Never Be Exposed via `VITE_`

- Private API keys or secrets
- Database credentials
- JWT signing secrets
- Any credential that grants backend access

If a value must stay secret, it belongs on the server — not in a Vite environment variable.

### Access Pattern — Validated with Zod

All environment variables must be read through a single typed wrapper in `src/lib/env.ts` that validates the shape at startup using Zod. Never scatter `import.meta.env` calls across the codebase.

```ts
// src/lib/env.ts
import { z } from "zod"

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
})

export const env = envSchema.parse(import.meta.env)
```

If a required variable is missing or malformed, Zod throws at startup — making misconfiguration immediately visible instead of silently breaking at runtime.

```ts
// usage
import { env } from "@/lib/env"
apiClient.get(`${env.VITE_API_URL}/users`)
```

---

## 9. Path Aliases

The `@/` alias maps to `src/`. All internal imports must use this alias — never use relative paths that traverse more than one directory level.

```ts
// correct
import { Button } from "@/components/ui/button"
import { useGetUser } from "@/api/users/hooks"
import { env } from "@/lib/env"

// wrong
import { Button } from "../../components/ui/button"
import { useGetUser } from "../../../api/users/hooks"
```

The alias is configured in both `vite.config.ts` and `tsconfig.app.json`:

```ts
// vite.config.ts
import path from "path"

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
})
```

```json
// tsconfig.app.json — inside compilerOptions
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["src/*"]
  }
}
```

---

## 10. State Management

### Rule: Prefer React Query Over Local or Global State

Before reaching for any global state solution, check whether TanStack Query already holds the data. Server state (anything fetched from an API) must live exclusively in React Query — never duplicated into Context.

### When to Use React Context

Use Context only for **static or near-static values** that are set once and rarely change: theme, locale, authenticated user object. Never use Context as a reactive state manager for frequently changing UI state.

```tsx
// src/contexts/auth-context.tsx
interface AuthContextValue {
  user: User | null
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  return (
    <AuthContext value={{ user, signOut: () => setUser(null) }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  const ctx = use(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
```

Context files live in `src/contexts/[name]-context.tsx`.

### Decision Tree

```
Is the data fetched from an API?
  yes → React Query (useQuery / useMutation)
  no  → Is it shared across distant components?
          yes → React Context
          no  → useState / useReducer inside the component
```

---

## 11. Utility Functions

### When to Create a Utility

If a plain function (no hooks, no JSX) is used in more than one unrelated part of the codebase, extract it to `src/utils/`. Do not create a utility for logic that is only used in one domain — keep it co-located with its consumer.

### Directory Structure

Group utilities by domain in separate files. Never dump everything into a single `utils.ts`.

```
src/utils/
├── date.ts         # date formatting and parsing helpers
├── currency.ts     # number formatting for monetary values
├── string.ts       # text manipulation helpers
└── mask.ts         # input mask helpers (CPF, CNPJ, phone, etc.)
```

### Naming Rules

Function names must make both their **action** and **domain** explicit — a reader should understand what the function does and where it belongs without opening the file.

```ts
// correct — action + domain
export function formatCurrency(value: number): string { ... }
export function formatDate(date: Date, pattern: string): string { ... }
export function truncateString(text: string, max: number): string { ... }
export function maskCPF(value: string): string { ... }

// wrong — too generic, domain unclear
export function format(value: number): string { ... }
export function mask(value: string): string { ... }
export function handle(text: string): string { ... }
```

### Rules

- Utilities must be **pure functions** — no side effects, no API calls, no hook calls.
- Export each function individually with a named export. Never use `export default`.
- The `src/lib/utils.ts` file is reserved for the `cn()` helper and other shadcn/Tailwind-specific utilities. Domain utilities always go in `src/utils/`.

---

## Quick Reference — What Goes Where

| What | Where |
|---|---|
| shadcn primitives | `src/components/ui/` — install via CLI, never edit |
| Controlled field wrappers | `src/components/form/` |
| Shared utilities (`cn`, etc.) | `src/lib/utils.ts` |
| Env validation (Zod) | `src/lib/env.ts` |
| Axios instance | `src/lib/api-client.ts` |
| QueryClient instance | `src/lib/query-client.ts` |
| Raw API calls | `src/api/[domain]/index.ts` |
| TanStack Query hooks | `src/api/[domain]/hooks.ts` |
| Zod schemas + TS types | `src/schemas/[domain].ts` |
| Context API providers + hooks | `src/contexts/[name]-context.tsx` |
| Domain utility functions | `src/utils/[domain].ts` |
| Page shell (layout only) | `src/pages/[scope]/[page]/index.tsx` |
| Page-local form / section components | `src/pages/[scope]/[page]/components/` |
| Shared hooks | `src/hooks/` |
| Route definitions | `src/router/` |
