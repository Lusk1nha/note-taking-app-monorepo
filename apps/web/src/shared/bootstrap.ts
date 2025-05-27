import { APP_NAME } from './constants';

export function bootstrap() {
  if (!APP_NAME) {
    throw new Error('APP_NAME is not defined in the environment variables.');
  }
}
