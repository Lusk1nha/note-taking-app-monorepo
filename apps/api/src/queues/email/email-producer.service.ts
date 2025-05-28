import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { EmailQueueData, EmailQueueEntity } from './entity/email-queue.entity';

@Injectable()
export class EmailProducerService {
  private readonly logger = new Logger(EmailProducerService.name);

  constructor(@InjectQueue('emailQueue') private readonly queue: Queue) {}

  async sendEmail(payload: EmailQueueEntity): Promise<Job<EmailQueueEntity>> {
    this.logger.log(`Adding email job to queue with id: ${payload.id}`);

    return await this.queue.add('sendEmail', payload, {
      attempts: 3,
      backoff: 5000,
    });
  }
}
