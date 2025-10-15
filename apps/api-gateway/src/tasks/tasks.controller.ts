import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, CreateCommentDto, PaginatedResponse, Task, Comment } from '@gestao-tarefas/types';

@ApiTags('tasks')
@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('size', new ParseIntPipe({ optional: true })) size: number = 10,
  ): Promise<PaginatedResponse<Task>> {
    return this.tasksService.findAll(page, size);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.tasksService.remove(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async createComment(
    @Param('id') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.tasksService.createComment(taskId, createCommentDto);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a task' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  async findComments(
    @Param('id') taskId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('size', new ParseIntPipe({ optional: true })) size: number = 10,
  ): Promise<PaginatedResponse<Comment>> {
    return this.tasksService.findComments(taskId, page, size);
  }
}
