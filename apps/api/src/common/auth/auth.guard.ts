import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { extractTokenFromHeader } from './auth.utils';
import { Request } from 'express';

import { Reflector } from '@nestjs/core';

import { PrismaService } from '../prisma/prisma.service';
import { UserAuthType } from '../types';
import { Role } from '../roles/roles.util';
import {
  InvalidProvidedTokenException,
  NoTokenProvidedException,
} from 'src/models/auth/errors/auth.errors';
import { TokenService } from 'src/models/token/token.service';

export type RequestWithUser = Request & { user: UserAuthType & { roles: Role[] } };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    try {
      await this._authenticateUser(request);
      return this._authorizeUser(request, context);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  private async _authenticateUser(request: Request): Promise<void> {
    const token = extractTokenFromHeader(request);

    if (!token) {
      throw new NoTokenProvidedException();
    }

    try {
      const payload = await this.tokenService.decodeAccessToken(token);
      request['user'] = payload;
    } catch {
      throw new InvalidProvidedTokenException();
    }
  }

  private async _authorizeUser(
    request: RequestWithUser,
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredRoles = this._getMetadata<Role[]>('roles', context);
    const userRoles = await this._getUserRoles(request.user.sub);

    request.user.roles = userRoles;

    if (!userRoles || userRoles.length === 0) {
      throw new UnauthorizedException("User doesn't have any roles assigned.");
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    return requiredRoles.some((role) => userRoles.includes(role));
  }

  private _getMetadata<T>(key: string, context: ExecutionContext): T {
    return this.reflector.getAllAndOverride<T>(key, [context.getHandler(), context.getClass()]);
  }

  private async _getUserRoles(id: string): Promise<Role[]> {
    const roles: Role[] = [];

    const [admin, user] = await Promise.all([
      this.prisma.admin.findUnique({ where: { id } }),
      this.prisma.user.findUnique({ where: { id } }),
    ]);

    admin && roles.push(Role.Admin);
    user && roles.push(Role.User);

    return roles;
  }
}
