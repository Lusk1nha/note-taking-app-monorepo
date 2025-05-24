import { Injectable, Logger } from '@nestjs/common'
import { UUID } from 'src/common/entities/uuid/uuid'
import { Role } from 'src/common/roles/roles.util'
import { AdminsService } from '../admins/admin.service'
import { UsersService } from '../users/users.service'

@Injectable()
export class RolesService {
	private readonly logger = new Logger(RolesService.name)

	constructor(
		private readonly usersService: UsersService,
		private readonly adminsService: AdminsService,
	) {}

	async getRolesByUserId(id: UUID): Promise<Role[]> {
		const userId = id.value

		const roles: Role[] = []

		const [user, admin] = await Promise.all([
			this.usersService.findById(id),
			this.adminsService.findAdminByUserId(id),
		])

		if (user) {
			roles.push(Role.User)
		}

		if (admin) {
			roles.push(Role.Admin)
		}

		if (roles.length === 0) {
			this.logger.warn(`User with ID ${userId} has no roles`)
			return []
		}

		this.logger.log(`User with ID ${userId} has roles: ${roles.join(', ')}`)
		return roles
	}
}
