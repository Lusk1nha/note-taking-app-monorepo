import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRATION, JWT_SECRET } from '../../common/constants/secrets';
import { UsersModule } from '../users/users.module';
import { CredentialsModule } from '../credentials/credentials.module';
import { AuthProviderModule } from '../auth-provider/auth-provider.module';
import { AuthModule } from '../auth/auth.module';
import { HealthModule } from '../health/health.module';

import { TokenModule } from '../token/token.module';
import { AdminsModule } from '../admins/admins.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRATION },
    }),

    HealthModule,
    UsersModule,
    CredentialsModule,
    AuthProviderModule,
    AuthModule,
    AdminsModule,
    RolesModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
