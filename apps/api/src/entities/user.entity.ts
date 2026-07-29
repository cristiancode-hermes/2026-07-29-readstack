import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  OneToMany
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', nullable: true })
  updatedAt?: Date;
}
