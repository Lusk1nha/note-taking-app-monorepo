import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

import { Role } from 'src/common/roles/roles.util';

import { CreateEmailInput, CreateEmailOutput } from './dto/emails.post.dto';
import { EmailsService } from './emails.service';

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
    await this.emailsService.sendEmail(payload);

    return {
      message: 'Email sent successfully',
    };
  }
}
