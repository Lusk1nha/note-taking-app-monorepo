import { ApiProperty } from '@nestjs/swagger';
import { Email } from '@prisma/client';
import { IsDate } from 'class-validator';
import { UUID } from 'src/common/entities/uuid/uuid';

export class EmailEntity {
  constructor(email: Email) {
    this.id = new UUID(email.id);
    this.userId = new UUID(email.userId);
    this.to = email.to;
    this.from = email.from;
    this.subject = email.subject;
    this.body = email.body;
    this.createdAt = email.createdAt;
    this.updatedAt = email.updatedAt;
  }

  @ApiProperty({
    description: 'Unique identifier for the email',
  })
  id: UUID;

  @ApiProperty({
    description: 'Unique identifier for the user associated with the email',
  })
  userId: UUID;

  @ApiProperty({
    description: 'Recipient email address',
  })
  to: string;

  @ApiProperty({
    description: 'Sender email address',
  })
  from: string;

  @ApiProperty({
    description: 'Email subject',
  })
  subject: string;

  @ApiProperty({
    description: 'Email body content',
  })
  body: string;

  @ApiProperty({
    description: 'Created at date',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at date',
  })
  @IsDate()
  updatedAt: Date;
}
