import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQEvent } from '@gestao-tarefas/types';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: any = null;
  private channel: any = null;

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672');
      this.channel = await this.connection.createChannel();
      
      // Declare exchanges
      await this.channel.assertExchange('task.events', 'topic', { durable: true });
      
      console.log('Connected to RabbitMQ');
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

  async publishEvent(event: RabbitMQEvent) {
    if (!this.channel) {
      console.error('RabbitMQ channel not available');
      return;
    }

    try {
      const routingKey = event.type.replace('.', ':');
      await this.channel.publish(
        'task.events',
        routingKey,
        Buffer.from(JSON.stringify(event)),
        { persistent: true }
      );
      console.log(`Published event: ${event.type}`);
    } catch (error) {
      console.error('Failed to publish event:', error);
    }
  }
}
