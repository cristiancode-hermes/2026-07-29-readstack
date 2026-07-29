import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingGoalController } from './reading-goal.controller';
import { ReadingGoalService } from './reading-goal.service';
import { ReadingGoal } from '../entities/reading-goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReadingGoal])],
  controllers: [ReadingGoalController],
  providers: [ReadingGoalService],
  exports: [ReadingGoalService],
})
export class ReadingGoalModule {}
