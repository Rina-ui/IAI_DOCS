import { Inject, Injectable } from '@nestjs/common';
import * as userRepository from '../../domain/repositories/user.repository';
import { Student } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  level: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(userRepository.USER_REPOSITORY)
    private readonly userRepo: userRepository.IUserRepository,
  ) {}

  async execute(dto: RegisterDto): Promise<Student> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const email = new Email(dto.email);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const existing = await this.userRepo.findByEmail(email.toString());
    if (existing) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const student = new Student(
      uuidv4(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      email.toString(),
      passwordHash,
      dto.firstName,
      dto.lastName,
      dto.level,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return this.userRepo.save(student);
  }
}
