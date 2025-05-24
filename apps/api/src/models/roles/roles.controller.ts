import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RolesService } from './roles.service'

import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { checkRowLevelPermission } from 'src/common/auth/auth.utils'
import { UUID } from 'src/common/entities/uuid/uuid'
import { UUIDParam } from 'src/common/entities/uuid/uuid.decorator'
import { UserAuthType } from 'src/common/types'
import { UserNotFoundException } from '../users/errors/users.errors'
import { UsersService } from '../users/users.service'
import { GetCurrentUserOutput, GetRolesByUserIdOutput } from './dto/roles.get.dto'

@Controller('roles')
@ApiTags('Roles')
@ApiBearerAuth()
@AllowAuthenticated()
export class RolesController {
	constructor(
		private readonly usersService: UsersService,
		private readonly rolesService: RolesService,
	) {}

	@Get('me')
	@ApiOperation({
		summary: 'Get current user roles',
		description: 'Get the roles of the current authenticated user',
	})
	async getCurrentUserRoles(@GetUser() currentUser: UserAuthType): Promise<GetCurrentUserOutput> {
		const userId = new UUID(currentUser.sub)
		const roles = await this.rolesService.getRolesByUserId(userId)

		return {
			roles,
		}
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Get user roles by ID',
		description: 'Get the roles of a user by their ID',
	})
	async getUserRolesById(
		@UUIDParam('id') id: UUID,
		@GetUser() currentUser: UserAuthType,
	): Promise<GetRolesByUserIdOutput> {
		const user = await this.usersService.findById(id)

		if (!user) {
			throw new UserNotFoundException()
		}

		checkRowLevelPermission(currentUser, user.id.value)

		const roles = await this.rolesService.getRolesByUserId(id)

		return {
			roles,
			userId: id,
		}
	}
}
