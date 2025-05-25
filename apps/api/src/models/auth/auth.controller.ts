import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Email } from 'src/common/entities/email';
import { Password } from 'src/common/entities/password/password';
import { TokenEntity } from '../token/entity/token.entity';
import { AuthService } from './auth.service';
import {
  LoginRequestInput,
  RegisterRequestInput,
  RegisterResponseOutput,
} from './dto/auth.post.dto';
import { Cookies } from 'src/common/cookies/cookies.decorator';
import { NoRefreshTokenProvidedException } from './errors/auth.errors';

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
    @Body() payload: LoginRequestInput,
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

  @Post('revalidate-token')
  @ApiOperation({
    summary: 'Revalidate access token',
    description: `Revalidates the access token and returns a new one, along with a new refresh token. Uses the refresh token stored in cookies to verify the user's identity.`,
  })
  async revalidateToken(
    @Res({ passthrough: true }) response,
    @Cookies('refreshToken') refreshToken: string | null,
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
