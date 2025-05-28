import { Injectable } from '@nestjs/common';
import { Note, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';
import { BaseRepository } from 'src/common/repository/base.repository';

@Injectable()
export class NotesRepository extends BaseRepository<Note> {
  protected readonly modelName = 'note';

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findUnique(where: Prisma.NoteWhereUniqueInput) {
    return this.prisma.note.findUnique({
      where,
    });
  }

  async findMany(params?: Prisma.NoteFindManyArgs) {
    return this.prisma.note.findMany({
      ...params,
    });
  }

  async create(data: Prisma.NoteCreateInput, tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);
    return client.note.create({
      data,
    });
  }

  async update(params: Prisma.NoteUpdateArgs, tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);
    return client.note.update(params);
  }

  async delete(where: Prisma.NoteWhereUniqueInput, tx?: PrismaTransaction) {
    const client = this.getDelegate(tx);
    return client.note.delete({
      where,
    });
  }
}
