import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/exceptions.utils';

export class NoteNotFoundException extends BaseHttpException {
  constructor(noteId: string) {
    super(
      {
        message: `Note with ID ${noteId} not found`,
        code: 'NOTE_NOT_FOUND',
      },
      HttpStatus.NOT_FOUND,
      'NOTE_NOT_FOUND'
    );
  }
}
