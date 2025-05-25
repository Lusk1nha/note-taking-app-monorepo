import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class TokenEntity {
	@ApiProperty({
		description: 'Access token for authentication',
	})
	token: string

	@ApiProperty({
		description: 'Token type',
	})
	tokenType: string

	@ApiProperty({
		description: 'Token expiration time in seconds',
	})
	@IsNumber()
	expiresIn: string | number
}
