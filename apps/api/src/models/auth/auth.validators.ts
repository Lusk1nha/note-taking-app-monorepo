import { UUID } from 'src/common/entities/uuid/uuid';
import { UserEntity } from '../users/entity/user.entity';
import { UserCannotLogoutAnotherUserException, UserNotFoundException } from './errors/auth.errors';

export class AuthValidators {
  static validateUserOwnership(requestUserId: UUID, tokenUserId: UUID) {
    if (!requestUserId.equals(tokenUserId)) {
      throw new UserCannotLogoutAnotherUserException();
    }
  }

  static async validateExistingUser(user: UserEntity | null) {
    if (!user) throw new UserNotFoundException();
  }
}
