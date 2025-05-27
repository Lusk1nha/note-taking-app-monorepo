import { Module } from '@nestjs/common';
import { AuthProviderRepository } from './auth-provider.repository';
import { AuthProviderService } from './auth-provider.service';

@Module({
  controllers: [],
  providers: [AuthProviderRepository, AuthProviderService],
  exports: [AuthProviderService],
})
export class AuthProviderModule {}
