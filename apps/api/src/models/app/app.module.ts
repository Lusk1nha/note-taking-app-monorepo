import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '../../common/prisma/prisma.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { AuthProviderModule } from '../auth-provider/auth-provider.module'
import { AuthModule } from '../auth/auth.module'
import { CredentialsModule } from '../credentials/credentials.module'
import { HealthModule } from '../health/health.module'
import { UsersModule } from '../users/users.module'

import { MailerModule } from '@nestjs-modules/mailer'
import { AdminsModule } from '../admins/admins.module'
import { EmailsModule } from '../emails/emails.module'
import { RolesModule } from '../roles/roles.module'
import { TokenModule } from '../token/token.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MailerModule.forRoot({
			transport: {
				host: process.env.EMAIL_HOST,
				port: Number(process.env.EMAIL_PORT),
				auth: {
					user: process.env.EMAIL_USERNAME,
					pass: process.env.EMAIL_PASSWORD,
				},
			},
		}),

		PrismaModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.JWT_EXPIRATION },
		}),

		HealthModule,
		UsersModule,
		CredentialsModule,
		AuthProviderModule,
		AuthModule,
		AdminsModule,
		RolesModule,
		EmailsModule,
		TokenModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
