import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './entities/notification.entity';
import { User } from './entities/user.entity';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Notification, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Notification, User]),
    RabbitMQModule,
    NotificationsModule,
  ],
})
export class AppModule {}
