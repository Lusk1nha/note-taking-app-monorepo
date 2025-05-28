import { UUID } from 'src/common/entities/uuid/uuid';

export class CreateNoteTagInput {
  noteId: UUID;
  tagId: UUID;
}
