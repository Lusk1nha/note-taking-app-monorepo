import { ApiProperty } from '@nestjs/swagger';
import { AuthProvider, AuthProviderType } from '@prisma/client';
import { IsDate, IsEnum, IsUUID } from 'class-validator';
import { UUID } from 'src/common/entities/uuid/uuid';

export class AuthProviderEntity {
  constructor(authProvider: AuthProvider) {
    this.id = new UUID(authProvider.id);

    this.providerType = authProvider.providerType;
    this.createdAt = authProvider.createdAt;
  }

  @ApiProperty()
  @IsUUID()
  id: UUID;

  @ApiProperty()
  @IsEnum(AuthProviderType)
  providerType: AuthProviderType;

  @ApiProperty()
  @IsDate()
  createdAt: Date;
}
