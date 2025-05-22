import { ApiProperty } from '@nestjs/swagger';

export class JWTOutput {
  @ApiProperty({
    description: 'Access token for authentication',
  })
  token: string;

  @ApiProperty({
    description: 'Token type',
  })
  tokenType: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
  })
  expiresIn: string;
}
