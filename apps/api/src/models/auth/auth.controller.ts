import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { Cookies } from 'src/common/cookies/cookies.decorator';
import { Email } from 'src/common/entities/email/email';
import { Password } from 'src/common/entities/password/password';
import { UUID } from 'src/common/entities/uuid/uuid';
import { UserAuthType } from 'src/common/types';
import { TokenEntity } from '../token/entity/token.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import {
  LoginRequestInput,
  RegisterRequestInput,
  RegisterResponseOutput,
} from './dto/auth.post.dto';
import { NoRefreshTokenProvidedException, UserNotFoundException } from './errors/auth.errors';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Creates a new user account with email and password credentials',
  })
  async register(@Body() payload: RegisterRequestInput): Promise<RegisterResponseOutput> {
    const email = new Email(payload.email);
    const password = new Password(payload.password);

    const user = await this.authService.signUp(email, password);

    return {
      message: 'User registered successfully',
      user,
    };
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticates user and returns access token',
  })
  async login(
    @Res({ passthrough: true }) response,
    @Body() payload: LoginRequestInput
  ): Promise<TokenEntity> {
    const email = new Email(payload.email);
    const password = new Password(payload.password);

    const { accessToken, refreshToken } = await this.authService.signIn(email, password);

    response.cookie('refreshToken', refreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return accessToken;
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Revokes the refresh token and clears the cookie',
  })
  @AllowAuthenticated()
  async logout(
    @Res({ passthrough: true }) response,
    @GetUser() currentUser: UserAuthType,
    @Cookies('refreshToken') refreshToken?: string
  ): Promise<void> {
    if (!refreshToken) {
      throw new NoRefreshTokenProvidedException();
    }

    const userId = new UUID(currentUser.sub);
    await this.authService.logout(userId, refreshToken);

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return;
  }

  @Post('logout-all')
  @ApiOperation({
    summary: 'Logout user in all devices',
    description: 'Revokes all refresh tokens for the user',
  })
  @AllowAuthenticated()
  async logoutAll(
    @Res({ passthrough: true }) response,
    @GetUser() currentUser: UserAuthType,
    @Cookies('refreshToken') refreshToken?: string
  ): Promise<void> {
    if (!refreshToken) {
      throw new NoRefreshTokenProvidedException();
    }

    const userId = new UUID(currentUser.sub);

    await this.authService.logoutAll(userId, refreshToken);

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return;
  }

  @Post('revalidate-token')
  @ApiOperation({
    summary: 'Revalidate access token',
    description: `Revalidates the access token and returns a new one, along with a new refresh token. Uses the refresh token stored in cookies to verify the user's identity.`,
  })
  async revalidateToken(
    @Res({ passthrough: true }) response,
    @Cookies('refreshToken') refreshToken?: string
  ): Promise<TokenEntity> {
    if (!refreshToken) {
      throw new NoRefreshTokenProvidedException();
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.revalidateToken(refreshToken);

    response.cookie('refreshToken', newRefreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return accessToken;
  }
}
