import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createJWTPayload } from 'src/helpers/jwt';
import { UserEntity } from '../users/entity/user.entity';

import { InvalidTokenException } from './errors/token.errors';

import { createHmac } from 'crypto';
import { CacheRedisRepository } from 'src/common/redis/cache-redis.repository';
import { REDIS_KEYS } from './token.constants';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly refreshTokenExpirationAsDays: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisRepository: CacheRedisRepository,
  ) {
    this.refreshTokenExpirationAsDays = Number(configService.get('JWT_REFRESH_EXPIRATION'));
  }

  async generateToken(user: UserEntity) {
    const { accessToken, refreshToken } = await this.generateTokens(user);

    const tokenHash = this.generateTokenHash(refreshToken.token);

    await this.saveRefreshTokenInCache(user, tokenHash);

    return { accessToken, refreshToken };
  }

  async revalidateRefreshTokens(user: UserEntity, previousToken: string) {
    const previousTokenokenHash = this.generateTokenHash(previousToken);
    const session = await this.getRefreshTokenFromCache(previousTokenokenHash);

    if (!session || session !== user.id.value) {
      this.logger.warn(`Invalid refresh token for user ${user.id.value}`);
      throw new InvalidTokenException();
    }

    await this.deleteRefreshTokenFromCache(previousTokenokenHash);

    const { accessToken, refreshToken } = await this.generateTokens(user);

    const tokenHash = this.generateTokenHash(refreshToken.token);

    await this.saveRefreshTokenInCache(user, tokenHash);

    return { accessToken, refreshToken };
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

  async revokeToken(token: string) {
    const tokenHash = this.generateTokenHash(token);

    const session = await this.getRefreshTokenFromCache(tokenHash);

    if (!session) {
      throw new InvalidTokenException();
    }

    await this.deleteRefreshTokenFromCache(tokenHash);
    this.logger.log(`Revoked token for user ${session}`);
  }

  async revokeAllTokens(user: UserEntity) {
    const userTokensKey = `${REDIS_KEYS.USER_TOKENS_PREFIX}:${user.id.value}`;

    const tokens = await this.redisRepository.getMembersOfSet(userTokensKey);

    await Promise.all([
      ...tokens.map((tokenHash) => this.deleteRefreshTokenFromCache(tokenHash)),
      this.redisRepository.deleteData(userTokensKey),
    ]);

    this.logger.log(`Revoked all tokens for user ${user.id.value}`);
  }

  private generateRefreshTokenKey(tokenHash: string): string {
    return `${REDIS_KEYS.REFRESH_TOKEN_PREFIX}:${tokenHash}`;
  }

  private async saveRefreshTokenInCache(user: UserEntity, tokenHashed: string): Promise<void> {
    const key = this.generateRefreshTokenKey(tokenHashed);
    const userTokensKey = `${REDIS_KEYS.USER_TOKENS_PREFIX}:${user.id.value}`;
    const expiresAtInSeconds = this.refreshTokenExpirationAsDays * 24 * 60 * 60;

    await Promise.all([
      this.redisRepository.saveData(key, user.id.value, expiresAtInSeconds),
      this.redisRepository.addToSet(userTokensKey, tokenHashed),
      this.redisRepository.expireSet(userTokensKey, expiresAtInSeconds), // Opcional: Expirar o conjunto
    ]);
  }

  private async deleteRefreshTokenFromCache(tokenHashed: string): Promise<void> {
    const key = this.generateRefreshTokenKey(tokenHashed);
    await this.redisRepository.deleteData(key);
  }

  private async getRefreshTokenFromCache(tokenHashed: string): Promise<string | null> {
    const key = this.generateRefreshTokenKey(tokenHashed);
    const session = await this.redisRepository.getData<string>(key);

    if (!session) {
      return null;
    }

    return session;
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

    if (!hmacSecret) {
      throw new Error('HMAC_SECRET is not defined');
    }

    return createHmac('sha256', hmacSecret).update(token).digest('hex');
  }
}
