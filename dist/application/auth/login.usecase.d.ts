import { JwtService } from '@nestjs/jwt';
import * as userRepository from '../../domain/repositories/user.repository';
export declare class LoginUseCase {
    private userRepo;
    private jwtService;
    constructor(userRepo: userRepository.IUserRepository, jwtService: JwtService);
    execute(email: string, password: string): Promise<{
        token: string;
        user: any;
    }>;
}
