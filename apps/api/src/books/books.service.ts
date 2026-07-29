import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto, UpdateBookDto } from './dto/books.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepo: Repository<Book>,
  ) {}

  async findAll(userId: number, search?: string): Promise<Book[]> {
    const where: FindOptionsWhere<Book> = {};
    if (search) {
      where.title = ILike(`%${search}%`);
    }
    return this.booksRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepo.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async create(userId: number, dto: CreateBookDto): Promise<Book> {
    const book = this.booksRepo.create({ ...dto, addedBy: userId } as any);
    return this.booksRepo.save(book) as unknown as Book;
  }

  async update(id: number, dto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, dto);
    return this.booksRepo.save(book) as unknown as Book;
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepo.remove(book);
  }
}
