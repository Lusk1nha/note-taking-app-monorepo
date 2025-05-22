import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';
import { BaseRepository } from 'src/common/repository/base.repository';

@Injectable()
export class CredentialsRepository extends BaseRepository<Credential> {
  protected readonly modelName = 'credential';

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findUnique(where: Prisma.CredentialWhereUniqueInput) {
    return this.prisma.credential.findUnique({
      where,
    });
  }

  async create(data: Prisma.CredentialCreateInput, tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);
    return client.credential.create({
      data,
    });
  }
}
