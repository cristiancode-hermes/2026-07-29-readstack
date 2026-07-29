import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingGoal } from '../entities/reading-goal.entity';
import { CreateReadingGoalDto } from './dto/reading-goal.dto';

@Injectable()
export class ReadingGoalService {
  constructor(
    @InjectRepository(ReadingGoal)
    private repo: Repository<ReadingGoal>,
  ) {}

  async findByYear(userId: number, year: number): Promise<ReadingGoal | null> {
    return this.repo.findOne({ where: { userId, year } });
  }

  async upsert(userId: number, dto: CreateReadingGoalDto): Promise<ReadingGoal> {
    const existing = await this.repo.findOne({ where: { userId, year: dto.year } });
    if (existing) {
      existing.targetBooks = dto.targetBooks;
      return this.repo.save(existing) as unknown as ReadingGoal;
    }
    const goal = this.repo.create({ userId, ...dto } as any);
    return this.repo.save(goal) as unknown as ReadingGoal;
  }

  async remove(userId: number, year: number): Promise<void> {
    const goal = await this.repo.findOne({ where: { userId, year } });
    if (!goal) throw new NotFoundException('Goal not found');
    await this.repo.remove(goal);
  }
}
