import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { RabbitMQEvent } from '@gestao-tarefas/types';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rabbitMQService: RabbitMQService,
  ) {}

  onModuleInit() {
    this.rabbitMQService.setNotificationsService(this);
  }

  async createNotification(
    type: 'task:created' | 'task:updated' | 'comment:new',
    message: string,
    userId: string,
    taskId?: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      type,
      message,
      userId,
      taskId,
    });

    return this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: string, page: number = 1, size: number = 10) {
    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      data: notifications,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id: notificationId, userId },
      { read: true }
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, read: false },
      { read: true }
    );
  }

  async handleRabbitMQEvent(event: RabbitMQEvent): Promise<void> {
    let message = '';
    let taskId = '';

    switch (event.type) {
      case 'task.created':
        message = `New task has been created and assigned to you`;
        taskId = event.taskId;
        break;
      case 'task.updated':
        message = `A task you're assigned to has been updated`;
        taskId = event.taskId;
        break;
      case 'task.comment.created':
        message = `New comment added to a task you're assigned to`;
        taskId = event.taskId;
        break;
    }

    // Create notifications for all assigned users
    for (const userId of event.assignedUserIds) {
      await this.createNotification(
        event.type.replace('.', ':') as 'task:created' | 'task:updated' | 'comment:new',
        message,
        userId,
        taskId,
      );
    }
  }
}
