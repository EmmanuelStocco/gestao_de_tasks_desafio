import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User]),
    RabbitMQModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService],
})
export class NotificationsModule {}
