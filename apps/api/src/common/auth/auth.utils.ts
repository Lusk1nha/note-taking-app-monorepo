import { Request } from 'express'

import { UserAuthType } from 'src/common/types'

import { ForbiddenResourceException } from 'src/models/auth/errors/auth.errors'
import { Role } from '../roles/roles.util'

export const checkRowLevelPermission = (
	user: UserAuthType,
	requestedUid?: string | string[],
	roles: Role[] = [Role.Admin],
) => {
	if (!requestedUid) return false

	if (!user) {
		throw new ForbiddenResourceException()
	}

	if (user.roles?.some((role) => roles.includes(role))) {
		return true
	}

	const ids = typeof requestedUid === 'string' ? [requestedUid] : requestedUid.filter(Boolean)

	if (!ids.includes(user.sub)) {
		throw new ForbiddenResourceException()
	}
}

export const extractTokenFromHeader = (request: Request): string | undefined => {
	const [type, token] = request.headers.authorization?.split(' ') ?? []
	return type === 'Bearer' ? token : undefined
}
