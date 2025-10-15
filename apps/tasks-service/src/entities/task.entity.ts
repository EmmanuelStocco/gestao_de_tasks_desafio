import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany, ManyToOne, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { TaskPriority, TaskStatus } from '@gestao-tarefas/types';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  deadline: Date;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @ManyToMany(() => User)
  @JoinTable()
  assignedUsers: User[];

  @OneToMany(() => Comment, comment => comment.task)
  comments: Comment[];

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
