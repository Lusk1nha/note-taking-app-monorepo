import { Injectable, Logger } from '@nestjs/common';
import { UUID } from 'src/common/entities/uuid/uuid';
import { AdminsRepository } from './admins.repository';
import { AdminEntity } from './entity/admins.entity';

@Injectable()
export class AdminsService {
  private readonly logger = new Logger(AdminsService.name);

  constructor(private readonly adminsRepository: AdminsRepository) {}

  async findAdminByUserId(id: UUID): Promise<AdminEntity | null> {
    const userId = id.value;

    const admin = await this.adminsRepository.findUnique(userId);

    if (!admin) {
      return null;
    }

    this.logger.log(`Admin with ID ${userId} found`);
    return new AdminEntity(admin);
  }
}
