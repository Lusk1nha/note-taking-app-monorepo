import { Email } from 'src/common/entities/email';
import { UUID } from 'src/common/entities/uuid/uuid';

export class CreateCredentialsInput {
  userId: UUID;
  email: Email;
  password: string;
}
