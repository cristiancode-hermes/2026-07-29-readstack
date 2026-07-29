import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReadingStatusService } from './reading-status.service';
import { CreateReadingStatusDto, UpdateReadingStatusDto } from './dto/reading-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('api/reading-status')
@UseGuards(JwtAuthGuard)
export class ReadingStatusController {
  constructor(private service: ReadingStatusService) {}

  @Get()
  findAll(@CurrentUser('id') userId: number) {
    return this.service.findAll(userId);
  }

  @Get(':bookId')
  findByBook(@CurrentUser('id') userId: number, @Param('bookId') bookId: string) {
    return this.service.findByBook(userId, +bookId);
  }

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreateReadingStatusDto) {
    return this.service.create(userId, dto);
  }

  @Put(':bookId')
  update(@CurrentUser('id') userId: number, @Param('bookId') bookId: string, @Body() dto: UpdateReadingStatusDto) {
    return this.service.update(userId, +bookId, dto);
  }

  @Delete(':bookId')
  remove(@CurrentUser('id') userId: number, @Param('bookId') bookId: string) {
    return this.service.remove(userId, +bookId);
  }
}
