import { Inject, Injectable } from '@nestjs/common';
import * as userRepository from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(userRepository.USER_REPOSITORY)
    private readonly userRepo: userRepository.IUserRepository,
  ) {}

  async execute(loginDto: LoginDto): Promise<User | null> {
    const email = new Email(loginDto.email);
  }

}