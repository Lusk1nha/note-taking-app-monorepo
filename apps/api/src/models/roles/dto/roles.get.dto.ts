import { ApiProperty } from '@nestjs/swagger'

import { UUID } from 'src/common/entities/uuid/uuid'
import { Role } from 'src/common/roles/roles.util'

export class GetCurrentUserOutput {
	@ApiProperty({
		description: 'List of roles assigned to the current user',
		type: [String],
		enum: Object.values(Role),
		example: [Role.User, Role.Admin],
	})
	roles: Role[]
}

export class GetRolesByUserIdOutput {
	@ApiProperty({
		description: 'List of roles assigned to the user with the specified ID',
		type: [String],
		enum: Object.values(Role),
		example: [Role.User, Role.Admin],
	})
	roles: Role[]

	@ApiProperty({
		description: 'The ID of the user whose roles are being retrieved',
	})
	userId: UUID
}
