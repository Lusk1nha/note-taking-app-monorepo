import { ApiProperty } from '@nestjs/swagger';
import { TokenEntity } from '../entity/token.entity';

export class RevalidateRefreshTokenInput {
  refreshToken: string;
}

export class RevalidateRefreshTokenOutput {
  @ApiProperty({
    description: 'Access token',
    type: TokenEntity,
  })
  accessToken: TokenEntity;

  @ApiProperty({
    description: 'Refresh token',
    type: TokenEntity,
  })
  refreshToken: TokenEntity;
}
