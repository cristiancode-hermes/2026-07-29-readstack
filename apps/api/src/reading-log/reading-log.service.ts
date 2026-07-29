import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ReadingLog } from '../entities/reading-log.entity';
import { CreateReadingLogDto } from './dto/reading-log.dto';

@Injectable()
export class ReadingLogService {
  constructor(
    @InjectRepository(ReadingLog)
    private repo: Repository<ReadingLog>,
  ) {}

  async findByBook(userId: number, bookId: number): Promise<ReadingLog[]> {
    return this.repo.find({
      where: { userId, bookId },
      order: { logDate: 'DESC' },
    });
  }

  async create(userId: number, dto: CreateReadingLogDto): Promise<ReadingLog> {
    const log = this.repo.create({
      userId,
      bookId: dto.bookId,
      pagesRead: dto.pagesRead,
      notes: dto.notes,
      logDate: dto.logDate ? new Date(dto.logDate) : new Date(),
    } as any);
    return this.repo.save(log) as unknown as ReadingLog;
  }

  async getMonthlyStats(userId: number, year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    const logs = await this.repo.find({
      where: { userId, logDate: Between(start, end) },
    });
    const totalPages = logs.reduce((sum, l) => sum + l.pagesRead, 0);
    const readingDays = new Set(logs.map(l => l.logDate.toISOString().slice(0, 10))).size;
    return { totalPages, totalSessions: logs.length, readingDays };
  }
}
