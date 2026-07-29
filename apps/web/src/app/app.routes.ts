import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPageComponent) },
    ],
  },
  {
    path: 'register',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPageComponent) },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [() => import('./guards/auth.guard').then(m => m.authGuard)],
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPageComponent) },
    ],
  },
  {
    path: 'books',
    canActivate: [() => import('./guards/auth.guard').then(m => m.authGuard)],
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/books/books.page').then(m => m.BooksPageComponent) },
      { path: ':id', loadComponent: () => import('./pages/book-detail/book-detail.page').then(m => m.BookDetailPageComponent) },
    ],
  },
];
