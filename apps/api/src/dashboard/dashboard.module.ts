import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ReadingStatus } from '../entities/reading-status.entity';
import { ReadingLog } from '../entities/reading-log.entity';
import { ReadingGoal } from '../entities/reading-goal.entity';
import { Book } from '../entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReadingStatus, ReadingLog, ReadingGoal, Book])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
