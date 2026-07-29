import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-brand">
          <a routerLink="/login" class="auth-logo">ReadStack</a>
          <p class="auth-tagline">Track your reading journey</p>
        </div>
        <router-outlet />
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: var(--color-background);
    }
    .auth-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: var(--shadow-lg);
    }
    .auth-brand {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-logo {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--color-primary);
      text-decoration: none;
    }
    .auth-tagline {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class AuthLayoutComponent {}
