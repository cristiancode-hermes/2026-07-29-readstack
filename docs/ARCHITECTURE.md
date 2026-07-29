# ReadStack Architecture

## Overview

ReadStack is a full-stack book tracking and reading list management application built with Angular 22 and NestJS 11 in a monorepo structure.

## Project Structure

```
2026-07-29-readstack/
├── apps/
│   ├── api/          # NestJS 11 backend (TypeORM + SQLite)
│   │   ├── src/
│   │   │   ├── auth/          # JWT authentication module
│   │   │   ├── books/         # Books CRUD module
│   │   │   ├── dashboard/     # Dashboard stats aggregation
│   │   │   ├── entities/      # TypeORM entities
│   │   │   ├── reading-goal/  # Reading goals module
│   │   │   ├── reading-log/   # Reading session logging
│   │   │   ├── reading-status/ # Reading status tracking
│   │   │   ├── review/        # Book reviews module
│   │   │   └── seed/          # Database seeding
│   │   ├── .env
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/          # Angular 22 frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── guards/        # Auth route guard
│       │   │   ├── interceptors/  # Auth token interceptor
│       │   │   ├── interfaces/    # TypeScript interfaces
│       │   │   ├── layouts/       # Auth & Dashboard layouts
│       │   │   ├── pages/         # Page components
│       │   │   ├── services/      # API services
│       │   │   ├── app.config.ts
│       │   │   ├── app.routes.ts
│       │   │   └── app.component.ts
│       │   ├── public/
│       │   ├── index.html
│       │   ├── main.ts
│       │   └── styles.css
│       ├── angular.json
│       ├── package.json
│       └── tsconfig.app.json
├── docs/
├── package.json
└── tsconfig.json
```

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Angular (signals, zoneless, standalone) | ^22.0.0 |
| Styling | Tailwind CSS v4 | ^4.0.0 |
| Backend | NestJS | ^11.0.0 |
| Database | SQLite via better-sqlite3 (TypeORM) | ^13.0.0 |
| Auth | JWT (passport-jwt + bcryptjs) | - |
| Charts | Native SVG (no external libraries) | - |

## Key Architecture Decisions

- **Zoneless Angular**: Uses `provideZonelessChangeDetection()` for improved performance
- **Signal-based state**: All components use Angular signals for reactive state management
- **Standalone components**: No NgModules — fully standalone component architecture
- **Lazy-loaded routes**: All feature pages use `loadComponent` for code splitting
- **Module-based backend**: Each domain has its own NestJS module with controller + service
- **SQLite for dev**: TypeORM with better-sqlite3 for local development (Neon Postgres-ready)
- **Seed-on-startup**: `SEED_DB=true` env var triggers demo data creation

## Data Flow

1. User authenticates via JWT → token stored in localStorage
2. Auth interceptor attaches Bearer token to all `/api/` requests
3. Pages load data via services → API endpoints → TypeORM queries
4. Signal-based state management in Angular services updates UI reactively
