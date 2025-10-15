// User types
export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'password'>;
}

// Task types
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assignedUsers: User[];
  comments: Comment[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  deadline: Date;
  priority: TaskPriority;
  assignedUserIds: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  deadline?: Date;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedUserIds?: string[];
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  task: Task;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentDto {
  content: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'task:created' | 'task:updated' | 'comment:new';
  message: string;
  userId: string;
  taskId?: string;
  read: boolean;
  createdAt: Date;
}

// RabbitMQ Events
export interface TaskCreatedEvent {
  type: 'task.created';
  taskId: string;
  assignedUserIds: string[];
  createdBy: string;
}

export interface TaskUpdatedEvent {
  type: 'task.updated';
  taskId: string;
  assignedUserIds: string[];
  updatedBy: string;
}

export interface CommentCreatedEvent {
  type: 'task.comment.created';
  taskId: string;
  commentId: string;
  assignedUserIds: string[];
  authorId: string;
}

export type RabbitMQEvent = TaskCreatedEvent | TaskUpdatedEvent | CommentCreatedEvent;

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
