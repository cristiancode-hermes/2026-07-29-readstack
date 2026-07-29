import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../entities/user.entity';
import { Book } from '../entities/book.entity';
import { ReadingStatus } from '../entities/reading-status.entity';
import { ReadingLog } from '../entities/reading-log.entity';
import { ReadingGoal } from '../entities/reading-goal.entity';
import { Review } from '../entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Book, ReadingStatus, ReadingLog, ReadingGoal, Review])],
  providers: [SeedService],
})
export class SeedModule {}
