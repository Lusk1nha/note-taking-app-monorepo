import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { TokenEntity } from 'src/models/token/entity/token.entity'

import { UserEntity } from 'src/models/users/entity/user.entity'

export class RegisterRequestInput {
	@ApiProperty({
		description: "User's email address",
		example: 'user@example.com',
	})
	@IsEmail()
	@Transform(({ value }) => value.toLowerCase().trim())
	email: string

	@ApiProperty({
		description: "User's password",
		minLength: 8,
		example: 'verysecurepassword',
	})
	@IsString()
	@MinLength(8)
	password: string
}

export class RegisterResponseOutput {
	@ApiProperty({
		description: 'Register response message',
	})
	message: string

	@ApiProperty({
		description: 'User properties',
	})
	user: UserEntity
}

export class LoginRequestInput {
	@ApiProperty({
		description: "User's email address",
	})
	@IsEmail()
	@Transform(({ value }) => value.toLowerCase().trim())
	email: string

	@ApiProperty({
		description: "User's password",
	})
	@IsString()
	@IsNotEmpty()
	password: string
}

export class RevalidateTokenRequestInput {
	@ApiProperty({
		description: 'Refresh token for revalidation',
	})
	@IsString()
	@IsNotEmpty()
	refreshToken: string
}
