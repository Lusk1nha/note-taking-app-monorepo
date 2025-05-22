import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { JWTOutput } from 'src/common/types/jwt.types';
import { UserEntity } from 'src/models/users/entity/user.entity';

export class RegisterRequestInput {
  @ApiProperty({
    description: "User's email address",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "User's password",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterResponseOutput {
  @ApiProperty({
    description: 'Register response message',
  })
  message: string;

  @ApiProperty({
    description: 'User properties',
  })
  user: UserEntity;
}

export class LoginRequestInput {
  @ApiProperty({
    description: "User's email address",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "User's password",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseOutput {
  @ApiProperty({
    description: 'Access token for authentication',
  })
  accessToken: JWTOutput;
}
