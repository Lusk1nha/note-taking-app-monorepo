import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsDate } from 'class-validator';
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
    description: 'The unique identifier of the user',
  })
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
