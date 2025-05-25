import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/exceptions.common';

export class NoTokenProvidedException extends BaseHttpException {
  constructor() {
    super(
      {
        message: "No token provided. Please include a 'Bearer' token in the Authorization header.",
        code: 'NO_TOKEN_PROVIDED',
      },
      HttpStatus.UNAUTHORIZED,
      'NO_TOKEN_PROVIDED',
    );
  }
}

export class InvalidProvidedTokenException extends BaseHttpException {
  constructor() {
    super(
      { message: 'Invalid token', code: 'INVALID_TOKEN' },
      HttpStatus.UNAUTHORIZED,
      'INVALID_TOKEN',
    );
  }
}

export class ForbiddenResourceException extends BaseHttpException {
  constructor() {
    super(
      { message: "You don't have permission to access this resource.", code: 'FORBIDDEN_RESOURCE' },
      HttpStatus.FORBIDDEN,
      'FORBIDDEN_RESOURCE',
    );
  }
}

export class UserWithoutRoleException extends BaseHttpException {
  constructor() {
    super(
      { message: 'User does not have a role assigned', code: 'USER_WITHOUT_ROLE' },
      HttpStatus.FORBIDDEN,
      'USER_WITHOUT_ROLE',
    );
  }
}

export class UserAlreadyExistsException extends BaseHttpException {
  constructor() {
    super(
      { message: 'User already exists', code: 'USER_ALREADY_EXISTS' },
      HttpStatus.CONFLICT,
      'USER_ALREADY_EXISTS',
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

export class UserCannotLogoutAnotherUserException extends BaseHttpException {
  constructor() {
    super(
      { message: 'User cannot logout another user', code: 'USER_CANNOT_LOGOUT_ANOTHER_USER' },
      HttpStatus.FORBIDDEN,
      'USER_CANNOT_LOGOUT_ANOTHER_USER',
    );
  }
}

export class InvalidCredentialsException extends BaseHttpException {
  constructor() {
    super(
      { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
      HttpStatus.UNAUTHORIZED,
      'INVALID_CREDENTIALS',
    );
  }
}

export class NoRefreshTokenProvidedException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'No refresh token provided. Please include a refresh token in the cookies',
        code: 'NO_REFRESH_TOKEN_PROVIDED',
      },
      HttpStatus.UNAUTHORIZED,
      'NO_REFRESH_TOKEN_PROVIDED',
    );
  }
}
