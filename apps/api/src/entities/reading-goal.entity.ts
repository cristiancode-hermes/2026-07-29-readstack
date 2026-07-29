import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity('reading_goals')
export class ReadingGoal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', type: 'integer' })
  userId: number;

  @Column({ type: 'integer' })
  year: number;

  @Column({ name: 'targetBooks', type: 'integer', default: 12 })
  targetBooks: number;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt!: Date;
}
