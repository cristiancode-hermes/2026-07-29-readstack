import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ReadingGoalService } from './reading-goal.service';
import { CreateReadingGoalDto } from './dto/reading-goal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('api/reading-goals')
@UseGuards(JwtAuthGuard)
export class ReadingGoalController {
  constructor(private service: ReadingGoalService) {}

  @Get(':year')
  findByYear(@CurrentUser('id') userId: number, @Param('year') year: string) {
    return this.service.findByYear(userId, +year);
  }

  @Post()
  upsert(@CurrentUser('id') userId: number, @Body() dto: CreateReadingGoalDto) {
    return this.service.upsert(userId, dto);
  }

  @Delete(':year')
  remove(@CurrentUser('id') userId: number, @Param('year') year: string) {
    return this.service.remove(userId, +year);
  }
}
