import { ApiProperty } from '@nestjs/swagger';
import { Admin } from '@prisma/client';
import { IsDate } from 'class-validator';
import { UUID } from 'src/common/entities/uuid/uuid';

export class AdminEntity {
  constructor(admin: Admin) {
    this.id = new UUID(admin.id);
    this.createdAt = admin.createdAt;
  }

  @ApiProperty({
    description: 'Unique identifier for the user',
  })
  id: UUID;

  @ApiProperty({
    description: 'Created at date',
  })
  @IsDate()
  createdAt: Date;
}
