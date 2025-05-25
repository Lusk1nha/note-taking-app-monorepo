import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { EmailEntity } from '../entity/emails.entity';

export class CreateEmailInput {
  @ApiProperty({
    description: 'Subject of the email',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Recipient email address',
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Email body content',
  })
  @IsString()
  to: string;
}

export class CreateEmailOutput {
  email: EmailEntity;
  message: 'Email sent successfully';
}
