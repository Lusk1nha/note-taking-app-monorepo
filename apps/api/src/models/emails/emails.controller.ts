import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { EmailsService } from './emails.service';
import { UserAuthType } from 'src/common/types';
import { Role } from 'src/common/roles/roles.util';
import { UUID } from 'src/common/entities/uuid/uuid';
import { CreateEmailInput, CreateEmailOutput } from './dto/emails.post.dto';

@Controller('emails')
@ApiTags('Emails')
@ApiBearerAuth()
@AllowAuthenticated()
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('test-send')
  @AllowAuthenticated(Role.Admin)
  async testSendEmail(
    @GetUser() currentUser: UserAuthType,
    @Body() payload: CreateEmailInput,
  ): Promise<CreateEmailOutput> {
    const userId = new UUID(currentUser.sub);

    const email = await this.emailsService.sendEmail(userId, payload);

    return {
      email,
      message: 'Email sent successfully',
    };
  }
}
