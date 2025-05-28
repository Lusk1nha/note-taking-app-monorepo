import { MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { EmailQueueEntity } from './entity/email-queue.entity';

@Processor('emailQueue', {
  concurrency: 5,
  limiter: {
    max: 10,
    duration: 1000,
  },
})
export class EmailConsumerService extends WorkerHost {
  private readonly logger = new Logger(EmailConsumerService.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<EmailQueueEntity>) {
    const payload = job.data;

    this.logger.log(`Processing email job with ID: ${payload.id}`);

    console.log(`Email Job Data:`, payload);

    try {
      await this.mailerService.sendMail({
        template: payload.template,
        messageId: payload.id,
        from: payload.from,
        to: payload.to,
        cc: payload.cc,
        subject: payload.subject,
        text: payload.body,
        context: payload.context,
      });

      this.logger.log(`Email sent successfully with ID: ${payload.id}`);

      return;
    } catch (error) {
      this.logger.error(`Failed to process email job with ID: ${payload.id}`, error);
      throw error;
    }
  }
}
