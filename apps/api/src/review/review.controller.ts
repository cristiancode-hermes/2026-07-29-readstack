import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('api/reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private service: ReviewService) {}

  @Get(':bookId')
  findByBook(@Param('bookId') bookId: string) {
    return this.service.findByBook(+bookId);
  }

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreateReviewDto) {
    return this.service.create(userId, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('id') userId: number, @Param('id') id: string) {
    return this.service.remove(userId, +id);
  }
}
