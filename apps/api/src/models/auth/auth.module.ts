import { Module } from '@nestjs/common';
import { AuthProviderModule } from '../auth-provider/auth-provider.module';
import { CredentialsModule } from '../credentials/credentials.module';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [CredentialsModule, UsersModule, AuthProviderModule, TokenModule],
})
export class AuthModule {}
