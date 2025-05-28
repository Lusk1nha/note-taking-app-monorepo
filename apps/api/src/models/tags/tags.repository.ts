import { Prisma, Tag } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';
import { BaseRepository } from 'src/common/repository/base.repository';

export class TagsRepository extends BaseRepository<Tag> {
  protected readonly modelName = 'tag';

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findUnique(where: Prisma.TagWhereUniqueInput) {
    return this.prisma.tag.findUnique({
      where,
    });
  }

  async findMany(params?: Prisma.TagFindManyArgs) {
    return this.prisma.tag.findMany({
      ...params,
    });
  }

  async create(data: Prisma.TagCreateInput, tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);
    return client.tag.create({
      data,
    });
  }

  async delete(where: Prisma.TagWhereUniqueInput, tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);
    return client.tag.delete({
      where,
    });
  }
}
