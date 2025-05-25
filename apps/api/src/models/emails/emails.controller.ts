import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { UUID } from 'src/common/entities/uuid/uuid';
import { Role } from 'src/common/roles/roles.util';
import { UserAuthType } from 'src/common/types';
import { CreateEmailInput, CreateEmailOutput } from './dto/emails.post.dto';
import { EmailsService } from './emails.service';

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
