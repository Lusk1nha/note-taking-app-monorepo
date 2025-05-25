import { Injectable } from '@nestjs/common'
import { AuthProvider, Prisma } from '@prisma/client'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { PrismaTransaction } from 'src/common/prisma/prisma.type'
import { BaseRepository } from 'src/common/repository/base.repository'

@Injectable()
export class AuthProviderRepository extends BaseRepository<AuthProvider> {
	protected readonly modelName = 'authProvider'

	constructor(protected readonly prisma: PrismaService) {
		super(prisma)
	}

	async create(data: Prisma.AuthProviderCreateInput, tx?: PrismaTransaction) {
		const client = this.getDelegate(tx)

		return client.authProvider.create({
			data,
		})
	}
}
