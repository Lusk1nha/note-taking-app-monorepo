import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsRepository } from './credentials.repository';
import { CredentialsController } from './credentials.controller';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TokenModule],

  controllers: [CredentialsController],
  providers: [CredentialsRepository, CredentialsService],
  exports: [CredentialsService],
})
export class CredentialsModule {}
