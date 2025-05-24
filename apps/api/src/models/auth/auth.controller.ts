import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  LoginRequestInput,
  RegisterRequestInput,
  RegisterResponseOutput,
  RevalidateTokenRequestInput,
} from './dto/auth.post.dto';
import { AuthService } from './auth.service';
import { Email } from 'src/common/entities/email';
import { Password } from 'src/common/entities/password/password';
import { TokenEntity } from '../token/entity/token.entity';

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
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return accessToken;
  }

  @Post('revalidate-token')
  @ApiOperation({
    summary: 'Revalidate access token',
    description: 'Revalidates the access token and returns a new one',
  })
  async revalidateToken(
    @Res({ passthrough: true }) response,
    @Body() payload: RevalidateTokenRequestInput,
  ): Promise<TokenEntity> {
    const { accessToken, refreshToken } = await this.authService.revalidateToken(
      payload.refreshToken,
    );

    response.cookie('refreshToken', refreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return accessToken;
  }
}
