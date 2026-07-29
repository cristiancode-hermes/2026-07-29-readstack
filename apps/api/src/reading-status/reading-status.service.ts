import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingStatus, ReadingStatusValue } from '../entities/reading-status.entity';
import { CreateReadingStatusDto, UpdateReadingStatusDto } from './dto/reading-status.dto';

const VALID_STATUSES: ReadingStatusValue[] = ['want_to_read', 'currently_reading', 'finished', 'dnf'];

@Injectable()
export class ReadingStatusService {
  constructor(
    @InjectRepository(ReadingStatus)
    private repo: Repository<ReadingStatus>,
  ) {}

  async findAll(userId: number): Promise<ReadingStatus[]> {
    return this.repo.find({
      where: { userId },
      relations: { book: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByBook(userId: number, bookId: number): Promise<ReadingStatus | null> {
    return this.repo.findOne({ where: { userId, bookId }, relations: { book: true } });
  }

  async create(userId: number, dto: CreateReadingStatusDto): Promise<ReadingStatus> {
    if (!VALID_STATUSES.includes(dto.status as ReadingStatusValue)) {
      throw new BadRequestException(`Invalid status: ${dto.status}`);
    }
    const existing = await this.repo.findOne({ where: { userId, bookId: dto.bookId } });
    if (existing) {
      throw new BadRequestException('Reading status already exists for this book');
    }
    const status = this.repo.create({ userId, ...dto } as any);
    return this.repo.save(status) as unknown as ReadingStatus;
  }

  async update(userId: number, bookId: number, dto: UpdateReadingStatusDto): Promise<ReadingStatus> {
    const status = await this.repo.findOne({ where: { userId, bookId } });
    if (!status) throw new NotFoundException('Reading status not found');
    if (dto.status && !VALID_STATUSES.includes(dto.status as ReadingStatusValue)) {
      throw new BadRequestException(`Invalid status: ${dto.status}`);
    }
    if (dto.startDate) (dto as any).startDate = new Date(dto.startDate);
    if (dto.endDate) (dto as any).endDate = new Date(dto.endDate);
    Object.assign(status, dto);
    return this.repo.save(status) as unknown as ReadingStatus;
  }

  async remove(userId: number, bookId: number): Promise<void> {
    const status = await this.repo.findOne({ where: { userId, bookId } });
    if (!status) throw new NotFoundException('Reading status not found');
    await this.repo.remove(status);
  }
}
