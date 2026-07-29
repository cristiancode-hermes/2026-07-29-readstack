import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingLogController } from './reading-log.controller';
import { ReadingLogService } from './reading-log.service';
import { ReadingLog } from '../entities/reading-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReadingLog])],
  controllers: [ReadingLogController],
  providers: [ReadingLogService],
  exports: [ReadingLogService],
})
export class ReadingLogModule {}
