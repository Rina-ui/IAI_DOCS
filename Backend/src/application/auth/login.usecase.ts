import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as userRepository from '../../domain/repositories/user.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(userRepository.USER_REPOSITORY)
    private userRepo: userRepository.IUserRepository,
    private jwtService: JwtService,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ token: string; user: any }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
