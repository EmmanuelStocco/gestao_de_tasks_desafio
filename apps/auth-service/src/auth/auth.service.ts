import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { CreateUserDto, LoginDto, AuthResponse } from '@gestao-tarefas/types';
import { hashPassword, comparePassword } from '@gestao-tarefas/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const { email, username, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const accessToken = this.jwtService.sign({ sub: savedUser.id, email: savedUser.email });
    const refreshToken = this.jwtService.sign(
      { sub: savedUser.id, email: savedUser.email },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key' }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        username: savedUser.username,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key' }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
      });

      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    return user;
  }
}
