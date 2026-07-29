import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ReadingService } from '../../services/reading.service';
import { DashboardStats } from '../../interfaces';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Your reading overview</p>
      </div>
    </div>

    @if (loading()) {
      <div class="loading-grid">
        @for (item of [].constructor(4); track $index) {
          <div class="card skeleton-card"><div class="skeleton skeleton-h2"></div><div class="skeleton skeleton-p"></div></div>
        }
      </div>
    } @else {
      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="card kpi-card">
          <div class="kpi-icon" style="background: color-mix(in srgb, var(--color-info) 15%, transparent); color: var(--color-info);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div class="kpi-info">
            <span class="kpi-value">{{ stats().totalBooks }}</span>
            <span class="kpi-label">Total Books</span>
          </div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-icon" style="background: color-mix(in srgb, var(--color-success) 15%, transparent); color: var(--color-success);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="kpi-info">
            <span class="kpi-value">{{ stats().finishedBooks }}</span>
            <span class="kpi-label">Finished</span>
          </div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-icon" style="background: color-mix(in srgb, var(--color-warning) 15%, transparent); color: var(--color-warning);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="kpi-info">
            <span class="kpi-value">{{ stats().currentlyReading }}</span>
            <span class="kpi-label">Reading Now</span>
          </div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-icon" style="background: color-mix(in srgb, var(--color-text-muted) 15%, transparent); color: var(--color-text-muted);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
          </div>
          <div class="kpi-info">
            <span class="kpi-value">{{ stats().totalPagesRead }}</span>
            <span class="kpi-label">Pages Read</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Monthly Reading Chart -->
        <div class="card">
          <h3 class="card-title">Monthly Reading</h3>
          <div class="chart-container">
            @if (stats().monthlyPages.length > 0) {
              @let maxPages = Math.max(...stats().monthlyPages.map(m => m.pages), 1);
              @let chartH = 160;
              @let chartW = 320;
              @let barW = Math.max(20, Math.min(40, (chartW - 30) / stats().monthlyPages.length - 4));
              <svg [attr.viewBox]="'0 0 ' + chartW + ' ' + (chartH + 30)" class="bar-chart">
                @for (m of stats().monthlyPages; track m.month; let i = $index) {
                  @let barH = maxPages > 0 ? (m.pages / maxPages) * chartH : 0;
                  @let x = 15 + i * (barW + 8);
                  @let y = chartH - barH;
                  <rect [attr.x]="x" [attr.y]="y" [attr.width]="barW" [attr.height]="barH" rx="4" fill="var(--color-secondary)" opacity="0.85" />
                  <text [attr.x]="x + barW/2" y="195" text-anchor="middle" font-size="10" fill="var(--color-text-muted)">{{ m.month.slice(5) }}</text>
                  <text [attr.x]="x + barW/2" [attr.y]="y - 6" text-anchor="middle" font-size="10" fill="var(--color-text-secondary)" font-weight="600">{{ m.pages }}</text>
                }
              </svg>
            } @else {
              <p class="empty-chart">No reading data yet</p>
            }
          </div>
        </div>

        <!-- Goal Progress -->
        <div class="card">
          <h3 class="card-title">2026 Reading Goal</h3>
          @if (stats().goalProgress !== null) {
            <div class="goal-display">
              <div class="goal-ring-container">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="var(--color-border)" stroke-width="10" />
                  @let circumference = 2 * Math.PI * 60;
                  @let offset = circumference - (stats().goalProgress! / 100) * circumference;
                  <circle cx="70" cy="70" r="60" fill="none" stroke="var(--color-success)" stroke-width="10"
                    stroke-dasharray="377" [attr.stroke-dashoffset]="offset"
                    transform="rotate(-90 70 70)" stroke-linecap="round" />
                  <text x="70" y="66" text-anchor="middle" font-size="24" font-weight="700" fill="var(--color-text)">{{ stats().finishedBooks }}</text>
                  <text x="70" y="84" text-anchor="middle" font-size="10" fill="var(--color-text-muted)">of {{ Math.round(stats().goalProgress! > 0 ? stats().finishedBooks / (stats().goalProgress! / 100) : 0) }}</text>
                </svg>
              </div>
              <p class="goal-label">{{ Math.round(stats().goalProgress!) }}% complete</p>
            </div>
          } @else {
            <p style="color: var(--color-text-muted); font-size: 0.875rem;">No reading goal set for this year.</p>
          }
        </div>

        <!-- Genre Breakdown -->
        <div class="card">
          <h3 class="card-title">Genres</h3>
          <div class="genre-list">
            @for (entry of genreEntries(); track entry[0]) {
              <div class="genre-item">
                <span class="genre-name">{{ entry[0] }}</span>
                <div class="genre-bar-bg">
                  <div class="genre-bar-fill" [style.width.%]="(entry[1] / maxGenreCount()) * 100"></div>
                </div>
                <span class="genre-count">{{ entry[1] }}</span>
              </div>
            } @empty {
              <p style="color: var(--color-text-muted); font-size: 0.875rem;">No books with genres yet.</p>
            }
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <h3 class="card-title">Quick Actions</h3>
          <div class="quick-actions">
            <a routerLink="/books" class="action-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add a Book
            </a>
            <a routerLink="/books" class="action-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              View Library
            </a>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .page-subtitle { color: var(--color-text-secondary); font-size: 0.875rem; margin: 0.25rem 0 0; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem; }
    .kpi-card { display: flex; align-items: center; gap: 1rem; }
    .kpi-icon { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .kpi-info { display: flex; flex-direction: column; }
    .kpi-value { font-size: 1.5rem; font-weight: 700; color: var(--color-text); line-height: 1; }
    .kpi-label { font-size: 0.8125rem; color: var(--color-text-muted); }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .card-title { font-size: 1rem; font-weight: 600; margin: 0 0 1rem; }
    .chart-container { width: 100%; }
    .bar-chart { width: 100%; height: auto; }
    .empty-chart { text-align: center; color: var(--color-text-muted); padding: 2rem; }
    .goal-display { text-align: center; }
    .goal-ring-container { display: flex; justify-content: center; margin-bottom: 0.5rem; }
    .goal-label { font-size: 0.875rem; color: var(--color-text-secondary); font-weight: 600; margin: 0; }
    .genre-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .genre-item { display: flex; align-items: center; gap: 0.5rem; }
    .genre-name { font-size: 0.8125rem; color: var(--color-text); width: 100px; flex-shrink: 0; }
    .genre-bar-bg { flex: 1; height: 8px; background: var(--color-border); border-radius: 4px; overflow: hidden; }
    .genre-bar-fill { height: 100%; background: var(--color-secondary); border-radius: 4px; transition: width 0.3s ease; }
    .genre-count { font-size: 0.75rem; color: var(--color-text-muted); width: 24px; text-align: right; }
    .quick-actions { display: flex; flex-direction: column; gap: 0.5rem; }
    .action-card { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); text-decoration: none; color: var(--color-text); font-size: 0.875rem; font-weight: 500; transition: all 0.15s ease; }
    .action-card:hover { background: var(--color-surface-alt); border-color: var(--color-secondary); }
    .loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .skeleton-card { height: 80px; display: flex; flex-direction: column; gap: 0.5rem; }
    .skeleton { background: var(--color-border); border-radius: 4px; animation: pulse 1.5s ease-in-out infinite; }
    .skeleton-h2 { height: 24px; width: 60%; }
    .skeleton-p { height: 12px; width: 40%; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } }
  `]
})
export class DashboardPageComponent implements OnInit {
  private readingService = inject(ReadingService);

  protected loading = signal(true);
  protected stats = signal<DashboardStats>({
    totalBooks: 0, finishedBooks: 0, currentlyReading: 0, wantToRead: 0,
    totalPagesRead: 0, totalSessions: 0, goalProgress: null,
    monthlyPages: [], genreBreakdown: {}
  });
  protected Math = Math;

  get genreEntries(): () => [string, number][] {
    return () => Object.entries(this.stats().genreBreakdown).sort((a, b) => b[1] - a[1]);
  }

  get maxGenreCount(): () => number {
    return () => {
      const entries = Object.values(this.stats().genreBreakdown);
      return entries.length > 0 ? Math.max(...entries) : 1;
    };
  }

  async ngOnInit() {
    try {
      const stats = await lastValueFrom(this.readingService.getDashboard());
      this.stats.set(stats);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      this.loading.set(false);
    }
  }
}
