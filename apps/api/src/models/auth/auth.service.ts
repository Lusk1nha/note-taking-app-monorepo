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
  UserNotFoundException,
} from './errors/auth.errors';

import { Password } from 'src/common/entities/password/password';
import { UUID } from 'src/common/entities/uuid/uuid';
import { TokenService } from '../token/token.service';
import { AuthValidators } from './auth.validators';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly authProviderService: AuthProviderService,
    private readonly credentialsService: CredentialsService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailsService
  ) {}

  async signUp(email: Email, password: Password): Promise<UserEntity> {
    await this.validateUniqueEmail(email);

    return this.prisma.$transaction(async (tx: PrismaTransaction) => {
      const user = await this.createUserWithCredentials(tx, email, password);
      this.logger.log(`User registered successfully: ${user.id.value}`);

      await this.emailService.sendEmail({
        template: 'register',
        to: email.value,
        subject: 'Welcome to Our Service',
        context: {
          email: email.value,
        },
      });

      return user;
    });
  }

  async signIn(email: Email, password: Password) {
    const credential = await this.credentialsService.findByEmail(email);

    if (!credential) {
      this.logger.warn(`No credentials found for email: ${email.value}`);
      throw new InvalidCredentialsException();
    }

    await this.validatePassword(credential.email, password);
    const user = await this.getValidatedUser(credential.userId);

    this.logger.log(`User logged in successfully: ${user.id.value}`);
    return this.tokenService.generateToken(user);
  }

  async logout(userId: UUID, refreshToken: string) {
    await this.validateTokenAndOwnership(refreshToken, userId);
    return await this.tokenService.revokeToken(refreshToken);
  }

  async logoutAll(userId: UUID, refreshToken: string) {
    const { user } = await this.validateTokenAndOwnership(refreshToken, userId);
    return await this.tokenService.revokeAllTokens(user);
  }

  async revalidateToken(token: string) {
    const { user } = await this.validateTokenOwnership(token);
    return this.tokenService.revalidateRefreshToken(user, token);
  }

  // Private Helpers
  private async validateUniqueEmail(email: Email) {
    if (await this.credentialsService.findByEmail(email)) {
      this.logger.warn(`Email already exists: ${email.value}`);
      throw new UserAlreadyExistsException();
    }
  }

  private async createUserWithCredentials(tx: PrismaTransaction, email: Email, password: Password) {
    const user = await this.usersService.createUser(tx);

    await Promise.all([
      this.credentialsService.createCredential({ userId: user.id, email, password }, tx),
      this.authProviderService.createAuthProvider(
        { userId: user.id, providerType: AuthProviderType.CREDENTIALS },
        tx
      ),
    ]);

    return user;
  }

  private async validatePassword(email: Email, password: Password) {
    if (!(await this.credentialsService.validatePassword(email, password))) {
      this.logger.warn(`Invalid credentials for email: ${email.value}`);
      throw new InvalidCredentialsException();
    }
  }

  private async getValidatedUser(userId: UUID): Promise<UserEntity> {
    const user = await this.usersService.findById(userId);
    AuthValidators.validateExistingUser(user);

    return user as UserEntity;
  }

  private async validateTokenAndOwnership(token: string, userId: UUID) {
    const { user } = await this.validateTokenOwnership(token);

    if (!user) {
      throw new UserNotFoundException();
    }

    AuthValidators.validateUserOwnership(userId, user.id);

    return { user };
  }

  private async validateTokenOwnership(token: string) {
    const claims = await this.tokenService.validateRefreshToken(token);
    const user = await this.getValidatedUser(new UUID(claims.sub));
    return { user };
  }
}
