import { CreateUserAuthType } from 'src/common/types';
import { UserEntity } from 'src/models/users/entity/user.entity';

export function createJWTPayload(user: UserEntity): CreateUserAuthType {
  const payload: CreateUserAuthType = {
    iss: 'api',
    aud: 'web',
    iat: Math.floor(Date.now() / 1000),
    sub: user.id.value,
  };

  return payload;
}
