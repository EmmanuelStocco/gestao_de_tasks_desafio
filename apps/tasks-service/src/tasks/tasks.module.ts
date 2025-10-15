import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Comment, User]),
    RabbitMQModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
