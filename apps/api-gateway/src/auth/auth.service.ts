import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateUserDto, LoginDto, AuthResponse } from '@gestao-tarefas/types';

@Injectable()
export class AuthService {
  private readonly authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/register`, createUserDto);
      return response.data;
    } catch (error) {
      throw new Error(`Auth service error: ${error.response?.data?.message || error.message}`);
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/login`, loginDto);
      return response.data;
    } catch (error) {
      throw new Error(`Auth service error: ${error.response?.data?.message || error.message}`);
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/refresh`, { refreshToken });
      return response.data;
    } catch (error) {
      throw new Error(`Auth service error: ${error.response?.data?.message || error.message}`);
    }
  }
}
