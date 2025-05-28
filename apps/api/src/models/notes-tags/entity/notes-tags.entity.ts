import { NoteTag } from '@prisma/client';
import { UUID } from 'src/common/entities/uuid/uuid';

export class NoteTagEntity {
  readonly noteId: UUID;
  readonly tagId: UUID;
  readonly userId: UUID;
  readonly createdAt: Date;

  constructor(data: NoteTag) {
    this.noteId = new UUID(data.noteId);
    this.tagId = new UUID(data.tagId);
    this.userId = new UUID(data.userId);
    this.createdAt = data.createdAt;
  }
}
