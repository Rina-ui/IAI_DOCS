import { IsEmail, IsString, MinLength } from 'class-validator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterUseCase } from '../../../application/auth/register.usecase';
import { LoginUseCase } from '../../../application/auth/login.usecase';

export class RegisterHttpDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() level: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
      private readonly registerUseCase: RegisterUseCase,
      private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un compte étudiant' })
  @ApiBody({
    schema: {
      example: {
        email: 'etudiant@example.com',
        password: 'motdepasse123',
        firstName: 'Ali',
        lastName: 'Diallo',
        level: 'Terminale',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Compte créé avec succès' })
  @ApiResponse({ status: 400, description: 'Email déjà utilisé ou données invalides' })
  async register(@Body() dto: RegisterHttpDto) {
    const user = await this.registerUseCase.execute(dto);
    return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
  }

  @Post('login')
  @ApiOperation({ summary: 'Se connecter et obtenir un token JWT' })
  @ApiBody({
    schema: {
      example: { email: 'etudiant@example.com', password: 'motdepasse123' },
    },
  })
  @ApiResponse({ status: 200, description: 'Connexion réussie — retourne le token JWT' })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects' })
  async login(@Body() body: { email: string; password: string }) {
    return this.loginUseCase.execute(body.email, body.password);
  }
}