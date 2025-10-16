import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQEvent } from '@gestao-tarefas/types';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: any = null;
  private channel: any = null;
  private notificationsService: any;

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672');
      this.channel = await this.connection.createChannel();
      
      // Declare exchanges and queues
      await this.channel.assertExchange('task.events', 'topic', { durable: true });
      await this.channel.assertQueue('notifications', { durable: true });
      
      // Bind queues to exchanges
      await this.channel.bindQueue('notifications', 'task.events', 'task:*');
      
      // Start consuming
      await this.channel.consume('notifications', (msg) => {
        if (msg) {
          try {
            const event: RabbitMQEvent = JSON.parse(msg.content.toString());
            this.handleEvent(event);
            this.channel.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);
            this.channel.nack(msg, false, false);
          }
        }
      });
      
      console.log('Connected to RabbitMQ and started consuming');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }

  setNotificationsService(service: any) {
    this.notificationsService = service;
  }

  private async handleEvent(event: RabbitMQEvent) {
    console.log(`Handling event: ${event.type}`);
    if (this.notificationsService) {
      await this.notificationsService.handleRabbitMQEvent(event);
    }
  }
}
