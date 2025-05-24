import { BadRequestException } from '@nestjs/common'

export class Email {
	private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	private readonly _value: string

	constructor(email: string) {
		Email._validate(email)
		this._value = Email.normalize(email)
	}

	get value(): string {
		return this._value
	}

	public equals(other: Email): boolean {
		return this._value === other.value
	}

	public static isValid(email: string): boolean {
		try {
			this._validate(email)
			return true
		} catch {
			return false
		}
	}

	private static _validate(email: string): void {
		if (typeof email !== 'string') {
			throw new BadRequestException('Email must be a string')
		}

		if (!email) {
			throw new BadRequestException('Email cannot be empty')
		}

		if (!Email.EMAIL_REGEX.test(email)) {
			throw new BadRequestException('Invalid email format')
		}
	}

	private static normalize(email: string): string {
		return email.trim().toLowerCase()
	}
}
