import { IsEmail, IsString, MinLength } from 'class-validator';
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUseCase } from '../../../application/auth/register.usecase';
import { LoginUseCase } from '../../../application/auth/login.usecase';

export class RegisterHttpDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() level: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterHttpDto) {
    const user = await this.registerUseCase.execute(dto);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.loginUseCase.execute(body.email, body.password);
  }
}
