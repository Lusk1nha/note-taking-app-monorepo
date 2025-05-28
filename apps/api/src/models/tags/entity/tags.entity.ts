import { Tag } from '@prisma/client';
import { UUID } from 'src/common/entities/uuid/uuid';

export class TagEntity {
  readonly id: UUID;
  readonly userId: UUID;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(data: Tag) {
    this.id = new UUID(data.id);
    this.userId = new UUID(data.userId);
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
