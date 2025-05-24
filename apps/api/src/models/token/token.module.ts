import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenRepository } from './token.repository';

@Module({
  controllers: [],
  providers: [TokenRepository, TokenService],
  exports: [TokenService],
})
export class TokenModule {}
