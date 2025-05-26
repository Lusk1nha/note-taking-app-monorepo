import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheRedisRepository {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async saveData(key: string, data: string, ttl = 180): Promise<void> {
    await this.redisClient.set(key, data, 'EX', ttl);
  }

  async addToSet(key: string, member: string): Promise<void> {
    await this.redisClient.sadd(key, member);
  }

  async expireSet(key: string, ttl: number): Promise<void> {
    await this.redisClient.expire(key, ttl);
  }

  async getData<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);

    if (!data) {
      return null;
    }

    return data as T;
  }

  async getMembersOfSet(key: string): Promise<string[]> {
    const members = await this.redisClient.smembers(key);
    return members;
  }

  async deleteData(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
