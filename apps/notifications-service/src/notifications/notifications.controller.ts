import { Controller, Get, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async getUserNotifications(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('size', new ParseIntPipe({ optional: true })) size: number = 10,
  ) {
    // In a real app, you'd get the user ID from JWT token
    const userId = '00000000-0000-0000-0000-000000000001'; // Mock user ID
    return this.notificationsService.getUserNotifications(userId, page, size);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markAsRead(@Param('id') id: string) {
    // In a real app, you'd get the user ID from JWT token
    const userId = '00000000-0000-0000-0000-000000000001'; // Mock user ID
    await this.notificationsService.markAsRead(id, userId);
    return { message: 'Notification marked as read' };
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead() {
    // In a real app, you'd get the user ID from JWT token
    const userId = '00000000-0000-0000-0000-000000000001'; // Mock user ID
    await this.notificationsService.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
  }
}
