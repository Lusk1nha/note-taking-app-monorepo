import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { NotesService } from './notes.service';
import { UserAuthType } from 'src/common/types';
import { UUID } from 'src/common/entities/uuid/uuid';
import { UUIDParam } from 'src/common/entities/uuid/uuid.decorator';
import { NoteNotFoundException } from './errors/notes.errors';
import { NoteEntity } from './entity/notes.entity';
import { AllNotesOutput } from './dto/notes.get.dto';
import { CreateNoteInput } from './dto/notes.post.dto';
import { checkRowLevelPermission } from 'src/common/auth/auth.utils';

@Controller('notes')
@ApiTags('Notes')
@ApiBearerAuth()
@AllowAuthenticated()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all notes',
    description: 'Retrieve all notes for the authenticated user',
  })
  async getAllNotes(@GetUser() user: UserAuthType): Promise<AllNotesOutput> {
    const userId = new UUID(user.sub);

    const notes = await this.notesService.getAllUserNotes(userId);

    return {
      notes,
      totalCount: notes.length,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get note by ID',
    description: 'Retrieve a specific note by its ID for the authenticated user',
  })
  async getNoteById(
    @GetUser() currentUser: UserAuthType,
    @UUIDParam('id') noteId: UUID
  ): Promise<NoteEntity> {
    const note = await this.notesService.getNoteById(noteId);

    if (!note) {
      throw new NoteNotFoundException(noteId.value);
    }

    checkRowLevelPermission(currentUser, note.userId.value, []);

    return note;
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new note',
    description: 'Create a new note for the authenticated user',
  })
  async createNote(
    @GetUser() user: UserAuthType,
    @Body() payload: CreateNoteInput
  ): Promise<NoteEntity> {
    const userId = new UUID(user.sub);
    return this.notesService.createNote(userId, payload);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a note',
    description: 'Update an existing note by its ID for the authenticated user',
  })
  async updateNote(
    @UUIDParam('id') noteId: UUID,
    @GetUser() currentUser: UserAuthType,
    @Body() payload: CreateNoteInput
  ): Promise<NoteEntity> {
    const existingNote = await this.notesService.getNoteById(noteId);

    if (!existingNote) {
      throw new NoteNotFoundException(noteId.value);
    }

    checkRowLevelPermission(currentUser, existingNote.userId.value, []);

    return this.notesService.updateNote(noteId, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a note',
    description: 'Delete an existing note by its ID for the authenticated user',
  })
  async deleteNote(
    @UUIDParam('id') noteId: UUID,
    @GetUser() currentUser: UserAuthType
  ): Promise<void> {
    const existingNote = await this.notesService.getNoteById(noteId);

    if (!existingNote) {
      throw new NoteNotFoundException(noteId.value);
    }

    checkRowLevelPermission(currentUser, existingNote.userId.value, []);

    await this.notesService.deleteNote(noteId);
  }
}
