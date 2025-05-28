import { UUID } from 'src/common/entities/uuid/uuid';

export class GetNoteTagByIdInput {
  noteId: UUID;
  tagId: UUID;
}
