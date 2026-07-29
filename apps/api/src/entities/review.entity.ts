import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', type: 'integer' })
  userId: number;

  @Column({ name: 'bookId', type: 'integer' })
  bookId: number;

  @Column({ type: 'integer' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review?: string;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, (book: Book) => book.id)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt!: Date;
}
