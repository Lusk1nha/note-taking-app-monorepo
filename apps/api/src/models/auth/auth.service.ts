import { Injectable, Logger } from '@nestjs/common';
import { Email } from 'src/common/entities/email/email';
import { AuthProviderService } from '../auth-provider/auth-provider.service';
import { CredentialsService } from '../credentials/credentials.service';
import { UsersService } from '../users/users.service';

import { AuthProviderType } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';
import { UserEntity } from '../users/entity/user.entity';
import {
  InvalidCredentialsException,
  UserAlreadyExistsException,
  UserCannotLogoutAnotherUserException,
  UserNotFoundException,
} from './errors/auth.errors';

import { Password } from 'src/common/entities/password/password';
import { UUID } from 'src/common/entities/uuid/uuid';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly authProviderService: AuthProviderService,
    private readonly credentialsService: CredentialsService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(email: Email, password: Password): Promise<UserEntity> {
    const existingCredential = await this.credentialsService.findByEmail(email);

    if (existingCredential) {
      throw new UserAlreadyExistsException();
    }

    return await this.prisma.$transaction(async (tx: PrismaTransaction) => {
      const user = await this.usersService.createUser(tx);

      await this.credentialsService.createCredential(
        {
          userId: user.id,
          email,
          password,
        },
        tx,
      );

      await this.authProviderService.createAuthProvider(
        {
          userId: user.id,
          providerType: AuthProviderType.CREDENTIALS,
        },
        tx,
      );

      this.logger.log(`User ${user.id} registered successfully`);

      return user;
    });
  }

  async signIn(email: Email, password: Password) {
    const credential = await this.credentialsService.findByEmail(email);

    if (!credential) {
      throw new InvalidCredentialsException(); // Prevent user enumeration
    }

    const isValid = await this.credentialsService.validatePassword(email, password);

    if (!isValid) {
      throw new InvalidCredentialsException();
    }

    const user = await this.usersService.findById(credential.id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return await this.tokenService.generateToken(user);
  }

  async logout(userId: UUID, refreshToken: string) {
    const claims = await this.tokenService.decodeRefreshToken(refreshToken);
    const user = await this.usersService.findById(new UUID(claims.sub));

    if (!user) {
      throw new UserNotFoundException();
    }

    if (!userId.equals(user.id)) {
      throw new UserCannotLogoutAnotherUserException();
    }

    return await this.tokenService.revokeToken(refreshToken);
  }

  async logoutAll(userId: UUID, refreshToken: string) {
    const claims = await this.tokenService.decodeRefreshToken(refreshToken);
    const user = await this.usersService.findById(new UUID(claims.sub));

    if (!user) {
      throw new UserNotFoundException();
    }

    if (!userId.equals(user.id)) {
      throw new UserCannotLogoutAnotherUserException();
    }

    return await this.tokenService.revokeAllTokens(user);
  }

  async revalidateToken(token: string) {
    const claims = await this.tokenService.decodeRefreshToken(token);
    const user = await this.usersService.findById(new UUID(claims.sub));

    if (!user) {
      throw new UserNotFoundException();
    }

    return this.tokenService.revalidateRefreshTokens(user, token);
  }
}
