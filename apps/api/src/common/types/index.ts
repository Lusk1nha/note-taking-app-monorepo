import { Role } from '../roles/roles.util'

export type JWTDefaultValues = {
	iss: string
	aud: string
	iat: number
	exp: number
	sub: string
}

export interface CreateUserAuthType extends Omit<JWTDefaultValues, 'exp'> {
	name?: string
}

export interface UserAuthType extends JWTDefaultValues {
	name?: string
	roles: Role[]
}
