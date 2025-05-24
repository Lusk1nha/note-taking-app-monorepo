import { Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { BaseRepository } from 'src/common/repository/base.repository';

@Injectable()
export class AdminsRepository extends BaseRepository<Admin> {
  protected readonly modelName = 'admin';

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findUnique(id: string) {
    return this.prisma.admin.findUnique({
      where: {
        id,
      },
    });
  }
}
