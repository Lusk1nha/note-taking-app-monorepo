import { BadRequestException } from '@nestjs/common'

export class Password {
	private static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
	private readonly _value: string

	constructor(password: string) {
		Password._validate(password)
		this._value = password
	}

	get value(): string {
		return this._value
	}

	public equals(other: Password): boolean {
		return this._value === other.value
	}

	public static isValid(password: string): boolean {
		try {
			this._validate(password)
			return true
		} catch {
			return false
		}
	}

	private static _validate(password: string): void {
		if (typeof password !== 'string') {
			throw new BadRequestException('Password must be a string')
		}

		if (!password) {
			throw new BadRequestException('Password cannot be empty')
		}

		if (!Password.PASSWORD_REGEX.test(password)) {
			throw new BadRequestException(
				'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
			)
		}
	}
}
