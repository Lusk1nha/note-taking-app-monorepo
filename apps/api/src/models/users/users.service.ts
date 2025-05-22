import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

import { UUID } from 'src/common/entities/uuid/uuid';
import { UserEntity } from './entity/user.entity';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: UUID): Promise<UserEntity | null> {
    const user = await this.usersRepository.findUnique({
      id: id.value,
    });

    if (!user) {
      return null;
    }

    return new UserEntity(user);
  }

  async createUser(tx?: PrismaTransaction): Promise<UserEntity> {
    const userId = new UUID();

    const response = await this.usersRepository.create(
      {
        id: userId.value,
      },
      tx,
    );

    return new UserEntity(response);
  }
}
