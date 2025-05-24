import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { EmailsRepository } from './emails.repository';
import { EmailEntity } from './entity/emails.entity';
import { CreateEmailInput } from './dto/emails.post.dto';
import { UUID } from 'src/common/entities/uuid/uuid';
import { EmailStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);
  private readonly fromEmailAddress: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly emailsRepository: EmailsRepository,
  ) {
    const emailAddress = this.configService.get<string>('EMAIL_FROM_ADDRESS');

    if (!emailAddress) {
      throw new Error('EMAIL_FROM_ADDRESS is not defined in the configuration');
    }

    this.fromEmailAddress = emailAddress;
  }

  async sendEmail(userId: UUID, payload: CreateEmailInput): Promise<EmailEntity> {
    const id = new UUID();

    const email = await this.emailsRepository.create({
      from: this.fromEmailAddress,
      id: id.value,
      user: {
        connect: {
          id: userId.value,
        },
      },
      subject: payload.subject,
      body: payload.body,
      to: payload.to,
      status: EmailStatus.PENDING,
    });

    const mailer = await this.mailerService.sendMail({
      messageId: id.value,
      to: payload.to,
      from: this.fromEmailAddress,
      subject: payload.subject,
      text: payload.body,
    });

    if (mailer) {
      await this._updateEmailToSent(id);
    } else {
      await this._updateEmailToFailed(id);
    }

    return new EmailEntity(email);
  }

  private async _updateEmailToSent(id: UUID): Promise<void> {
    await this.emailsRepository.update(id.value, {
      status: EmailStatus.SENT,
    });

    this.logger.log(`Email with ID ${id.value} updated to SENT`);
  }

  private async _updateEmailToFailed(id: UUID): Promise<void> {
    await this.emailsRepository.update(id.value, {
      status: EmailStatus.FAILED,
    });

    this.logger.error(`Email with ID ${id.value} failed to send`);
  }
}
