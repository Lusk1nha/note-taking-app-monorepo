import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

import { Role } from 'src/common/roles/roles.util';

import { CreateEmailInput, CreateEmailOutput } from './dto/emails.post.dto';
import { EmailsService } from './emails.service';
import { EmailQueueFactory } from 'src/queues/email/factories/email-queue.factory';

@Controller('emails')
@ApiTags('Emails')
@ApiBearerAuth()
@AllowAuthenticated()
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('send-test')
  @ApiOperation({
    summary: 'Test send email',
    description: 'Endpoint to test sending an email',
  })
  @AllowAuthenticated(Role.Admin)
  async testSendEmail(@Body() payload: CreateEmailInput): Promise<CreateEmailOutput> {
    const emailQueue = EmailQueueFactory.create(payload);
    await this.emailsService.sendEmail(emailQueue);

    return {
      message: 'Email sent successfully',
    };
  }
}
