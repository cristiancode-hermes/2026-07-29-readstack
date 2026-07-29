export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  coverUrl?: string;
  pages?: number;
  genre?: string;
  description?: string;
  addedBy: number;
  createdAt: string;
}

export interface ReadingStatus {
  id: number;
  userId: number;
  bookId: number;
  status: 'want_to_read' | 'currently_reading' | 'finished' | 'dnf';
  currentPage: number;
  startDate?: string;
  endDate?: string;
  book: Book;
}

export interface ReadingLog {
  id: number;
  userId: number;
  bookId: number;
  pagesRead: number;
  notes?: string;
  logDate: string;
}

export interface ReadingGoal {
  id: number;
  userId: number;
  year: number;
  targetBooks: number;
}

export interface Review {
  id: number;
  userId: number;
  bookId: number;
  rating: number;
  review?: string;
  user: { id: number; name: string };
}

export interface DashboardStats {
  totalBooks: number;
  finishedBooks: number;
  currentlyReading: number;
  wantToRead: number;
  totalPagesRead: number;
  totalSessions: number;
  goalProgress: number | null;
  monthlyPages: { month: string; pages: number }[];
  genreBreakdown: Record<string, number>;
}
