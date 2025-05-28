import { Injectable, Logger } from '@nestjs/common';
import { UUID } from 'src/common/entities/uuid/uuid';
import { AdminsRepository } from './admins.repository';
import { AdminEntity } from './entity/admins.entity';

interface IAdminsService {
  findAdminByUserId(id: UUID): Promise<AdminEntity | null>;
}

@Injectable()
export class AdminsService implements IAdminsService {
  private readonly logger = new Logger(AdminsService.name);

  constructor(private readonly repository: AdminsRepository) {}

  async findAdminByUserId(id: UUID): Promise<AdminEntity | null> {
    const userId = id.value;

    const admin = await this.repository.findUnique(userId);

    if (!admin) {
      return null;
    }

    this.logger.log(`Admin with ID ${userId} found`);
    return new AdminEntity(admin);
  }
}
