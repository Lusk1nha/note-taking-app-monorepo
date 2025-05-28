import { Injectable, Logger } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UUID } from 'src/common/entities/uuid/uuid';
import { NoteEntity } from './entity/notes.entity';
import { CreateNoteInput } from './dto/notes.post.dto';
import { UpdateNoteInput } from './dto/notes.patch.dto';

interface INotesService {
  getAllUserNotes(userId: UUID): Promise<NoteEntity[]>;
  getNoteById(noteId: UUID): Promise<NoteEntity | null>;
  createNote(userId: UUID, payload: CreateNoteInput): Promise<NoteEntity>;
  updateNote(noteId: UUID, payload: UpdateNoteInput): Promise<NoteEntity>;
  deleteNote(noteId: UUID): Promise<void>;
}

@Injectable()
export class NotesService implements INotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: NotesRepository
  ) {}

  async getAllUserNotes(userId: UUID): Promise<NoteEntity[]> {
    const notes = await this.repository.findMany({
      where: { userId: userId.value },
    });

    return notes.map((note) => new NoteEntity(note));
  }

  async getNoteById(noteId: UUID): Promise<NoteEntity | null> {
    const note = await this.repository.findUnique({
      id: noteId.value,
    });

    if (!note) {
      return null;
    }

    return new NoteEntity(note);
  }

  async createNote(userId: UUID, payload: CreateNoteInput): Promise<NoteEntity> {
    return this.prisma.$transaction(async (tx) => {
      const id = new UUID();
      const title = payload.title.trim();

      const note = await this.repository.create(
        {
          id: id.value,
          title,
          content: payload.content,
          user: {
            connect: {
              id: userId.value,
            },
          },
        },
        tx
      );

      this.logger.log(`Note created with ID ${id.value} for user ${userId.value}`);
      return new NoteEntity(note);
    });
  }

  async updateNote(noteId: UUID, payload: UpdateNoteInput): Promise<NoteEntity> {
    const title = payload.title.trim();

    return this.prisma.$transaction(async (tx) => {
      const updatedNote = await this.repository.update(
        {
          where: { id: noteId.value },
          data: {
            title,
            content: payload.content,
          },
        },
        tx
      );

      this.logger.log(`Note with ID ${noteId.value} updated`);
      return new NoteEntity(updatedNote);
    });
  }

  async deleteNote(noteId: UUID): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      await this.repository.delete(
        {
          id: noteId.value,
        },
        tx
      );

      this.logger.log(`Note with ID ${noteId.value} deleted`);
      return;
    });
  }
}
