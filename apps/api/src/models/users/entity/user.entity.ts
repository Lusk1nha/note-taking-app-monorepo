import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsDate, IsUUID } from 'class-validator';
import { UUID } from 'src/common/entities/uuid/uuid';

export class UserEntity {
  constructor(user: User) {
    this.id = new UUID(user.id);
    this.name = user.name;
    this.image = user.image;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  @ApiProperty({
    type: () => UUID,
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: UUID;

  @ApiProperty()
  name: string | null;

  @ApiProperty()
  image: string | null;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}
