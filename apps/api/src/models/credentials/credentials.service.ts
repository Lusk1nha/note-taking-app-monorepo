import { Injectable, Logger } from '@nestjs/common';
import { Email } from 'src/common/entities/email/email';
import { Password } from 'src/common/entities/password/password';
import { UUID } from 'src/common/entities/uuid/uuid';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';
import { comparePassword, hashPassword } from 'src/helpers/hash';
import { CredentialsRepository } from './credentials.repository';
import { CreateCredentialsInput } from './dto/credentials.post.dto';
import { CredentialsEntity } from './entity/credentials.entity';

interface ICredentialsService {
  findByUserId(userId: UUID): Promise<CredentialsEntity[]>;
  findByEmail(email: Email): Promise<CredentialsEntity | null>;
  createCredential(
    data: CreateCredentialsInput,
    tx?: PrismaTransaction
  ): Promise<CredentialsEntity>;
  updatePassword(userId: UUID, password: Password): Promise<void>;
  updateEmail(userId: UUID, newEmail: Email): Promise<void>;
  validatePassword(email: Email, password: Password): Promise<boolean>;
}

@Injectable()
export class CredentialsService implements ICredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: CredentialsRepository
  ) {}

  async findByUserId(userId: UUID): Promise<CredentialsEntity[]> {
    const response = await this.repository.findMany({
      where: { userId: userId.value },
    });

    return response.map((credential) => new CredentialsEntity(credential));
  }

  async findByEmail(email: Email): Promise<CredentialsEntity | null> {
    const emailAsString = email.value;

    const response = await this.repository.findUnique({
      email: emailAsString,
    });

    if (!response) {
      return null;
    }

    return new CredentialsEntity(response);
  }

  async createCredential(
    data: CreateCredentialsInput,
    tx?: PrismaTransaction
  ): Promise<CredentialsEntity> {
    const userIdAsString = data.userId.value;
    const emailAsString = data.email.value;
    const passwordHash = hashPassword(data.password.value);

    const credential = await this.repository.create(
      {
        email: emailAsString,
        passwordHash,
        id: new UUID().value,
        user: {
          connect: {
            id: userIdAsString,
          },
        },
      },
      tx
    );

    this.logger.log(`Credential with ID ${credential.id} created`);

    return new CredentialsEntity(credential);
  }

  async updatePassword(userId: UUID, password: Password): Promise<void> {
    await this.prisma.$transaction(async (tx: PrismaTransaction) => {
      const credentials = await this.findByUserId(userId);

      if (credentials.length === 0) {
        this.logger.warn(`No credentials found for user with ID ${userId.value}`);
        return;
      }

      const newPasswordHash = hashPassword(password.value);
      const credential = credentials[0];

      await this.repository.update(
        {
          where: {
            id: credential.id.value,
          },
          data: {
            passwordHash: newPasswordHash,
          },
        },
        tx
      );
    });

    this.logger.log(`Password for user with ID ${userId.value} updated`);
  }

  async updateEmail(userId: UUID, newEmail: Email): Promise<void> {
    await this.prisma.$transaction(async (tx: PrismaTransaction) => {
      const credentials = await this.findByUserId(userId);

      if (credentials.length === 0) {
        this.logger.warn(`No credentials found for user with ID ${userId.value}`);
        return;
      }

      const credential = credentials[0];

      await this.repository.update(
        {
          where: {
            id: credential.id.value,
          },
          data: {
            email: newEmail.value,
          },
        },
        tx
      );
    });

    this.logger.log(`Email for user with ID ${userId.value} updated`);
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
