import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  LoginRequestInput,
  LoginResponseOutput,
  RegisterRequestInput,
  RegisterResponseOutput,
} from './dto/auth.post.dto';
import { AuthService } from './auth.service';
import { Email } from 'src/common/entities/email';

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

    const user = await this.authService.signUp(email, payload.password);

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
  async login(@Body() payload: LoginRequestInput): Promise<LoginResponseOutput> {
    const email = new Email(payload.email);

    const accessToken = await this.authService.signIn(email, payload.password);

    return { accessToken };
  }
}
