import { Injectable } from '@nestjs/common';
import { NoteTag, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';
import { BaseRepository } from 'src/common/repository/base.repository';

@Injectable()
export class NotesTagsRepository extends BaseRepository<NoteTag> {
  protected readonly modelName = 'noteTag';

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findUnique(where: Prisma.NoteTagWhereUniqueInput) {
    return this.prisma.noteTag.findUnique({
      where,
    });
  }

  async findMany(params?: Prisma.NoteTagFindManyArgs) {
    return this.prisma.noteTag.findMany({
      ...params,
    });
  }

  async create(data: Prisma.NoteTagCreateInput, tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);
    return client.noteTag.create({
      data,
    });
  }

  async createMany(data: Prisma.NoteTagCreateManyInput[], tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);
    return client.noteTag.createMany({
      data,
    });
  }

  async delete(where: Prisma.NoteTagWhereUniqueInput, tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);
    return client.noteTag.delete({
      where,
    });
  }
}
