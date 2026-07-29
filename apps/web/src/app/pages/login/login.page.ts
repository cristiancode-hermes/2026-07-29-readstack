import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <form (ngSubmit)="onLogin()" class="auth-form">
      <h2 class="form-title">Welcome back</h2>
      <p class="form-subtitle">Sign in to your reading dashboard</p>

      @if (error()) {
        <div class="alert alert-error">{{ error() }}</div>
      }

      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input id="email" type="email" class="form-input" [(ngModel)]="email" name="email" required placeholder="you@example.com" />
      </div>

      <div class="form-group">
        <label class="form-label" for="password">Password</label>
        <input id="password" type="password" class="form-input" [(ngModel)]="password" name="password" required placeholder="Enter your password" />
      </div>

      <button type="submit" class="btn btn-primary btn-block" [disabled]="loading()">
        @if (loading()) { Signing in... } @else { Sign In }
      </button>

      <p class="form-footer">
        Don't have an account? <a routerLink="/register">Register</a>
      </p>
    </form>
  `,
  styles: [`
    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-title { font-size: 1.5rem; font-weight: 700; color: var(--color-text); margin: 0; }
    .form-subtitle { color: var(--color-text-secondary); font-size: 0.875rem; margin: -0.75rem 0 0; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-text); }
    .form-input { padding: 0.625rem 0.75rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.875rem; background: var(--color-background); color: var(--color-text); outline: none; transition: border-color 0.15s ease; }
    .form-input:focus { border-color: var(--color-secondary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-secondary) 20%, transparent); }
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.625rem 1.25rem; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s ease; }
    .btn-primary { background: var(--color-primary); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--color-primary-light); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-block { width: 100%; }
    .alert { padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.8125rem; }
    .alert-error { background: color-mix(in srgb, var(--color-danger) 10%, transparent); color: var(--color-danger); border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent); }
    .form-footer { text-align: center; font-size: 0.8125rem; color: var(--color-text-secondary); margin: 0; }
    .form-footer a { color: var(--color-secondary); text-decoration: none; font-weight: 600; }
  `]
})
export class LoginPageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected email = '';
  protected password = '';
  protected loading = signal(false);
  protected error = signal('');

  async onLogin() {
    this.loading.set(true);
    this.error.set('');
    try {
      await lastValueFrom(this.auth.login({ email: this.email, password: this.password }));
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.error.set(err?.error?.message || 'Login failed');
    } finally {
      this.loading.set(false);
    }
  }
}
