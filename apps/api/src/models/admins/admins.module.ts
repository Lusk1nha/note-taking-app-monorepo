import { Module } from '@nestjs/common';
import { AdminsRepository } from './admins.repository';
import { AdminsService } from './admin.service';

@Module({
  controllers: [],
  providers: [AdminsRepository, AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
