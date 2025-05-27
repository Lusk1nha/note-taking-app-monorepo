import { UserEntity } from '../entity/user.entity';

export class CurrentUserOutput {
  user: UserEntity;
}

export class AllUsersOutput {
  users: UserEntity[];
}
