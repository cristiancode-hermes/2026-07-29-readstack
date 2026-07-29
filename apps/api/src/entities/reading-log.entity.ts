import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity('reading_logs')
export class ReadingLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', type: 'integer' })
  userId: number;

  @Column({ name: 'bookId', type: 'integer' })
  bookId: number;

  @Column({ name: 'pagesRead', type: 'integer', default: 0 })
  pagesRead: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'logDate', type: 'datetime' })
  logDate: Date;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, (book: Book) => book.id)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt!: Date;
}
