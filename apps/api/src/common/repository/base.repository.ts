import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';

@Injectable()
export abstract class BaseRepository<T> {
  protected abstract readonly modelName: keyof PrismaClient;

  constructor(protected readonly prisma: PrismaService) {}

  protected getDelegate(tx?: PrismaTransaction): PrismaTransaction {
    const client = tx || this.prisma;
    return client;
  }

  protected async getModel() {
    const model = this.prisma[this.modelName];
    return model;
  }
}
