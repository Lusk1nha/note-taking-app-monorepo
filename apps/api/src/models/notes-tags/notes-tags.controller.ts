import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { NotesTagsService } from './notes-tags.service';
import { UserAuthType } from 'src/common/types';
import { UUIDParam } from 'src/common/entities/uuid/uuid.decorator';
import { UUID } from 'src/common/entities/uuid/uuid';
import { checkRowLevelPermission } from 'src/common/auth/auth.utils';

@Controller('notes-tags')
@ApiTags('Notes Tags')
@ApiBearerAuth()
@AllowAuthenticated()
export class NotesTagsController {
  constructor(private readonly notesTagsService: NotesTagsService) {}

  @Get(':noteId')
  async getTagsByNoteId(@GetUser() user: UserAuthType, @UUIDParam('noteId') noteId: UUID) {
    const userId = new UUID(user.sub);

    const notesTags = await this.notesTagsService.getNoteTagsByNoteId(userId, noteId);

    if (!notesTags) {
      return [];
    }

    checkRowLevelPermission(user, notesTags[0].userId.value, []);

    return notesTags;
  }

  @Get()
  async getAllUserNoteTags(@GetUser() user: UserAuthType) {
    const userId = new UUID(user.sub);

    const notesTags = await this.notesTagsService.getAllUserNoteTags(userId);

    return notesTags;
  }
}
