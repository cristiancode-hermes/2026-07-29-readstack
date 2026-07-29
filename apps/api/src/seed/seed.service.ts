import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Book } from '../entities/book.entity';
import { ReadingStatus } from '../entities/reading-status.entity';
import { ReadingLog } from '../entities/reading-log.entity';
import { ReadingGoal } from '../entities/reading-goal.entity';
import { Review } from '../entities/review.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Book) private booksRepo: Repository<Book>,
    @InjectRepository(ReadingStatus) private statusRepo: Repository<ReadingStatus>,
    @InjectRepository(ReadingLog) private logRepo: Repository<ReadingLog>,
    @InjectRepository(ReadingGoal) private goalRepo: Repository<ReadingGoal>,
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
  ) {}

  async onModuleInit() {
    if (!this.configService.get<string>('SEED_DB')) return;
    await this.seed();
  }

  async seed() {
    const existing = await this.usersRepo.findOne({ where: { email: 'demo@readstack.dev' } });
    if (existing) return;

    const hash = await bcrypt.hash('demo1234', 10);
    const user = this.usersRepo.create({ email: 'demo@readstack.dev', name: 'Demo Reader', passwordHash: hash } as any);
    const savedUser = await this.usersRepo.save(user) as unknown as User;

    const books = [
      { title: 'Dune', author: 'Frank Herbert', pages: 688, genre: 'Science Fiction', description: 'Set on the desert planet Arrakis, Dune is the story of Paul Atreides, a young nobleman thrust into a political and religious conflict over the universe\'s most valuable substance—spice melange.', addedBy: savedUser.id },
      { title: '1984', author: 'George Orwell', pages: 328, genre: 'Dystopian', description: 'A dystopian novel set in a totalitarian society ruled by Big Brother.', addedBy: savedUser.id },
      { title: 'Pride and Prejudice', author: 'Jane Austen', pages: 432, genre: 'Classic', description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet.', addedBy: savedUser.id },
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: 310, genre: 'Fantasy', description: 'Bilbo Baggins embarks on an unexpected journey with a company of dwarves.', addedBy: savedUser.id },
      { title: 'Sapiens', author: 'Yuval Noah Harari', pages: 464, genre: 'Non-Fiction', description: 'A brief history of humankind from the Stone Age to the modern age.', addedBy: savedUser.id },
      { title: 'Atomic Habits', author: 'James Clear', pages: 320, genre: 'Self-Help', description: 'An easy and proven way to build good habits and break bad ones.', addedBy: savedUser.id },
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', pages: 180, genre: 'Classic', description: 'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.', addedBy: savedUser.id },
      { title: 'Neuromancer', author: 'William Gibson', pages: 271, genre: 'Science Fiction', description: 'The novel that launched the cyberpunk genre.', addedBy: savedUser.id },
    ];

    for (const b of books) {
      const book = this.booksRepo.create(b as any);
      await this.booksRepo.save(book) as unknown as Book;
    }

    const allBooks = await this.booksRepo.find();

    // Add reading statuses
    const statuses = [
      { userId: savedUser.id, bookId: allBooks[0].id, status: 'currently_reading' as const, currentPage: 200, startDate: new Date('2026-07-15') },
      { userId: savedUser.id, bookId: allBooks[1].id, status: 'finished' as const, currentPage: 328, endDate: new Date('2026-07-10') },
      { userId: savedUser.id, bookId: allBooks[2].id, status: 'want_to_read' as const, currentPage: 0 },
      { userId: savedUser.id, bookId: allBooks[3].id, status: 'finished' as const, currentPage: 310, endDate: new Date('2026-06-20') },
      { userId: savedUser.id, bookId: allBooks[5].id, status: 'currently_reading' as const, currentPage: 100, startDate: new Date('2026-07-20') },
      { userId: savedUser.id, bookId: allBooks[6].id, status: 'dnf' as const, currentPage: 50 },
    ];

    for (const s of statuses) {
      const status = this.statusRepo.create(s as any);
      await this.statusRepo.save(status) as unknown as ReadingStatus;
    }

    // Reading logs
    const logs = [
      { userId: savedUser.id, bookId: allBooks[0].id, pagesRead: 50, notes: 'Great world-building!', logDate: new Date('2026-07-20') },
      { userId: savedUser.id, bookId: allBooks[0].id, pagesRead: 60, notes: 'The politics are fascinating', logDate: new Date('2026-07-21') },
      { userId: savedUser.id, bookId: allBooks[0].id, pagesRead: 45, logDate: new Date('2026-07-22') },
      { userId: savedUser.id, bookId: allBooks[1].id, pagesRead: 80, notes: 'Finished this classic', logDate: new Date('2026-07-10') },
      { userId: savedUser.id, bookId: allBooks[5].id, pagesRead: 30, notes: 'Starting the habit stacking chapter', logDate: new Date('2026-07-25') },
      { userId: savedUser.id, bookId: allBooks[3].id, pagesRead: 100, notes: 'The riddles in the dark chapter is amazing', logDate: new Date('2026-06-15') },
    ];

    for (const l of logs) {
      const log = this.logRepo.create(l as any);
      await this.logRepo.save(log) as unknown as ReadingLog;
    }

    // Reading goal
    const goal = this.goalRepo.create({ userId: savedUser.id, year: 2026, targetBooks: 24 } as any);
    await this.goalRepo.save(goal) as unknown as ReadingGoal;

    // Reviews
    const reviews = [
      { userId: savedUser.id, bookId: allBooks[1].id, rating: 5, review: 'A timeless masterpiece that gets more relevant every year.' },
      { userId: savedUser.id, bookId: allBooks[3].id, rating: 4, review: 'A wonderful adventure story for all ages.' },
    ];

    for (const r of reviews) {
      const review = this.reviewRepo.create(r as any);
      await this.reviewRepo.save(review) as unknown as Review;
    }

    console.log('✅ Seed data created successfully');
  }
}
