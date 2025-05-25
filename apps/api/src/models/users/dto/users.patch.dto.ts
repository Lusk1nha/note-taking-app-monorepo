import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';
import { UserEntity } from '../entity/user.entity';

export class UpdateUserInput implements Partial<UserEntity> {
  @ApiProperty({
    description: "User's name",
    required: false,
  })
  @IsString()
  name?: string | undefined;

  @ApiProperty({
    description: "User's photo URL",
    example: 'https://example.com/user-photo.jpg',
    required: false,
  })
  @IsUrl()
  image?: string | undefined;
}

export class UpdateUserOutput {
  @ApiProperty({
    description: 'Updated user properties',
    type: UserEntity,
  })
  user: UserEntity;

  @ApiProperty({
    description: 'Message confirming user update',
  })
  message: 'User updated successfully';
}

export class DeleteUserOutput {
  @ApiProperty({
    description: 'Message confirming user deletion',
  })
  message: 'User deleted successfully';
}
