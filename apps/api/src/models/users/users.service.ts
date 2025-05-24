import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';

import { UUID } from 'src/common/entities/uuid/uuid';
import { UserEntity } from './entity/user.entity';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';
import { UpdateUserInput } from './dto/users.patch.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserNotFoundException } from './errors/users.errors';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersRepository: UsersRepository,
    private readonly emailsService: EmailsService,
  ) {}

  async findById(id: UUID): Promise<UserEntity | null> {
    const user = await this.usersRepository.findUnique({
      id: id.value,
    });

    if (!user) {
      return null;
    }

    return new UserEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.usersRepository.findMany();
    return users.map((user) => new UserEntity(user));
  }

  async createUser(tx?: PrismaTransaction): Promise<UserEntity> {
    const userId = new UUID();

    const response = await this.usersRepository.create(
      {
        id: userId.value,
      },
      tx,
    );

    this.logger.log(`User with ID ${userId.value} created`);

    return new UserEntity(response);
  }

  async updateUser(
    userId: UUID,
    payload: UpdateUserInput,
    tx?: PrismaTransaction,
  ): Promise<UserEntity> {
    const user = await this.usersRepository.update(
      userId.value,
      {
        name: payload.name,
        image: payload.image,
      },
      tx,
    );

    if (!user) {
      throw new UserNotFoundException();
    }

    this.logger.log(`User with ID ${userId.value} updated`);
    return new UserEntity(user);
  }

  async deleteUser(userId: UUID): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await this.usersRepository.delete(userId.value, tx);
    });

    this.logger.log(`User with ID ${userId.value} deleted`);
  }
}
