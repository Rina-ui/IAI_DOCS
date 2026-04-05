import { RegisterUseCase } from '../../../application/auth/register.usecase';
import { LoginUseCase } from '../../../application/auth/login.usecase';
export declare class RegisterHttpDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    level: string;
}
export declare class AuthController {
    private readonly registerUseCase;
    private readonly loginUseCase;
    constructor(registerUseCase: RegisterUseCase, loginUseCase: LoginUseCase);
    register(dto: RegisterHttpDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: any;
    }>;
}
