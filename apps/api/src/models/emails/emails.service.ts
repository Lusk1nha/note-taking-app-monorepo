import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateEmailInput } from './dto/emails.post.dto';
import { EmailProducerService } from 'src/queues/email/email-producer.service';
import { UUID } from 'src/common/entities/uuid/uuid';

import { Job } from 'bullmq';
import { EmailQueueData, EmailQueueEntity } from 'src/queues/email/entity/email-queue.entity';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);
  private readonly fromEmailAddress: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailQueue: EmailProducerService
  ) {
    const emailAddress = this.configService.get<string>('EMAIL_FROM_ADDRESS');

    if (!emailAddress) {
      throw new Error('EMAIL_FROM_ADDRESS is not defined in the configuration');
    }

    this.fromEmailAddress = emailAddress;
  }

  async sendEmail(payload: EmailQueueData): Promise<Job<EmailQueueData>> {
    const id = new UUID();

    this.logger.log(`Sending email with ID: ${id.value}`);

    const email = new EmailQueueEntity(payload);

    return await this.emailQueue.sendEmail(email);
  }
}
