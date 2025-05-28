import { Injectable, Logger } from '@nestjs/common';
import { UUID } from 'src/common/entities/uuid/uuid';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';
import { AuthProviderRepository } from './auth-provider.repository';
import { CreateAuthProviderInput } from './dto/auth-provider.post.dto';
import { AuthProviderEntity } from './entity/auth-provider.entity';

interface IAuthProviderService {
  createAuthProvider(
    payload: CreateAuthProviderInput,
    tx?: PrismaTransaction
  ): Promise<AuthProviderEntity>;
}

@Injectable()
export class AuthProviderService implements IAuthProviderService {
  private readonly logger = new Logger(AuthProviderService.name);

  constructor(private readonly repository: AuthProviderRepository) {}

  async createAuthProvider(
    payload: CreateAuthProviderInput,
    tx?: PrismaTransaction
  ): Promise<AuthProviderEntity> {
    const userId = payload.userId.value;

    const authProvider = await this.repository.create(
      {
        id: new UUID().value,
        user: {
          connect: {
            id: userId,
          },
        },
        providerType: payload.providerType,
      },
      tx
    );

    this.logger.log(`AuthProvider with ID ${authProvider.id} created`);

    return new AuthProviderEntity(authProvider);
  }
}
