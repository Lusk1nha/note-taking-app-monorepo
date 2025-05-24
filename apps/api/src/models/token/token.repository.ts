import { Injectable } from '@nestjs/common'
import { Prisma, Session } from '@prisma/client'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { BaseRepository } from 'src/common/repository/base.repository'

@Injectable()
export class TokenRepository extends BaseRepository<Session> {
	protected readonly modelName = 'session'

	constructor(protected readonly prisma: PrismaService) {
		super(prisma)
	}

	async findUnique(where: Prisma.SessionWhereUniqueInput) {
		return this.prisma.session.findUnique({
			where,
		})
	}

	async create(data: Prisma.SessionCreateInput, tx?: Prisma.TransactionClient) {
		const client = this.getDelegate(tx)
		return client.session.create({
			data,
		})
	}

	async update(params: Prisma.SessionUpdateArgs, tx?: Prisma.TransactionClient) {
		const client = this.getDelegate(tx)
		return client.session.update(params)
	}
}
