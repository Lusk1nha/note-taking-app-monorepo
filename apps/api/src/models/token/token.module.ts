import { Module } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import { TokenService } from './token.service';

@Module({
  controllers: [],
  providers: [TokenRepository, TokenService],
  exports: [TokenService],
})
export class TokenModule {}
