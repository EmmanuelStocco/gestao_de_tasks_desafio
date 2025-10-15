import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['task:created', 'task:updated', 'comment:new'],
  })
  type: 'task:created' | 'task:updated' | 'comment:new';

  @Column()
  message: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  taskId: string;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
