import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createJWTPayload } from 'src/helpers/jwt';
import { UserEntity } from '../users/entity/user.entity';

import { InvalidTokenException, MissingSecretException } from './errors/token.errors';

import { createHmac } from 'crypto';
import { CacheRedisRepository } from 'src/common/redis/cache-redis.repository';
import { REDIS_KEYS, TOKEN_CONFIG_KEYS, TOKEN_TYPES } from './token.constants';
import { SignedToken, TokenType } from './token.types';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly refreshTokenExpirationInSeconds: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisRepository: CacheRedisRepository
  ) {
    this.refreshTokenExpirationInSeconds = this.getRefreshTokenExpiration();
  }

  async generateToken(user: UserEntity) {
    const tokens = await this.generateTokens(user);
    const tokenHash = this.generateTokenHash(tokens.refreshToken.token);

    await this.saveRefreshToken(user, tokenHash);
    return tokens;
  }

  async revalidateRefreshToken(user: UserEntity, previousToken: string) {
    return this.handleTokenOperation('revalidation', previousToken, async (tokenHash) => {
      await this.validateTokenOwnership(user, tokenHash);
      await this.deleteRefreshToken(tokenHash);

      const newTokens = await this.generateTokens(user);
      const newTokenHash = this.generateTokenHash(newTokens.refreshToken.token);

      await this.saveRefreshToken(user, newTokenHash);
      return newTokens;
    });
  }

  async revokeToken(token: string): Promise<void> {
    return this.handleTokenOperation('revocation', token, async (tokenHash) => {
      await this.deleteRefreshToken(tokenHash);
    });
  }

  async revokeAllTokens(user: UserEntity): Promise<void> {
    const userTokensKey = this.getUserTokensKey(user.id.value);
    const tokenHashes = await this.redisRepository.getMembersOfSet(userTokensKey);

    await Promise.all([
      ...tokenHashes.map((hash) => this.deleteRefreshToken(hash)),
      this.redisRepository.deleteData(userTokensKey),
    ]);

    this.logger.log(`Revoked all tokens for user ${user.id.value}`);
  }

  async validateAccessToken(token: string) {
    return this.validateToken(token, TOKEN_CONFIG_KEYS.SECRET);
  }

  async validateRefreshToken(token: string) {
    return this.validateToken(token, TOKEN_CONFIG_KEYS.REFRESH_SECRET);
  }

  private async validateToken(token: string, secretKey: string) {
    try {
      const secret = this.getSecret(secretKey);
      return await this.jwtService.verifyAsync(token, { secret, algorithms: ['HS256'] });
    } catch (error) {
      this.logger.error(`Token validation failed for ${secretKey}`, error.stack);
      throw new InvalidTokenException();
    }
  }

  private async validateTokenOwnership(user: UserEntity, tokenHash: string) {
    const storedUserId = await this.getRefreshTokenFromCache(tokenHash);

    if (storedUserId !== user.id.value) {
      this.logger.warn(`Token ownership validation failed for user ${user.id.value}`);
      throw new InvalidTokenException();
    }
  }

  private generateRefreshTokenKey(tokenHash: string): string {
    return `${REDIS_KEYS.REFRESH_TOKEN_PREFIX}${tokenHash}`;
  }

  private async saveRefreshToken(user: UserEntity, tokenHash: string) {
    const refreshTokenKey = this.getRefreshTokenKey(tokenHash);
    const userTokensKey = this.getUserTokensKey(user.id.value);

    await Promise.all([
      this.redisRepository.saveData(
        refreshTokenKey,
        user.id.value,
        this.refreshTokenExpirationInSeconds
      ),
      this.redisRepository.addToSet(userTokensKey, tokenHash),
      this.redisRepository.expireKey(userTokensKey, this.refreshTokenExpirationInSeconds),
    ]);

    this.logger.log(`Saved refresh token for user ${user.id.value}`);
  }

  private async deleteRefreshToken(tokenHashed: string): Promise<void> {
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
      this.createToken(user, TOKEN_TYPES.ACCESS),
      this.createToken(user, TOKEN_TYPES.REFRESH),
    ]);

    return { accessToken, refreshToken };
  }

  private getRefreshTokenKey(tokenHash: string): string {
    return `${REDIS_KEYS.REFRESH_TOKEN_PREFIX}${tokenHash}`;
  }

  private getUserTokensKey(userId: string): string {
    return `${REDIS_KEYS.USER_TOKENS_PREFIX}${userId}`;
  }

  private generateTokenHash(token: string): string {
    const hmacSecret = this.getSecret(TOKEN_CONFIG_KEYS.HMAC_SECRET);
    return createHmac('sha256', hmacSecret).update(token).digest('hex');
  }

  private getSecret(key: string): string {
    const secret = this.configService.get<string>(key);
    if (!secret) throw new MissingSecretException(key);
    return secret;
  }

  private getRefreshTokenExpiration(): number {
    const days = Number(this.configService.get(TOKEN_CONFIG_KEYS.REFRESH_EXPIRATION));
    return days * 24 * 60 * 60;
  }

  private async handleTokenOperation<T>(
    operation: string,
    token: string,
    handler: (tokenHash: string) => Promise<T>
  ): Promise<T> {
    const tokenHash = this.generateTokenHash(token);

    try {
      return await handler(tokenHash);
    } catch (error) {
      this.logger.error(`Failed ${operation} for token hash: ${tokenHash}`, error.stack);
      throw new InvalidTokenException();
    }
  }

  private async createToken(user: UserEntity, type: TokenType): Promise<SignedToken> {
    const secretKey =
      type === TOKEN_TYPES.ACCESS ? TOKEN_CONFIG_KEYS.SECRET : TOKEN_CONFIG_KEYS.REFRESH_SECRET;

    const expiresIn = type === TOKEN_TYPES.ACCESS ? '15m' : '7d';
    const payload = createJWTPayload(user);
    const token = await this.jwtService.signAsync(payload, {
      secret: this.getSecret(secretKey),
      expiresIn,
      algorithm: 'HS256',
    });

    return {
      tokenType: 'Bearer',
      token,
      expiresIn,
    };
  }
}
