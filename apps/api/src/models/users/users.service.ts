import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';

import { UUID } from 'src/common/entities/uuid/uuid';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';

import { UpdateUserInput } from './dto/users.patch.dto';
import { UserEntity } from './entity/user.entity';
import { UserNotFoundException } from './errors/users.errors';

interface IUsersService {
  findById(id: UUID): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  createUser(tx?: PrismaTransaction): Promise<UserEntity>;
  updateUser(userId: UUID, payload: UpdateUserInput, tx?: PrismaTransaction): Promise<UserEntity>;
  deleteUser(userId: UUID): Promise<void>;
}

@Injectable()
export class UsersService implements IUsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: UsersRepository
  ) {}

  async findById(id: UUID): Promise<UserEntity | null> {
    const user = await this.repository.findUnique({
      id: id.value,
    });

    if (!user) {
      return null;
    }

    return new UserEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.repository.findMany();
    return users.map((user) => new UserEntity(user));
  }

  async createUser(tx?: PrismaTransaction): Promise<UserEntity> {
    const userId = new UUID();

    const response = await this.repository.create(
      {
        id: userId.value,
      },
      tx
    );

    this.logger.log(`User with ID ${userId.value} created`);

    return new UserEntity(response);
  }

  async updateUser(
    userId: UUID,
    payload: UpdateUserInput,
    tx?: PrismaTransaction
  ): Promise<UserEntity> {
    const user = await this.repository.update(
      userId.value,
      {
        name: payload.name,
        image: payload.image,
      },
      tx
    );

    if (!user) {
      throw new UserNotFoundException();
    }

    this.logger.log(`User with ID ${userId.value} updated`);
    return new UserEntity(user);
  }

  async deleteUser(userId: UUID): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await this.repository.delete(userId.value, tx);
    });

    this.logger.log(`User with ID ${userId.value} deleted`);
  }
}
