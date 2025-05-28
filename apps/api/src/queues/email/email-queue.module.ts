import { Module } from '@nestjs/common';
import { EmailProducerService } from './email-producer.service';
import { EmailConsumerService } from './email-consumer.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emailQueue',
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
      },
    }),
  ],
  providers: [EmailProducerService, EmailConsumerService],
  exports: [EmailProducerService],
})
export class EmailQueueModule {}
