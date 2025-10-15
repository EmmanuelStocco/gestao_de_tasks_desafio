import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task, Comment, User } from '../entities';
import { CreateTaskDto, UpdateTaskDto, CreateCommentDto, TaskPriority, TaskStatus, PaginatedResponse } from '@gestao-tarefas/types';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rabbitMQService: RabbitMQService,
  ) {}

  async create(createTaskDto: CreateTaskDto, createdById: string): Promise<Task> {
    const { assignedUserIds, ...taskData } = createTaskDto;

    // Find assigned users
    const assignedUsers = assignedUserIds.length > 0 
      ? await this.userRepository.findBy({ id: In(assignedUserIds) })
      : [];

    // Find creator
    const createdBy = await this.userRepository.findOne({ where: { id: createdById } });
    if (!createdBy) {
      throw new NotFoundException('Creator not found');
    }

    // Create task
    const task = this.taskRepository.create({
      ...taskData,
      assignedUsers,
      createdBy,
    });

    const savedTask = await this.taskRepository.save(task);

    // Publish event
    await this.rabbitMQService.publishEvent({
      type: 'task.created',
      taskId: savedTask.id,
      assignedUserIds: assignedUsers.map(u => u.id),
      createdBy: createdById,
    });

    return this.taskRepository.findOne({
      where: { id: savedTask.id },
      relations: ['assignedUsers', 'createdBy', 'comments'],
    });
  }

  async findAll(page: number = 1, size: number = 10): Promise<PaginatedResponse<Task>> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      relations: ['assignedUsers', 'createdBy', 'comments'],
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });

    return {
      data: tasks,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignedUsers', 'createdBy', 'comments', 'comments.author'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, updatedById: string): Promise<Task> {
    const task = await this.findOne(id);
    const { assignedUserIds, ...taskData } = updateTaskDto;

    // Update assigned users if provided
    if (assignedUserIds) {
      const assignedUsers = assignedUserIds.length > 0 
        ? await this.userRepository.findBy({ id: In(assignedUserIds) })
        : [];
      task.assignedUsers = assignedUsers;
    }

    // Update other fields
    Object.assign(task, taskData);

    const savedTask = await this.taskRepository.save(task);

    // Publish event
    await this.rabbitMQService.publishEvent({
      type: 'task.updated',
      taskId: savedTask.id,
      assignedUserIds: savedTask.assignedUsers.map(u => u.id),
      updatedBy: updatedById,
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }

  async createComment(taskId: string, createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
    const task = await this.findOne(taskId);
    const author = await this.userRepository.findOne({ where: { id: authorId } });
    
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      task,
      author,
    });

    const savedComment = await this.commentRepository.save(comment);

    // Publish event
    await this.rabbitMQService.publishEvent({
      type: 'task.comment.created',
      taskId,
      commentId: savedComment.id,
      assignedUserIds: task.assignedUsers.map(u => u.id),
      authorId,
    });

    return this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['author'],
    });
  }

  async findComments(taskId: string, page: number = 1, size: number = 10): Promise<PaginatedResponse<Comment>> {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { task: { id: taskId } },
      relations: ['author'],
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });

    return {
      data: comments,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }
}
