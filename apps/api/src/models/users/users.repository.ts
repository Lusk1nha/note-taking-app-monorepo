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

  async findMany(
    where?: Prisma.UserWhereInput,
    orderBy?: Prisma.UserOrderByWithRelationInput,
    skip?: number,
    take?: number
  ): Promise<User[]> {
    const client = this.getDelegate();

    return client.user.findMany({
      where,
      orderBy,
      skip,
      take,
    });
  }

  async create(data: Prisma.UserCreateInput, tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);

    return client.user.create({
      data,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput, tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);

    return client.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string, tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);

    return client.user.delete({
      where: {
        id,
      },
    });
  }
}
