import { IsEmail, IsString, MinLength } from 'class-validator';
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUseCase } from '../../../application/auth/register.usecase';

export class RegisterHttpDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() level: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  @Post('register')
  async register(@Body() dto: RegisterHttpDto) {
    const user = await this.registerUseCase.execute(dto);
    return {
      id: user.id,
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
    };
  }
}
