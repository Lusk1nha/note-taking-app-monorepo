import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CredentialsModule } from '../credentials/credentials.module';
import { UsersModule } from '../users/users.module';
import { AuthProviderModule } from '../auth-provider/auth-provider.module';
import { TokenModule } from '../token/token.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [CredentialsModule, UsersModule, AuthProviderModule, TokenModule],
})
export class AuthModule {}
