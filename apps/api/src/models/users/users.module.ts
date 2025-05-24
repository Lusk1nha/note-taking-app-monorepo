import { Module } from '@nestjs/common'

import { EmailsModule } from '../emails/emails.module'
import { TokenModule } from '../token/token.module'
import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

@Module({
	imports: [TokenModule, EmailsModule],
	controllers: [UsersController],
	providers: [UsersRepository, UsersService],
	exports: [UsersService],
})
export class UsersModule {}
