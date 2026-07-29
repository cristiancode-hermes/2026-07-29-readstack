import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  coverUrl?: string;

  @Column({ nullable: true })
  pages?: number;

  @Column({ nullable: true })
  genre?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'addedBy', type: 'integer' })
  addedBy: number;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', nullable: true })
  updatedAt?: Date;
}
