# ReadStack Frontend

## Architecture

Built with Angular 22 using:
- **Standalone components** — no NgModules
- **Zoneless change detection** — `provideZonelessChangeDetection()`
- **Signal-based state** — `signal()`, `computed()`, `effect()` throughout
- **Lazy-loaded routes** — `loadComponent` with named exports
- **Functional interceptors** — auth token injection
- **Async guards** — profile fetch on navigation

## Routes

| Path | Component | Auth Required | Layout |
|------|-----------|:---:|--------|
| `/login` | LoginPageComponent | No | AuthLayout |
| `/register` | RegisterPageComponent | No | AuthLayout |
| `/dashboard` | DashboardPageComponent | Yes | DashboardLayout |
| `/books` | BooksPageComponent | Yes | DashboardLayout |
| `/books/:id` | BookDetailPageComponent | Yes | DashboardLayout |

## Component Tree

```
AppComponent
├── AuthLayoutComponent
│   ├── LoginPageComponent
│   └── RegisterPageComponent
└── DashboardLayoutComponent
    ├── DashboardPageComponent
    ├── BooksPageComponent
    └── BookDetailPageComponent
```

## Services

- **AuthService** — Login, register, profile, token management, current user signal
- **BooksService** — Book CRUD operations
- **ReadingService** — Reading status, logs, goals, dashboard stats

## State Management

All state is managed via Angular signals:

- Page components own their data signals (`loading`, `error`, `items`)
- Services expose signals for shared state (`currentUser`, `isAuthenticated`)
- Components subscribe to API calls via `lastValueFrom()` for async/await patterns

## Design System

- **Palette**: Midnight Indigo (indigo-based with warm accents)
- **Font**: Inter (Google Fonts)
- **Dark mode**: Via `data-theme` attribute on `<html>` element
- **Charts**: Pure SVG (bar charts, donut progress ring)
- **Responsive**: Mobile-friendly grid layouts with CSS Grid

## Key Patterns

1. **State Triad**: Every data-fetching page uses `loading() → error() → empty → content`
2. **Signal calls in templates**: All signals called with `()` in templates
3. **`@let` template variables**: Used in SVG charts for computed values
4. **Modal forms**: Add book via modal overlay with form validation
5. **Search with debounce**: 300ms debounce on book search
6. **Deterministic colors**: Book covers use hash-based color assignment
