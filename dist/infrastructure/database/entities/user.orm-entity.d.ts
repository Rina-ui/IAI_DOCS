export declare class UserOrmEntity {
    id: string;
    email: string;
    passwordHash: string;
    lastName: string;
    firstName: string;
    role: string;
    speciality?: string;
    verified: boolean;
    level: string;
    points: number;
}
