import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './entities/task.entity';
import { Comment } from './entities/comment.entity';
import { User } from './entities/user.entity';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Task, Comment, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task, Comment, User]),
    RabbitMQModule,
    TasksModule,
  ],
})
export class AppModule {}
