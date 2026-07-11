# AGENTS.md — Nailly Nail Salon App

## Project Overview

This is a **Nail Salon Management Application** ("Nailly") — a full-stack web app for managing a nail salon business. The frontend is built with **React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui**.

## Business Domain

This application serves **nail salon owners and staff** to manage:
- **Appointments** — Booking, scheduling, and tracking customer appointments
- **Services** — Nail services catalogue (manicure, pedicure, gel, nail art, etc.) with pricing
- **Customers** — Customer profiles, contact info, and service history
- **Staff** — Employee management and schedule
- **Revenue** — Sales reports and daily summaries

## Key Personas
- **Admin / Owner** — Full access, manages everything
- **Staff** — Can view/manage their assigned appointments
- (Future) **Customer** — Can book appointments online

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first, via `@tailwindcss/vite`) |
| Components | shadcn/ui (base-nova preset, Base UI) |
| Icons | lucide-react (note: brand icons removed in v1.0+) |
| Font | Geist Variable (`@fontsource-variable/geist`) |
| Routing | React Router DOM v7 (createBrowserRouter + Data API) |
| State | React Context API (AuthContext) |
| Auth | Mock auth (localStorage-based), ready for real backend |

## Project Structure

```
src/
├── contexts/          # React Context providers (Auth, etc.)
├── hooks/             # Custom React hooks
├── components/
│   ├── ui/            # shadcn/ui components (auto-generated, don't edit manually)
│   └── layout/        # Layout components (ProtectedRoute, etc.)
├── pages/             # Page-level components (one per route)
├── router/            # React Router route definitions
├── lib/               # Utility functions (cn, etc.)
└── assets/            # Static assets
```

## Coding Conventions

- **File naming**: PascalCase for components/pages (`LoginPage.tsx`), camelCase for hooks/utils (`useAuth.ts`)
- **Component pattern**: Functional components with TypeScript props interfaces
- **Styling**: Tailwind CSS utility classes only — no inline styles, no CSS Modules
- **Colors / Theme**: Use CSS variables from shadcn theme (`bg-background`, `text-foreground`, etc.). Primary brand color is **rose/pink** (nail salon theme)
- **Icons**: Use `lucide-react` for UI icons. For brand icons (GitHub, etc.) create inline SVG components
- **Path aliases**: Use `@/` prefix for src imports (e.g., `import { cn } from "@/lib/utils"`)
- **Routing**: Define all routes in `src/router/index.tsx`. Use `ProtectedRoute` for authenticated pages
- **Auth**: Access auth state via `useAuth()` hook only — never read localStorage directly

## Brand & Design

- **Brand Name**: Nailly (ไนลลี่)
- **Primary Color Palette**: Rose / Pink tones — elegant, feminine, professional
- **Typography**: Geist Variable (clean, modern sans-serif)
- **UI Style**: Glassmorphism cards, soft gradients, subtle shadows — premium nail salon feel
- **Language**: The app supports **Thai** (ภาษาไทย) for UI labels and content

## Mock Authentication (Development)

```
Username: admin
Password: nailly2025
Role: admin
```

Session is stored in `localStorage` under key `nailly_auth`. Real backend integration will replace this.

## Rules for AI Agents

1. **Always use `@/` imports** — never relative paths like `../../`
2. **Always use Tailwind classes** — no inline styles or arbitrary CSS files
3. **Never edit files in `src/components/ui/`** — these are managed by shadcn CLI
4. **Always type everything** — no `any` types unless absolutely necessary
5. **Follow the page pattern** — each route should have its own `*Page.tsx` in `src/pages/`
6. **Nail salon context** — When adding features, think from the perspective of a nail salon owner/staff
7. **Thai language** — UI-facing text should support Thai; use UTF-8 friendly strings
