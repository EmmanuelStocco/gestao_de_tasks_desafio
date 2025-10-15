import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private readonly notificationsServiceUrl = process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3004';

  async getUserNotifications(page: number = 1, size: number = 10) {
    try {
      const response = await axios.get(`${this.notificationsServiceUrl}/notifications`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Notifications service error: ${error.response?.data?.message || error.message}`);
    }
  }

  async markAsRead(notificationId: string) {
    try {
      const response = await axios.patch(`${this.notificationsServiceUrl}/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw new Error(`Notifications service error: ${error.response?.data?.message || error.message}`);
    }
  }

  async markAllAsRead() {
    try {
      const response = await axios.patch(`${this.notificationsServiceUrl}/notifications/read-all`);
      return response.data;
    } catch (error) {
      throw new Error(`Notifications service error: ${error.response?.data?.message || error.message}`);
    }
  }
}
