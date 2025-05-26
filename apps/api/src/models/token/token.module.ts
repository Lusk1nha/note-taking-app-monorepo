import { Module } from '@nestjs/common';

import { TokenService } from './token.service';
import { CacheRedisModule } from 'src/common/redis/cache-redis.module';

@Module({
  imports: [CacheRedisModule],
  controllers: [],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
