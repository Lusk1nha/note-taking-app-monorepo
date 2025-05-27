import { Module } from '@nestjs/common';
import { AdminsService } from './admin.service';
import { AdminsRepository } from './admins.repository';

@Module({
  controllers: [],
  providers: [AdminsRepository, AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
