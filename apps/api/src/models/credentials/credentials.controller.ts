import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { Email } from 'src/common/entities/email/email'
import { Password } from 'src/common/entities/password/password'
import { UUID } from 'src/common/entities/uuid/uuid'
import { UserAuthType } from 'src/common/types'
import { CredentialsService } from './credentials.service'
import { UpdateEmailInput, UpdateEmailOutput, UpdatePasswordInput, UpdatePasswordOutput } from './dto/credentials.post.dto'

@Controller('credentials')
@ApiTags('Credentials')
@ApiBearerAuth()
@AllowAuthenticated()
export class CredentialsController {
	constructor(private readonly credentialsService: CredentialsService) {}

	@Post('update-password')
	async update(
		@Body() payload: UpdatePasswordInput,
		@GetUser() user: UserAuthType,
	): Promise<UpdatePasswordOutput> {
		const userId = new UUID(user.sub)
		const password = new Password(payload.newPassword)

		await this.credentialsService.updatePassword(userId, password)

		return {
			message: 'Password updated successfully',
		}
	}

	@Post('update-email')
	async updateEmail(
		@Body() payload: UpdateEmailInput,
		@GetUser() user: UserAuthType,
	): Promise<UpdateEmailOutput> {
		const userId = new UUID(user.sub)
		const email = new Email(payload.newEmail)

		await this.credentialsService.updateEmail(userId, email)

		return {
			message: 'Email updated successfully',
		}
	}
}
