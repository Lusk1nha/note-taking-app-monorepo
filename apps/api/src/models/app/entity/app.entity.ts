import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class AppEntity {
	@ApiProperty({
		description: 'API name',
		example: 'API to manage your notes',
	})
	@IsString()
	title: String

	@ApiProperty({
		description: 'API description',
		example: 'This is the API service for the application.',
	})
	@IsString()
	description: String

	@ApiProperty({
		description: 'API authors',
		example: ['Author name <Author>'],
	})
	@IsArray()
	@IsString({ each: true })
	authors: String[]

	@ApiProperty({
		description: 'API version',
		example: '1.0.0',
	})
	@IsString()
	version: String
}
