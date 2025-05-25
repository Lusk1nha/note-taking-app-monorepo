import { ApiProperty } from '@nestjs/swagger'
import { Credential } from '@prisma/client'
import { IsDate, IsEmail, IsString } from 'class-validator'
import { Email } from 'src/common/entities/email'
import { UUID } from 'src/common/entities/uuid/uuid'

export class CredentialsEntity {
	constructor(credential: Credential) {
		this.id = new UUID(credential.id)
		this.email = new Email(credential.email)
		this.passwordHash = credential.passwordHash
		this.createdAt = credential.createdAt
		this.updatedAt = credential.updatedAt
	}

	@ApiProperty()
	id: UUID

	@ApiProperty()
	@IsEmail()
	email: Email

	@ApiProperty()
	@IsString()
	passwordHash: string

	@ApiProperty()
	@IsDate()
	createdAt: Date

	@ApiProperty()
	@IsDate()
	updatedAt: Date
}
