import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createJWTPayload } from 'src/helpers/jwt';
import { UserEntity } from '../users/entity/user.entity';

import { InvalidTokenException, TokenExpiredException } from './errors/token.errors';

import { TokenRepository } from './token.repository';

import { createHmac } from 'crypto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly refreshTokenExpiration: number;
  private readonly accessTokenExpiration: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenRepository: TokenRepository,
  ) {
    this.refreshTokenExpiration = Number(configService.get('JWT_REFRESH_EXPIRATION'));
    this.accessTokenExpiration = Number(configService.get('JWT_EXPIRATION'));
  }

  async generateToken(user: UserEntity) {
    const { accessToken, refreshToken } = await this.generateTokens(user);

    const expiresAt = new Date(Date.now() + this.refreshTokenExpiration * 1000);
    const tokenHash = this.generateTokenHash(refreshToken.token);

    await this.tokenRepository.create({
      user: {
        connect: {
          id: user.id.value,
        },
      },
      tokenHash,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  async revalidateRefreshTokens(user: UserEntity, previousToken: string) {
    return this.prisma.$transaction(async (tx) => {
      const tokenHash = this.generateTokenHash(previousToken);

      const session = await this.tokenRepository.findUnique({
        tokenHash,
        userId: user.id.value,
        revoked: false,
      });

      if (!session) {
        throw new InvalidTokenException();
      }

      await this.tokenRepository.update(
        {
          where: { id: session.id },
          data: { revoked: true },
        },
        tx,
      );

      if (session.expiresAt < new Date()) {
        throw new TokenExpiredException();
      }

      const { accessToken, refreshToken } = await this.generateTokens(user);

      await this.tokenRepository.create(
        {
          user: {
            connect: {
              id: user.id.value,
            },
          },
          tokenHash: this.generateTokenHash(refreshToken.token),
          expiresAt: new Date(Date.now() + this.refreshTokenExpiration * 1000),
          revoked: false,
        },
        tx,
      );

      return { accessToken, refreshToken };
    });
  }

  async decodeAccessToken(token: string) {
    const secret = this.configService.get('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      return await this.jwtService.verifyAsync(token, {
        secret,
        algorithms: ['HS256'],
      });
    } catch (error) {
      this.logger.error(`Failed to decode access token: ${error.message}`);
      throw new InvalidTokenException();
    }
  }

  async decodeRefreshToken(token: string) {
    const secret = this.configService.get('JWT_REFRESH_SECRET');

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    try {
      return await this.jwtService.verifyAsync(token, {
        secret,
        algorithms: ['HS256'],
      });
    } catch (error) {
      this.logger.error(`Failed to decode refresh token: ${error.message}`);
      throw new InvalidTokenException();
    }
  }

  async revokeToken(user: UserEntity, token: string) {
    return this.prisma.$transaction(async (tx) => {
      const tokenHash = this.generateTokenHash(token);

      const session = await this.tokenRepository.findUnique({
        tokenHash,
        userId: user.id.value,
        revoked: false,
      });

      if (!session) {
        throw new InvalidTokenException();
      }

      await this.tokenRepository.update(
        {
          where: { id: session.id },
          data: { revoked: true },
        },
        tx,
      );
    });
  }

  async revokeAllTokens(user: UserEntity) {
    return this.prisma.$transaction(async (tx) => {
      await this.tokenRepository.updateMany(
        {
          where: { userId: user.id.value, revoked: false },
          data: { revoked: true },
        },
        tx,
      );
    });
  }

  private async generateTokens(user: UserEntity) {
    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user),
    ]);

    return { accessToken, refreshToken };
  }

  private async createRefreshToken(user: UserEntity) {
    const secret = this.configService.get('JWT_REFRESH_SECRET');

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    return this.signToken(user, secret, '7d', 'refresh');
  }

  private async createAccessToken(user: UserEntity) {
    const secret = this.configService.get('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return this.signToken(user, secret, '15m', 'access');
  }

  private async signToken(
    user: UserEntity,
    secret: string,
    expiresIn: string | number,
    type: string,
  ) {
    const payload = createJWTPayload(user);
    const token = await this.jwtService.signAsync(payload, {
      algorithm: 'HS256',
      expiresIn,
      secret,
    });

    this.logger.log(`Generated ${type} token for user ${user.id.value}`);

    return {
      tokenType: 'Bearer',
      token,
      expiresIn,
    };
  }

  private generateTokenHash(token: string): string {
    const hmacSecret = this.configService.get('HMAC_SECRET');
    return createHmac('sha256', hmacSecret).update(token).digest('hex');
  }
}
