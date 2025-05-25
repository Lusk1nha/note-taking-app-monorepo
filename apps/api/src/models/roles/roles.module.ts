import { Global, Module } from '@nestjs/common'
import { AdminsModule } from '../admins/admins.module'
import { TokenModule } from '../token/token.module'
import { UsersModule } from '../users/users.module'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'

@Global()
@Module({
	controllers: [RolesController],
	providers: [RolesService],
	exports: [RolesService],
	imports: [TokenModule, UsersModule, AdminsModule],
})
export class RolesModule {}
