export declare enum UserRole {
    ADMIN = "admin",
    STUDENT = "student",
    TEACHER = "teacher"
}
export declare class User {
    readonly id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    constructor(id: string, email: string, passwordHash: string, firstName: string, lastName: string, role: UserRole);
    getFullName(): string;
}
export declare class Admin extends User {
    constructor(id: string, email: string, passwordHash: string, firstName: string, lastName: string);
}
export declare class Student extends User {
    level: string;
    points: number;
    constructor(id: string, email: string, passwordHash: string, firstName: string, lastName: string, level: string, points?: number);
    addPoints(amount: number): void;
}
export declare class Teacher extends User {
    speciality: string | undefined;
    verified: boolean;
    constructor(id: string, email: string, passwordHash: string, firstName: string, lastName: string, speciality: string | undefined, verified?: boolean);
}
