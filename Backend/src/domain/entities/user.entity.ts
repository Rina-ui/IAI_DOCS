export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public passwordHash: string,
    public firstName: string,
    public lastName: string,
    public role: UserRole,
  ) {}

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export class Admin extends User {
  constructor(
    id: string,
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
  ) {
    super(id, email, passwordHash, firstName, lastName, UserRole.ADMIN);
  }
}

export class Student extends User {
  constructor(
    id: string,
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
    public level: string,
    public points: number = 0,
  ) {
    super(id, email, passwordHash, firstName, lastName, UserRole.STUDENT);
  }

  addPoints(amount: number): void {
    if (amount < 0) throw new Error('Amount must be greater than 0');
    this.points += amount;
  }
}

export class Teacher extends User {
  constructor(
    id: string,
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
    public speciality: string | undefined,
    public verified: boolean = false,
  ) {
    super(id, email, passwordHash, firstName, lastName, UserRole.TEACHER);
  }
}
