import { Inject, Injectable, ConflictException } from '@nestjs/common';
import * as userRepository from '../../domain/repositories/user.repository';
import {Teacher} from '../../domain/entities/user.entity';
import {Email} from '../../domain/value-objects/email.vo';
import * as bcrypt from 'bcryptjs';
import {v4 as uuidv4} from 'uuid';

export interface CreateTeacherDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    specialty: string;
}

@Injectable()
export class CreateTeacherUseCase {
    constructor(
        @Inject(userRepository.USER_REPOSITORY) private userRepo: userRepository.IUserRepository,
    ) {}

    async execute(dto: CreateTeacherDto): Promise<Teacher> {
        const email = new Email(dto.email);

        const existing = await this.userRepo.findByEmail(email.toString());
        if (existing) throw new ConflictException('Email déjà utilisé');

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const teacher = new Teacher(
            uuidv4(),
            email.toString(),
            passwordHash,
            dto.firstName,
            dto.lastName,
            dto.specialty,
            true, // Vérifié par défaut car créé par l'admin
        );

        return this.userRepo.save(teacher) as Promise<Teacher>;
    }
}