import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsRepository } from './credentials.repository';

@Module({
  controllers: [],
  providers: [CredentialsRepository, CredentialsService],
  exports: [CredentialsService],
})
export class CredentialsModule {}
