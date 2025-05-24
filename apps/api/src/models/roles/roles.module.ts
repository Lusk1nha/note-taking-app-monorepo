import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AdminsModule } from '../admins/admins.module';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TokenModule } from '../token/token.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
  imports: [TokenModule, UsersModule, AdminsModule],
})
export class RolesModule {}
