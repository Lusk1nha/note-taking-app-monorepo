import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Email } from 'src/common/entities/email';
import { Password } from 'src/common/entities/password/password';
import { UUID } from 'src/common/entities/uuid/uuid';

export class CreateCredentialsInput {
  @ApiProperty({
    description: 'Inform the user ID',
  })
  userId: UUID;

  @ApiProperty({
    description: 'Inform the user email',
  })
  @IsEmail()
  email: Email;

  @ApiProperty({
    description: 'Inform the user password',
  })
  @IsString()
  password: Password;
}

export class UpdatePasswordInput {
  @ApiProperty({
    description: 'Inform the new password',
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class UpdatePasswordOutput {
  message: 'Password updated successfully';
}

export class UpdateEmailInput {
  @ApiProperty({
    description: 'Inform the user email',
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  newEmail: string;
}

export class UpdateEmailOutput {
  message: 'Email updated successfully';
}
