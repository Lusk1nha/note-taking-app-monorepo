import { HttpStatus } from '@nestjs/common'
import { BaseHttpException } from 'src/common/exceptions/exceptions.common'

export class InvalidJwtConfigException extends BaseHttpException {
	constructor() {
		super(
			{ message: 'User already exists', code: 'USER_ALREADY_EXISTS' },
			HttpStatus.CONFLICT,
			'USER_ALREADY_EXISTS',
		)
	}
}

export class InvalidTokenException extends BaseHttpException {
	constructor() {
		super(
			{ message: 'Invalid token', code: 'INVALID_TOKEN' },
			HttpStatus.UNAUTHORIZED,
			'INVALID_TOKEN',
		)
	}
}

export class TokenExpiredException extends BaseHttpException {
	constructor() {
		super(
			{ message: 'Token expired', code: 'TOKEN_EXPIRED' },
			HttpStatus.UNAUTHORIZED,
			'TOKEN_EXPIRED',
		)
	}
}
