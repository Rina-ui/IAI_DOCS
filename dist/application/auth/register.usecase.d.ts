import * as userRepository from '../../domain/repositories/user.repository';
import { Student } from '../../domain/entities/user.entity';
export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    level: string;
}
export declare class RegisterUseCase {
    private readonly userRepo;
    constructor(userRepo: userRepository.IUserRepository);
    execute(dto: RegisterDto): Promise<Student>;
}
