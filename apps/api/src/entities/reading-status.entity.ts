import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

export type ReadingStatusValue = 'want_to_read' | 'currently_reading' | 'finished' | 'dnf';

@Entity('reading_statuses')
export class ReadingStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', type: 'integer' })
  userId: number;

  @Column({ name: 'bookId', type: 'integer' })
  bookId: number;

  @Column({ type: 'varchar', default: 'want_to_read' })
  status: ReadingStatusValue;

  @Column({ name: 'startDate', type: 'datetime', nullable: true })
  startDate?: Date;

  @Column({ name: 'endDate', type: 'datetime', nullable: true })
  endDate?: Date;

  @Column({ name: 'currentPage', type: 'integer', default: 0 })
  currentPage: number;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, (book: Book) => book.id)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', nullable: true })
  updatedAt?: Date;
}
