import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class BaseHttpException extends HttpException {
  constructor(
    response: string | Record<string, any>,
    status: HttpStatus,
    private readonly code: string
  ) {
    super(response, status);
  }

  getCode(): string {
    return this.code;
  }
}
