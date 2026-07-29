import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { BooksService } from '../../services/books.service';
import { ReadingService } from '../../services/reading.service';
import { Book, ReadingStatus, ReadingLog } from '../../interfaces';

@Component({
  selector: 'app-book-detail-page',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  template: `
    <div class="page-header">
      <a routerLink="/books" class="back-link">&larr; Back to Books</a>
    </div>

    @if (loading()) {
      <div class="loading-state">Loading...</div>
    } @else if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    } @else {
      <!-- Book Header -->
      <div class="book-header">
        <div class="book-cover-lg" [style.background]="getCoverColor(book().title)">
          <span class="book-initials-lg">{{ getInitials(book().title) }}</span>
        </div>
        <div class="book-meta">
          <h1 class="book-title-lg">{{ book().title }}</h1>
          <p class="book-author-lg">by {{ book().author }}</p>
          <div class="book-details">
            @if (book().genre) { <span class="badge badge-genre">{{ book().genre }}</span> }
            @if (book().pages) { <span class="badge badge-pages">{{ book().pages }} pages</span> }
          </div>
          @if (book().description) {
            <p class="book-description">{{ book().description }}</p>
          }
        </div>
      </div>

      <!-- Reading Status -->
      <div class="section">
        <h3 class="section-title">Reading Status</h3>
        <div class="status-actions">
          @for (s of statusOptions; track s.value) {
            <button class="btn status-btn" [class.active]="currentStatus()?.status === s.value"
              (click)="setStatus(s.value)" [style]="getStatusBtnStyle(s.value)">
              {{ s.label }}
            </button>
          }
        </div>
        @if (currentStatus(); as status) {
          <div class="status-info">
            <span>Started: {{ status.startDate ? (status.startDate | date:'mediumDate') : 'Not started' }}</span>
            @if (status.endDate) { <span>Finished: {{ status.endDate | date:'mediumDate' }}</span> }
            @if (status.status === 'currently_reading' && book().pages) {
              <span>Progress: {{ Math.round((status.currentPage / (book().pages || 1)) * 100) }}% ({{ status.currentPage }}/{{ book().pages }} pages)</span>
            }
          </div>
        }
      </div>

      <!-- Log Reading -->
      <div class="section">
        <h3 class="section-title">Log Reading Session</h3>
        <div class="log-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Pages Read</label>
              <input type="number" class="form-input" [(ngModel)]="logEntry.pagesRead" min="1" />
            </div>
            <div class="form-group">
              <label class="form-label">Date</label>
              <input type="date" class="form-input" [(ngModel)]="logEntry.logDate" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Notes (optional)</label>
            <input type="text" class="form-input" [(ngModel)]="logEntry.notes" placeholder="How was your reading session?" />
          </div>
          <button class="btn btn-primary" (click)="onLogReading()" [disabled]="!logEntry.pagesRead">Log Session</button>
        </div>
      </div>

      <!-- Reading History -->
      <div class="section">
        <h3 class="section-title">Reading History</h3>
        @if (logs().length === 0) {
          <p class="empty-text">No reading sessions logged yet.</p>
        } @else {
          <div class="log-list">
            @for (log of logs(); track log.id) {
              <div class="log-entry">
                <div class="log-date">{{ log.logDate | date:'mediumDate' }}</div>
                <div class="log-pages">{{ log.pagesRead }} pages</div>
                @if (log.notes) { <div class="log-notes">{{ log.notes }}</div> }
              </div>
            }
          </div>
          @let total = logs().reduce((sum, l) => sum + l.pagesRead, 0);
          <p class="log-total">Total: <strong>{{ total }}</strong> pages read</p>
        }
      </div>

      <!-- Monthly Stats -->
      <div class="section">
        <h3 class="section-title">Monthly Stats</h3>
        <div class="mini-stats">
          <div class="mini-stat">
            <span class="mini-stat-value">{{ monthlyStats().totalSessions }}</span>
            <span class="mini-stat-label">Sessions</span>
          </div>
          <div class="mini-stat">
            <span class="mini-stat-value">{{ monthlyStats().totalPages }}</span>
            <span class="mini-stat-label">Pages</span>
          </div>
          <div class="mini-stat">
            <span class="mini-stat-value">{{ monthlyStats().readingDays }}</span>
            <span class="mini-stat-label">Reading Days</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    .back-link { color: var(--color-secondary); text-decoration: none; font-size: 0.875rem; font-weight: 500; }
    .back-link:hover { text-decoration: underline; }
    .book-header { display: flex; gap: 1.5rem; margin-bottom: 2rem; }
    .book-cover-lg { width: 120px; height: 168px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .book-initials-lg { font-size: 1.5rem; font-weight: 700; color: white; text-transform: uppercase; }
    .book-meta { flex: 1; }
    .book-title-lg { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.25rem; }
    .book-author-lg { font-size: 1rem; color: var(--color-text-secondary); margin: 0 0 0.75rem; }
    .book-details { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
    .badge { padding: 0.125rem 0.5rem; font-size: 0.6875rem; font-weight: 500; border-radius: var(--radius-full); }
    .badge-genre { background: color-mix(in srgb, var(--color-info) 12%, transparent); color: var(--color-info); }
    .badge-pages { background: color-mix(in srgb, var(--color-accent) 12%, transparent); color: var(--color-accent); }
    .book-description { font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.6; margin: 0; }
    .section { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1rem; }
    .section-title { font-size: 1rem; font-weight: 600; margin: 0 0 1rem; }
    .status-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem; }
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.625rem 1.25rem; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 600; cursor: pointer; border: 1px solid var(--color-border); transition: all 0.15s ease; }
    .btn-primary { background: var(--color-primary); color: white; border-color: var(--color-primary); }
    .btn-primary:hover:not(:disabled) { background: var(--color-primary-light); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .status-btn { background: var(--color-background); color: var(--color-text-secondary); font-size: 0.8125rem; padding: 0.375rem 0.75rem; }
    .status-btn.active { font-weight: 700; color: white; }
    .status-info { display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.8125rem; color: var(--color-text-secondary); }
    .log-form { display: flex; flex-direction: column; gap: 0.75rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-text); }
    .form-input { padding: 0.5rem 0.75rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.875rem; background: var(--color-background); color: var(--color-text); outline: none; }
    .form-input:focus { border-color: var(--color-secondary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-secondary) 20%, transparent); }
    .log-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .log-entry { display: flex; align-items: center; gap: 1rem; padding: 0.625rem; border-radius: var(--radius-md); background: var(--color-surface-alt); }
    .log-date { font-size: 0.8125rem; color: var(--color-text-muted); min-width: 120px; }
    .log-pages { font-size: 0.875rem; font-weight: 600; color: var(--color-text); min-width: 80px; }
    .log-notes { font-size: 0.8125rem; color: var(--color-text-secondary); flex: 1; }
    .log-total { font-size: 0.875rem; color: var(--color-text-secondary); margin: 0.75rem 0 0; }
    .empty-text { color: var(--color-text-muted); font-size: 0.875rem; margin: 0; }
    .mini-stats { display: flex; gap: 1.5rem; }
    .mini-stat { display: flex; flex-direction: column; align-items: center; }
    .mini-stat-value { font-size: 1.5rem; font-weight: 700; color: var(--color-text); }
    .mini-stat-label { font-size: 0.75rem; color: var(--color-text-muted); }
    .alert { padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.8125rem; }
    .alert-error { background: color-mix(in srgb, var(--color-danger) 10%, transparent); color: var(--color-danger); border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent); }
    .loading-state { text-align: center; color: var(--color-text-muted); padding: 3rem; }
    @media (max-width: 640px) { .book-header { flex-direction: column; align-items: center; text-align: center; } .book-details { justify-content: center; } }
  `]
})
export class BookDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private booksService = inject(BooksService);
  private readingService = inject(ReadingService);
  protected Math = Math;

  protected book = signal<Book>({} as Book);
  protected currentStatus = signal<ReadingStatus | null>(null);
  protected logs = signal<ReadingLog[]>([]);
  protected monthlyStats = signal({ totalSessions: 0, totalPages: 0, readingDays: 0 });
  protected loading = signal(true);
  protected error = signal('');

  protected logEntry = { pagesRead: 0, logDate: new Date().toISOString().slice(0, 10), notes: '' };

  protected statusOptions = [
    { value: 'want_to_read', label: 'Want to Read' },
    { value: 'currently_reading', label: 'Reading' },
    { value: 'finished', label: 'Finished' },
    { value: 'dnf', label: 'Did Not Finish' },
  ];

  async ngOnInit() {
    const id = +(this.route.snapshot.paramMap.get('id') || '0');
    if (!id) { this.error.set('Invalid book ID'); this.loading.set(false); return; }
    try {
      const book = await lastValueFrom(this.booksService.findOne(id));
      this.book.set(book);
      const [status, logs] = await Promise.all([
        lastValueFrom(this.readingService.getStatus(id)),
        lastValueFrom(this.readingService.getLogs(id)),
      ]);
      this.currentStatus.set(status);
      this.logs.set(logs);
      // Monthly stats for current month
      const now = new Date();
      const stats = await lastValueFrom(this.readingService.getMonthlyStats(now.getFullYear(), now.getMonth() + 1));
      this.monthlyStats.set(stats);
    } catch (err: any) {
      this.error.set(err?.error?.message || 'Failed to load book');
    } finally {
      this.loading.set(false);
    }
  }

  protected async setStatus(status: string) {
    try {
      if (this.currentStatus()) {
        const dto: any = { status };
        if (status === 'currently_reading') dto.startDate = new Date().toISOString();
        if (status === 'finished') { dto.status = 'finished'; dto.endDate = new Date().toISOString(); if (this.book().pages) dto.currentPage = this.book().pages; }
        const updated = await lastValueFrom(this.readingService.updateStatus(this.book().id, dto));
        this.currentStatus.set(updated);
      } else {
        const created = await lastValueFrom(this.readingService.createStatus({ bookId: this.book().id, status }));
        this.currentStatus.set(created);
      }
    } catch (err: any) {
      console.error('Failed to update status', err);
    }
  }

  protected async onLogReading() {
    if (!this.logEntry.pagesRead) return;
    try {
      const log = await lastValueFrom(this.readingService.createLog({
        bookId: this.book().id,
        pagesRead: this.logEntry.pagesRead,
        logDate: this.logEntry.logDate,
        notes: this.logEntry.notes || undefined,
      }));
      this.logs.update(list => [log, ...list]);
      this.logEntry = { pagesRead: 0, logDate: new Date().toISOString().slice(0, 10), notes: '' };
      // Update current page in reading status
      if (this.currentStatus() && this.currentStatus()?.status === 'currently_reading') {
        const currentPage = (this.currentStatus()?.currentPage || 0) + this.logEntry.pagesRead;
        const updated = await lastValueFrom(this.readingService.updateStatus(this.book().id, { currentPage } as any));
        this.currentStatus.set(updated);
      }
    } catch (err: any) {
      console.error('Failed to log reading', err);
    }
  }

  protected getCoverColor(title: string): string {
    const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B', '#10B981', '#3B82F6', '#0EA5E9'];
    let hash = 0;
    for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  protected getInitials(title: string): string {
    return title.split(' ').slice(0, 2).map(w => w[0]).join('');
  }

  protected getStatusBtnStyle(value: string): any {
    const colors: Record<string, string> = {
      want_to_read: '#8B5CF6',
      currently_reading: '#3B82F6',
      finished: '#10B981',
      dnf: '#EF4444',
    };
    const color = colors[value] || '#64748B';
    return this.currentStatus()?.status === value
      ? { background: color, borderColor: color, color: 'white' }
      : {};
  }
}
