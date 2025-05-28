import { Injectable, Logger } from '@nestjs/common';

import { NotesTagsRepository } from './notes-tags.repository';
import { NoteTagEntity } from './entity/notes-tags.entity';
import { UUID } from 'src/common/entities/uuid/uuid';

import { CreateNoteTagInput } from './dto/notes-tags.post.dto';
import { PrismaTransaction } from 'src/common/prisma/prisma.type';

interface INotesTagsService {
  getAllUserNoteTags(userId: UUID): Promise<NoteTagEntity[]>;
  getNoteTagsByNoteId(userId: UUID, noteId: UUID): Promise<NoteTagEntity[]>;
  createNoteTag(
    userId: UUID,
    payload: CreateNoteTagInput,
    tx?: PrismaTransaction
  ): Promise<NoteTagEntity>;
  deleteNoteTag(noteId: UUID, tagId: UUID): Promise<void>;
}

@Injectable()
export class NotesTagsService implements INotesTagsService {
  private readonly logger = new Logger(NotesTagsService.name);

  constructor(private readonly repository: NotesTagsRepository) {}

  async getAllUserNoteTags(userId: UUID): Promise<NoteTagEntity[]> {
    const noteTags = await this.repository.findMany({
      where: { note: { userId: userId.value } },
    });

    return noteTags.map((noteTag) => new NoteTagEntity(noteTag));
  }

  async getNoteTagsByNoteId(userId: UUID, noteId: UUID): Promise<NoteTagEntity[]> {
    const noteTags = await this.repository.findMany({
      where: {
        noteId: noteId.value,
        userId: userId.value,
      },
    });

    return noteTags.map((noteTag) => new NoteTagEntity(noteTag));
  }

  async createNoteTag(userId: UUID, payload: CreateNoteTagInput): Promise<NoteTagEntity> {
    const noteTag = await this.repository.create({
      note: {
        connect: {
          id: payload.noteId.value,
        },
      },
      tag: {
        connect: {
          id: payload.tagId.value,
        },
      },
      user: {
        connect: {
          id: userId.value,
        },
      },
    });

    this.logger.log(
      `NoteTag created for note ${payload.noteId.value} and tag ${payload.tagId.value}`
    );

    return new NoteTagEntity(noteTag);
  }

  async deleteNoteTag(noteId: UUID, tagId: UUID): Promise<void> {
    await this.repository.delete({
      noteId_tagId: {
        noteId: noteId.value,
        tagId: tagId.value,
      },
    });

    this.logger.log(`NoteTag deleted for note ${noteId.value} and tag ${tagId.value}`);

    return;
  }
}
