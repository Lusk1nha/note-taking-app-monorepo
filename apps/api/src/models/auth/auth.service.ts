import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthProviderService } from '../auth-provider/auth-provider.service';
import { CredentialsService } from '../credentials/credentials.service';
import { UsersService } from '../users/users.service';
import { Email } from 'src/common/entities/email';

import { AuthProviderType } from '@prisma/client';
import { AuthError } from './errors/auth.errors';
import { UserEntity } from '../users/entity/user.entity';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';
import { createJWTPayload } from 'src/helpers/jwt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTOutput } from 'src/common/types/jwt.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtAlgorithm = 'HS256';

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authProviderService: AuthProviderService,
    private readonly credentialsService: CredentialsService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(email: Email, password: string): Promise<UserEntity> {
    const existingCredential = await this.credentialsService.findByEmail(email);

    if (existingCredential) {
      throw new ConflictException(AuthError.USER_ALREADY_EXISTS);
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

  async signIn(email: Email, password: string): Promise<JWTOutput> {
    const credential = await this.credentialsService.findByEmail(email);

    if (!credential) {
      throw new ConflictException(AuthError.USER_NOT_FOUND);
    }

    const isValid = await this.credentialsService.validatePassword(email, password);

    if (!isValid) {
      throw new UnauthorizedException(AuthError.INVALID_CREDENTIALS);
    }

    const user = await this.usersService.findById(credential.id);

    if (!user) {
      throw new ConflictException(AuthError.USER_NOT_FOUND);
    }

    const accessToken = await this._generateUserToken(user);

    return accessToken;
  }

  private async _generateUserToken(user: UserEntity): Promise<JWTOutput> {
    const payload = createJWTPayload(user);

    const token = await this._generateJwtToken(payload);

    this.logger.log(`User authenticated successfully: ${user.id.value}`);

    const expiresIn = this.configService.get<string>('JWT_EXPIRATION');

    if (!expiresIn) {
      this.logger.error('JWT_EXPIRATION is not defined');
      throw new InternalServerErrorException('JWT_EXPIRATION is not defined');
    }

    return {
      token,
      expiresIn,
      tokenType: 'Bearer',
    };
  }

  private async _generateJwtToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload, {
      algorithm: this.jwtAlgorithm,
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
