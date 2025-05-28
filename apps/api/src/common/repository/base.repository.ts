import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';

interface IBaseRepository<T> {
  getDelegate(tx?: PrismaTransaction): PrismaTransaction;
  getModel(): Promise<PrismaClient[keyof PrismaClient]>;
}

@Injectable()
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected abstract readonly modelName: keyof PrismaClient;

  constructor(protected readonly prisma: PrismaService) {}

  public getDelegate(tx?: PrismaTransaction): PrismaTransaction {
    const client = tx || this.prisma;
    return client;
  }

  public async getModel() {
    const model = this.prisma[this.modelName];
    return model;
  }
}
