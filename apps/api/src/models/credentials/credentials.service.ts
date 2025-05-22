import { Injectable } from '@nestjs/common';
import { CredentialsRepository } from './credentials.repository';
import { CreateCredentialsInput } from './dto/credentials.post.dto';
import { comparePassword, hashPassword } from 'src/helpers/hash';
import { Email } from 'src/common/entities/email';
import { CredentialsEntity } from './entity/credentials.entity';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';

@Injectable()
export class CredentialsService {
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

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
    const passwordHash = hashPassword(data.password);

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

  async validatePassword(email: Email, password: string): Promise<boolean> {
    const credentials = await this.findByEmail(email);

    if (!credentials) {
      return false;
    }

    const isValid = await comparePassword(password, credentials.passwordHash);

    return isValid;
  }
}
