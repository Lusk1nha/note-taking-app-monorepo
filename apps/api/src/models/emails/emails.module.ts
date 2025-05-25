import { Global, Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { EmailsController } from './emails.controller';
import { EmailsRepository } from './emails.repository';
import { EmailsService } from './emails.service';

@Global()
@Module({
  imports: [TokenModule],
  controllers: [EmailsController],
  providers: [EmailsRepository, EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
