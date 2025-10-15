import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(private notificationsService: NotificationsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    
    // In a real app, you'd authenticate the user and get their ID from JWT
    // For now, we'll use a mock user ID
    const userId = '00000000-0000-0000-0000-000000000001';
    this.userSockets.set(userId, client.id);
    
    client.emit('connected', { message: 'Connected to notifications' });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
    // Remove user from map
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  async sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  async broadcastNotification(notification: any) {
    this.server.emit('notification', notification);
  }
}
