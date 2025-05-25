import { Injectable, Logger } from '@nestjs/common';
import { Email } from 'src/common/entities/email';
import { Password } from 'src/common/entities/password/password';
import { UUID } from 'src/common/entities/uuid/uuid';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';
import { comparePassword, hashPassword } from 'src/helpers/hash';
import { CredentialsRepository } from './credentials.repository';
import { CreateCredentialsInput } from './dto/credentials.post.dto';
import { CredentialsEntity } from './entity/credentials.entity';

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

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

    const credential = await this.credentialsRepository.create(
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

    this.logger.log(`Credential with ID ${credential.id} created`);

    return new CredentialsEntity(credential);
  }

  async updatePassword(userId: UUID, password: Password): Promise<void> {
    await this.prisma.$transaction(async (tx: PrismaTransaction) => {
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

    this.logger.log(`Password for user with ID ${userId.value} updated`);
  }

  async updateEmail(userId: UUID, email: Email): Promise<void> {
    await this.prisma.$transaction(async (tx: PrismaTransaction) => {
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
