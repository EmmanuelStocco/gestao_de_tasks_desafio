import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateTaskDto, UpdateTaskDto, CreateCommentDto, PaginatedResponse, Task, Comment } from '@gestao-tarefas/types';

@Injectable()
export class TasksService {
  private readonly tasksServiceUrl = process.env.TASKS_SERVICE_URL || 'http://localhost:3003';

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const response = await axios.post(`${this.tasksServiceUrl}/tasks`, createTaskDto);
      return response.data;
    } catch (error) {
      throw new Error(`Tasks service error: ${error.response?.data?.message || error.message}`);
    }
  }

  async findAll(page: number = 1, size: number = 10): Promise<PaginatedResponse<Task>> {
    try {
      const response = await axios.get(`${this.tasksServiceUrl}/tasks`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Tasks service error: ${error.response?.data?.message || error.message}`);
    }
  }

  async findOne(id: string): Promise<Task> {
    try {
      const response = await axios.get(`${this.tasksServiceUrl}/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Tasks service error: ${error.response?.data?.message || error.message}`);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const response = await axios.patch(`${this.tasksServiceUrl}/tasks/${id}`, updateTaskDto);
      return response.data;
    } catch (error) {
      throw new Error(`Tasks service error: ${error.response?.data?.message || error.message}`);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const response = await axios.delete(`${this.tasksServiceUrl}/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Tasks service error: ${error.response?.data?.message || error.message}`);
    }
  }

  async createComment(taskId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const response = await axios.post(`${this.tasksServiceUrl}/tasks/${taskId}/comments`, createCommentDto);
      return response.data;
    } catch (error) {
      throw new Error(`Tasks service error: ${error.response?.data?.message || error.message}`);
    }
  }

  async findComments(taskId: string, page: number = 1, size: number = 10): Promise<PaginatedResponse<Comment>> {
    try {
      const response = await axios.get(`${this.tasksServiceUrl}/tasks/${taskId}/comments`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Tasks service error: ${error.response?.data?.message || error.message}`);
    }
  }
}
