import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { v4 as uuidv4, validate } from 'uuid'

export class UUID {
	@ApiProperty({
		description: 'Unique identifier in UUID format',
		example: '123e4567-e89b-12d3-a456-426614174000',
		type: String,
		required: true,
	})
	private readonly _value: string

	constructor(uid?: string) {
		this._value = uid ? this.validateAndUse(uid) : this.generateNew()
	}

	get value(): string {
		return this._value
	}

	public equals(other: UUID): boolean {
		return this._value === other.value
	}

	public static generate(): UUID {
		return new UUID()
	}

	public static isValid(value: string): boolean {
		return validate(value)
	}

	private validateAndUse(uid: string): string {
		if (!UUID.isValid(uid)) {
			throw new BadRequestException('Invalid UUID format')
		}

		return uid
	}

	private generateNew(): string {
		return uuidv4()
	}
}
