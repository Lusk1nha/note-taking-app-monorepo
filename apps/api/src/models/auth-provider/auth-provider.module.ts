import { Module } from '@nestjs/common';
import { AuthProviderService } from './auth-provider.service';
import { AuthProviderRepository } from './auth-provider.repository';

@Module({
  controllers: [],
  providers: [AuthProviderRepository, AuthProviderService],
  exports: [AuthProviderService],
})
export class AuthProviderModule {}
