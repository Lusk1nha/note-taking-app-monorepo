import { Injectable } from '@nestjs/common';
import { CredentialsRepository } from './credentials.repository';
import { CreateCredentialsInput } from './dto/credentials.post.dto';
import { comparePassword, hashPassword } from 'src/helpers/hash';
import { Email } from 'src/common/entities/email';
import { CredentialsEntity } from './entity/credentials.entity';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';
import { UUID } from 'src/common/entities/uuid/uuid';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Password } from 'src/common/entities/password/password';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly credentialsRepository: CredentialsRepository,
  ) {}

  async findByEmail(email: Email): Promise<CredentialsEntity | null> {
    const emailAsString = email.value;

    const response = await this.credentialsRepository.findUnique({
      email: emailAsString,
    });

    if (!response) {
      return null;
    }

    return new CredentialsEntity(response);
  }

  async createCredential(
    data: CreateCredentialsInput,
    tx?: PrismaTransaction,
  ): Promise<CredentialsEntity> {
    const userIdAsString = data.userId.value;
    const emailAsString = data.email.value;
    const passwordHash = hashPassword(data.password.value);

    const response = await this.credentialsRepository.create(
      {
        email: emailAsString,
        passwordHash,
        user: {
          connect: {
            id: userIdAsString,
          },
        },
      },
      tx,
    );

    return new CredentialsEntity(response);
  }

  async updatePassword(userId: UUID, password: Password): Promise<void> {
    return await this.prisma.$transaction(async (tx: PrismaTransaction) => {
      const id = userId.value;
      const newPasswordHash = hashPassword(password.value);

      await this.credentialsRepository.update(
        {
          where: {
            id,
          },
          data: {
            passwordHash: newPasswordHash,
          },
        },
        tx,
      );
    });
  }

  async updateEmail(userId: UUID, email: Email): Promise<void> {
    return await this.prisma.$transaction(async (tx: PrismaTransaction) => {
      const id = userId.value;
      const emailAsString = email.value;

      await this.credentialsRepository.update(
        {
          where: {
            id,
          },
          data: {
            email: emailAsString,
          },
        },
        tx,
      );
    });
  }

  async validatePassword(email: Email, password: Password): Promise<boolean> {
    const credentials = await this.findByEmail(email);

    if (!credentials) {
      return false;
    }

    const isValid = await comparePassword(password.value, credentials.passwordHash);

    return isValid;
  }
}
