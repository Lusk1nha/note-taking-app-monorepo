import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { CredentialsController } from './credentials.controller';
import { CredentialsRepository } from './credentials.repository';
import { CredentialsService } from './credentials.service';

@Module({
  imports: [TokenModule],

  controllers: [CredentialsController],
  providers: [CredentialsRepository, CredentialsService],
  exports: [CredentialsService],
})
export class CredentialsModule {}
