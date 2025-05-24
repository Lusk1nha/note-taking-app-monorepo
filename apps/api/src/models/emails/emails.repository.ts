import { Injectable } from '@nestjs/common';
import { Email, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { BaseRepository } from 'src/common/repository/base.repository';

@Injectable()
export class EmailsRepository extends BaseRepository<Email> {
  protected readonly modelName = 'email';

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  create(data: Prisma.EmailCreateInput): Promise<Email> {
    return this.prisma.email.create({
      data,
    });
  }

  update(id: string, data: Prisma.EmailUpdateInput): Promise<Email> {
    return this.prisma.email.update({
      where: {
        id,
      },
      data,
    });
  }
}
