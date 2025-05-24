import { Injectable, Logger } from '@nestjs/common';
import { AuthProviderRepository } from './auth-provider.repository';
import { CreateAuthProviderInput } from './dto/auth-provider.post.dto';
import { AuthProviderEntity } from './entity/auth-provider.entity';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';

@Injectable()
export class AuthProviderService {
  private readonly logger = new Logger(AuthProviderService.name);

  constructor(private readonly authProviderRepository: AuthProviderRepository) {}

  async createAuthProvider(
    payload: CreateAuthProviderInput,
    tx?: PrismaTransaction,
  ): Promise<AuthProviderEntity> {
    const userId = payload.userId.value;

    const authProvider = await this.authProviderRepository.create(
      {
        user: {
          connect: {
            id: userId,
          },
        },
        providerType: payload.providerType,
      },
      tx,
    );

    this.logger.log(`AuthProvider with ID ${authProvider.id} created`);

    return new AuthProviderEntity(authProvider);
  }
}
