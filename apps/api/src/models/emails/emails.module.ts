import { Global, Module } from '@nestjs/common';
import { EmailsRepository } from './emails.repository';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { TokenModule } from '../token/token.module';

@Global()
@Module({
  imports: [TokenModule],
  controllers: [EmailsController],
  providers: [EmailsRepository, EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
