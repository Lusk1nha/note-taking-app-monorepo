import { Module } from '@nestjs/common';

import { CacheRedisModule } from 'src/common/redis/cache-redis.module';
import { TokenService } from './token.service';

@Module({
  imports: [CacheRedisModule],
  controllers: [],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
