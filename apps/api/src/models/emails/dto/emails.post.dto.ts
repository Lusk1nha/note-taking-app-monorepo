import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({
    description: 'CC email address (optional)',
  })
  @IsString()
  @IsOptional()
  cc?: string;
}

export class CreateEmailOutput {
  message: 'Email sent successfully';
}
