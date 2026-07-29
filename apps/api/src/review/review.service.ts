import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private repo: Repository<Review>,
  ) {}

  async findByBook(bookId: number): Promise<Review[]> {
    return this.repo.find({
      where: { bookId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: number, dto: CreateReviewDto): Promise<Review> {
    const review = this.repo.create({ userId, ...dto } as any);
    return this.repo.save(review) as unknown as Review;
  }

  async remove(userId: number, id: number): Promise<void> {
    const review = await this.repo.findOne({ where: { id, userId } });
    if (!review) throw new NotFoundException('Review not found');
    await this.repo.remove(review);
  }
}
