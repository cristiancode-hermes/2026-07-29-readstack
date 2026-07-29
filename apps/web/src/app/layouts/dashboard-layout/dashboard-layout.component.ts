import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo">ReadStack</a>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a routerLink="/books" routerLinkActive="active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Books
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <span class="user-name">{{ auth.currentUser()?.name }}</span>
            <span class="user-email">{{ auth.currentUser()?.email }}</span>
          </div>
          <button class="btn btn-ghost btn-sm" (click)="logout()">Logout</button>
        </div>
      </aside>
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .layout { display: flex; min-height: 100vh; }
    .sidebar {
      width: 240px;
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
    }
    .sidebar-header { margin-bottom: 2rem; }
    .sidebar-logo {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-primary);
      text-decoration: none;
    }
    .sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .sidebar-nav a:hover { background: var(--color-surface-alt); color: var(--color-text); }
    .sidebar-nav a.active { background: var(--color-surface-alt); color: var(--color-primary); font-weight: 600; }
    .sidebar-footer {
      border-top: 1px solid var(--color-border);
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-size: 0.875rem; font-weight: 600; color: var(--color-text); }
    .user-email { font-size: 0.75rem; color: var(--color-text-muted); }
    .main-content { flex: 1; padding: 2rem; overflow-y: auto; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 500; cursor: pointer; border: 1px solid transparent; transition: all 0.15s ease; }
    .btn-ghost { background: transparent; color: var(--color-text-secondary); border-color: transparent; }
    .btn-ghost:hover { background: var(--color-surface-alt); color: var(--color-danger); }
    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
  `]
})
export class DashboardLayoutComponent {
  protected auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
