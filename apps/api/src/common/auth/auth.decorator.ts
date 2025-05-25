import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from '@nestjs/common'
import { Role } from '../roles/roles.util'
import { AuthGuard } from './auth.guard'

export const AllowAuthenticated = (...roles: Role[]) => applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard))

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest()

	const user = request.user

	if (!user) {
		throw new Error('User not found in request')
	}

	return user
})
