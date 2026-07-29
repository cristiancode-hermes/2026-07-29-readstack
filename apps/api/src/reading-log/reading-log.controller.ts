import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReadingLogService } from './reading-log.service';
import { CreateReadingLogDto } from './dto/reading-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('api/reading-log')
@UseGuards(JwtAuthGuard)
export class ReadingLogController {
  constructor(private service: ReadingLogService) {}

  @Get(':bookId')
  findByBook(@CurrentUser('id') userId: number, @Param('bookId') bookId: string) {
    return this.service.findByBook(userId, +bookId);
  }

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreateReadingLogDto) {
    return this.service.create(userId, dto);
  }

  @Get('stats/monthly')
  monthlyStats(
    @CurrentUser('id') userId: number,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.service.getMonthlyStats(userId, +year || new Date().getFullYear(), +month || new Date().getMonth() + 1);
  }
}
