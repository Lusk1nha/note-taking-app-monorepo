import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/exceptions.utils';

export class TagNotFoundException extends BaseHttpException {
  constructor(tagId: string) {
    super(
      {
        message: `Tag with ID ${tagId} not found`,
        code: 'TAG_NOT_FOUND',
      },
      HttpStatus.NOT_FOUND,
      'TAG_NOT_FOUND'
    );
  }
}
