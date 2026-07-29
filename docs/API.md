# ReadStack API

## Base URL

`http://localhost:3001/api`

## Authentication

All endpoints except `/api/auth/register` and `/api/auth/login` require JWT Bearer token.

```
Authorization: Bearer <token>
```

### `POST /api/auth/register`
Register a new user.

```json
{ "email": "user@example.com", "name": "User Name", "password": "password123" }
```

**Response 201:**
```json
{ "access_token": "jwt...", "user": { "id": 1, "email": "...", "name": "..." } }
```

### `POST /api/auth/login`
Authenticate existing user.

```json
{ "email": "user@example.com", "password": "password123" }
```

**Response 200:**
```json
{ "access_token": "jwt...", "user": { "id": 1, "email": "...", "name": "..." } }
```

### `GET /api/auth/me`
Get current user profile.

## Books

### `GET /api/books`
List all books. Optional `?search=` query param.

### `GET /api/books/:id`
Get single book details.

### `POST /api/books`
Create a new book.

```json
{ "title": "Dune", "author": "Frank Herbert", "pages": 688, "genre": "Science Fiction", "description": "..." }
```

### `PUT /api/books/:id`
Update a book (partial update supported).

### `DELETE /api/books/:id`
Delete a book.

## Reading Status

### `GET /api/reading-status`
Get all reading statuses for current user (with book relations).

### `GET /api/reading-status/:bookId`
Get reading status for a specific book.

### `POST /api/reading-status`
Set reading status for a book.

```json
{ "bookId": 1, "status": "currently_reading" }
```

**Status values:** `want_to_read`, `currently_reading`, `finished`, `dnf`

### `PUT /api/reading-status/:bookId`
Update reading status.

```json
{ "status": "finished", "currentPage": 688, "endDate": "2026-07-29T00:00:00.000Z" }
```

### `DELETE /api/reading-status/:bookId`
Remove reading status.

## Reading Log

### `GET /api/reading-log/:bookId`
Get all reading logs for a book.

### `POST /api/reading-log`
Log a reading session.

```json
{ "bookId": 1, "pagesRead": 50, "notes": "Great chapter!", "logDate": "2026-07-29" }
```

### `GET /api/reading-log/stats/monthly?year=2026&month=7`
Get monthly reading stats.

## Reading Goals

### `GET /api/reading-goals/:year`
Get reading goal for a specific year.

### `POST /api/reading-goals`
Create or update a reading goal.

```json
{ "year": 2026, "targetBooks": 24 }
```

### `DELETE /api/reading-goals/:year`
Remove reading goal.

## Reviews

### `GET /api/reviews/:bookId`
Get all reviews for a book.

### `POST /api/reviews`
Create a review.

```json
{ "bookId": 1, "rating": 5, "review": "Amazing book!" }
```

### `DELETE /api/reviews/:id`
Delete a review.

## Dashboard

### `GET /api/dashboard`
Get aggregated dashboard stats.

```json
{
  "totalBooks": 8,
  "finishedBooks": 2,
  "currentlyReading": 2,
  "wantToRead": 1,
  "totalPagesRead": 365,
  "totalSessions": 6,
  "goalProgress": 8.3,
  "monthlyPages": [
    { "month": "2026-02", "pages": 0 },
    ...
    { "month": "2026-07", "pages": 185 }
  ],
  "genreBreakdown": {
    "Science Fiction": 2,
    "Classic": 2,
    ...
  }
}
```
