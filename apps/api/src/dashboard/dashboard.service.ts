import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingStatus } from '../entities/reading-status.entity';
import { ReadingLog } from '../entities/reading-log.entity';
import { ReadingGoal } from '../entities/reading-goal.entity';
import { Book } from '../entities/book.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ReadingStatus)
    private statusRepo: Repository<ReadingStatus>,
    @InjectRepository(ReadingLog)
    private logRepo: Repository<ReadingLog>,
    @InjectRepository(ReadingGoal)
    private goalRepo: Repository<ReadingGoal>,
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  async getStats(userId: number) {
    const statuses = await this.statusRepo.find({ where: { userId } });
    const finished = statuses.filter(s => s.status === 'finished').length;
    const reading = statuses.filter(s => s.status === 'currently_reading').length;
    const wantToRead = statuses.filter(s => s.status === 'want_to_read').length;

    const logs = await this.logRepo.find({ where: { userId } });
    const totalPages = logs.reduce((sum, l) => sum + l.pagesRead, 0);
    const totalSessions = logs.length;

    const booksCount = await this.bookRepo.count();

    // Current year goal progress
    const year = new Date().getFullYear();
    const goal = await this.goalRepo.findOne({ where: { userId, year } });
    const goalProgress = goal ? (finished / goal.targetBooks) * 100 : null;

    // Monthly reading (last 6 months)
    const monthlyPages: { month: string; pages: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0, 23, 59, 59);
      const monthLogs = logs.filter(l => l.logDate >= start && l.logDate <= end);
      const pages = monthLogs.reduce((sum, l) => sum + l.pagesRead, 0);
      monthlyPages.push({
        month: `${y}-${String(m).padStart(2, '0')}`,
        pages,
      });
    }

    // Genre breakdown
    const books = await this.bookRepo.find();
    const genreMap: Record<string, number> = {};
    for (const b of books) {
      if (b.genre) {
        genreMap[b.genre] = (genreMap[b.genre] || 0) + 1;
      }
    }

    return {
      totalBooks: booksCount,
      finishedBooks: finished,
      currentlyReading: reading,
      wantToRead,
      totalPagesRead: totalPages,
      totalSessions,
      goalProgress,
      monthlyPages,
      genreBreakdown: genreMap,
    };
  }
}
