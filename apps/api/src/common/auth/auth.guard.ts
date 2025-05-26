import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { Request } from 'express';
import { extractTokenFromHeader } from './auth.utils';

import { Reflector } from '@nestjs/core';

import {
  InvalidProvidedTokenException,
  NoTokenProvidedException,
  UserWithoutRoleException,
} from 'src/models/auth/errors/auth.errors';
import { RolesService } from 'src/models/roles/roles.service';
import { TokenService } from 'src/models/token/token.service';
import { UUID } from '../entities/uuid/uuid';
import { Role } from '../roles/roles.util';
import { UserAuthType } from '../types';

export type AuthExtensions = { user: UserAuthType & { roles: Role[] } };
export type RequestWithAuthExtensions = Request & AuthExtensions;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly rolesService: RolesService,
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithAuthExtensions = context.switchToHttp().getRequest();

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
      const payload = await this.tokenService.validateAccessToken(token);
      request['user'] = payload;
    } catch {
      throw new InvalidProvidedTokenException();
    }
  }

  private async _authorizeUser(
    request: RequestWithAuthExtensions,
    context: ExecutionContext,
  ): Promise<boolean> {
    const userId = request.user.sub;

    const requiredRoles = this._getMetadata<Role[]>('roles', context);
    const userRoles = await this._getUserRoles(userId);

    request.user.roles = userRoles;

    if (!userRoles || userRoles.length === 0) {
      throw new UserWithoutRoleException();
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
    return await this.rolesService.getRolesByUserId(new UUID(id));
  }
}
