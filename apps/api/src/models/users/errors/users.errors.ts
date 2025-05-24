import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/exceptions.common';

export class CurrentUserNotFoundException extends BaseHttpException {
  constructor() {
    super(
      { message: 'Current user not found', code: 'CURRENT_USER_NOT_FOUND' },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'CURRENT_USER_NOT_FOUND',
    );
  }
}

export class UserNotFoundException extends BaseHttpException {
  constructor() {
    super(
      { message: 'User not found', code: 'USER_NOT_FOUND' },
      HttpStatus.NOT_FOUND,
      'USER_NOT_FOUND',
    );
  }
}
