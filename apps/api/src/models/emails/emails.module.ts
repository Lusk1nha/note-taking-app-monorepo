import { Global, Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { EmailsController } from './emails.controller';

import { EmailsService } from './emails.service';
import { EmailQueueModule } from 'src/queues/email/email-queue.module';

@Global()
@Module({
  imports: [TokenModule, EmailQueueModule],
  controllers: [EmailsController],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
