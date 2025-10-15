import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsGateway } from './notifications/notifications.gateway';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 10, // 10 requests per minute
    }]),
    AuthModule,
    TasksModule,
    NotificationsModule,
  ],
  providers: [NotificationsGateway],
})
export class AppModule {}
