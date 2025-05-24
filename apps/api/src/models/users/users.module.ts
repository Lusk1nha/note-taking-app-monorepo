import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { TokenModule } from '../token/token.module';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [TokenModule, EmailsModule],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
