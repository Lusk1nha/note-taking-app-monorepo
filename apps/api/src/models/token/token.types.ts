import { TOKEN_TYPES } from './token.constants';

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

export interface SignedToken {
  tokenType: string;
  token: string;
  expiresIn: string | number;
}
