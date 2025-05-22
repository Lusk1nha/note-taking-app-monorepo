import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';
import { BaseRepository } from 'src/common/repository/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  protected readonly modelName = 'user';

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findUnique(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const client = this.getDelegate();

    return client.user.findUnique({
      where,
    });
  }

  async create(data: Prisma.UserCreateInput, tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);

    return client.user.create({
      data,
    });
  }
}
