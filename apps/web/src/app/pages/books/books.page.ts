import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { BooksService } from '../../services/books.service';
import { ReadingService } from '../../services/reading.service';
import { Book } from '../../interfaces';
@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Books</h1>
        <p class="page-subtitle">Your reading library</p>
      </div>
      <button class="btn btn-primary" (click)="showAddForm.set(true)">+ Add Book</button>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <input type="text" class="search-input" placeholder="Search books..." [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" />
    </div>

    @if (loading()) {
      <div class="loading-grid">
        @for (item of [].constructor(6); track $index) {
          <div class="card skeleton-card"><div class="skeleton skeleton-h2"></div><div class="skeleton skeleton-p"></div></div>
        }
      </div>
    } @else if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    } @else if (books().length === 0) {
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        <h3>No books yet</h3>
        <p>Add your first book to start tracking your reading.</p>
        <button class="btn btn-primary" (click)="showAddForm.set(true)">+ Add Book</button>
      </div>
    } @else {
      <div class="books-grid">
        @for (book of books(); track book.id) {
          <a [routerLink]="['/books', book.id]" class="book-card">
            <div class="book-cover" [style.background]="getCoverColor(book.title)">
              <span class="book-initials">{{ getInitials(book.title) }}</span>
            </div>
            <div class="book-info">
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">{{ book.author }}</p>
              @if (book.genre) {
                <span class="badge">{{ book.genre }}</span>
              }
            </div>
          </a>
        }
      </div>
    }

    <!-- Add Book Modal -->
    @if (showAddForm()) {
      <div class="modal-overlay" (click)="showAddForm.set(false)">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Add New Book</h2>
            <button class="modal-close" (click)="showAddForm.set(false)">&times;</button>
          </div>
          <form (ngSubmit)="onAddBook()" class="modal-body">
            @if (formError()) { <div class="alert alert-error">{{ formError() }}</div> }
            <div class="form-group">
              <label class="form-label">Title *</label>
              <input type="text" class="form-input" [(ngModel)]="newBook.title" name="title" required />
            </div>
            <div class="form-group">
              <label class="form-label">Author *</label>
              <input type="text" class="form-input" [(ngModel)]="newBook.author" name="author" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Pages</label>
                <input type="number" class="form-input" [(ngModel)]="newBook.pages" name="pages" />
              </div>
              <div class="form-group">
                <label class="form-label">Genre</label>
                <input type="text" class="form-input" [(ngModel)]="newBook.genre" name="genre" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea class="form-input form-textarea" [(ngModel)]="newBook.description" name="description" rows="3"></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-ghost" (click)="showAddForm.set(false)">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving()">{{ saving() ? 'Saving...' : 'Add Book' }}</button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .page-subtitle { color: var(--color-text-secondary); font-size: 0.875rem; margin: 0.25rem 0 0; }
    .search-bar { margin-bottom: 1.25rem; }
    .search-input { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.875rem; background: var(--color-surface); color: var(--color-text); outline: none; }
    .search-input:focus { border-color: var(--color-secondary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-secondary) 20%, transparent); }
    .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
    .book-card { display: flex; gap: 1rem; padding: 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); text-decoration: none; transition: all 0.15s ease; }
    .book-card:hover { border-color: var(--color-secondary); box-shadow: var(--shadow-md); }
    .book-cover { width: 64px; height: 88px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .book-initials { font-size: 0.75rem; font-weight: 700; color: white; text-transform: uppercase; }
    .book-info { flex: 1; min-width: 0; }
    .book-title { font-size: 0.9375rem; font-weight: 600; color: var(--color-text); margin: 0 0 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .book-author { font-size: 0.8125rem; color: var(--color-text-secondary); margin: 0 0 0.5rem; }
    .badge { display: inline-block; padding: 0.125rem 0.5rem; font-size: 0.6875rem; font-weight: 500; border-radius: var(--radius-full); background: color-mix(in srgb, var(--color-info) 12%, transparent); color: var(--color-info); }
    .loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
    .skeleton-card { height: 120px; }
    .skeleton { background: var(--color-border); border-radius: 4px; animation: pulse 1.5s ease-in-out infinite; }
    .skeleton-h2 { height: 16px; width: 70%; margin-bottom: 0.5rem; }
    .skeleton-p { height: 12px; width: 50%; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; text-align: center; }
    .empty-state h3 { margin: 1rem 0 0.5rem; color: var(--color-text); }
    .empty-state p { color: var(--color-text-muted); font-size: 0.875rem; margin: 0 0 1.5rem; }
    .alert { padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.8125rem; margin-bottom: 1rem; }
    .alert-error { background: color-mix(in srgb, var(--color-danger) 10%, transparent); color: var(--color-danger); border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent); }
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.625rem 1.25rem; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s ease; }
    .btn-primary { background: var(--color-primary); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--color-primary-light); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-ghost { background: transparent; color: var(--color-text-secondary); border: 1px solid var(--color-border); }
    .btn-ghost:hover { background: var(--color-surface-alt); }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
    .modal { background: var(--color-surface); border-radius: var(--radius-lg); width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-xl); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.25rem 0; }
    .modal-title { font-size: 1.125rem; font-weight: 700; margin: 0; }
    .modal-close { background: none; border: none; font-size: 1.5rem; color: var(--color-text-muted); cursor: pointer; padding: 0; line-height: 1; }
    .modal-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-text); }
    .form-input { padding: 0.5rem 0.75rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.875rem; background: var(--color-background); color: var(--color-text); outline: none; }
    .form-input:focus { border-color: var(--color-secondary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-secondary) 20%, transparent); }
    .form-textarea { resize: vertical; min-height: 60px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; padding-top: 0.5rem; }
  `]
})
export class BooksPageComponent implements OnInit {
  private booksService = inject(BooksService);
  private router = inject(Router);

  protected books = signal<Book[]>([]);
  protected loading = signal(true);
  protected error = signal('');
  protected searchQuery = signal('');
  protected showAddForm = signal(false);
  protected saving = signal(false);
  protected formError = signal('');

  protected newBook = { title: '', author: '', pages: undefined as number | undefined, genre: '', description: '' };
  private searchTimeout: any;

  async ngOnInit() {
    await this.loadBooks();
  }

  protected async loadBooks() {
    this.loading.set(true);
    this.error.set('');
    try {
      const books = await lastValueFrom(this.booksService.findAll(this.searchQuery() || undefined));
      this.books.set(books);
    } catch (err: any) {
      this.error.set(err?.error?.message || 'Failed to load books');
    } finally {
      this.loading.set(false);
    }
  }

  protected onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadBooks(), 300);
  }

  protected async onAddBook() {
    if (!this.newBook.title || !this.newBook.author) {
      this.formError.set('Title and author are required');
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    try {
      await lastValueFrom(this.booksService.create(this.newBook as any));
      this.showAddForm.set(false);
      this.newBook = { title: '', author: '', pages: undefined, genre: '', description: '' };
      await this.loadBooks();
    } catch (err: any) {
      this.formError.set(err?.error?.message || 'Failed to add book');
    } finally {
      this.saving.set(false);
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
}
