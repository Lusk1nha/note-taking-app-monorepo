export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
    this.message = message;
    this.stack = new Error().stack;
  }

  static USER_ALREADY_EXISTS() {
    return new AuthError('User already exists');
  }

  static USER_NOT_FOUND() {
    return new AuthError('User not found');
  }

  static INVALID_CREDENTIALS() {
    return new AuthError('Invalid credentials');
  }

  static invalidToken() {
    return new AuthError('Invalid token');
  }
}
