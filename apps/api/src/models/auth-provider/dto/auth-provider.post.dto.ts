import { AuthProviderType } from '@prisma/client'
import { UUID } from 'src/common/entities/uuid/uuid'

export class CreateAuthProviderInput {
	userId: UUID
	providerType: AuthProviderType
}
