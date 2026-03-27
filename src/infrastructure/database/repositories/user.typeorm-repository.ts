import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import {
  User,
  Student,
  Teacher,
  UserRole,
} from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { email } });
    return orm ? this.toDomain(orm) : null;
  }

  async save(user: User): Promise<User> {
    const orm = this.toOrm(user);
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(orm: UserOrmEntity): User {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (orm.role === UserRole.STUDENT) {
      return new Student(
        orm.id,
        orm.email,
        orm.passwordHash,
        orm.firstName,
        orm.lastName,
        orm.level,
        orm.points,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (orm.role === UserRole.TEACHER) {
      return new Teacher(
        orm.id,
        orm.email,
        orm.passwordHash,
        orm.firstName,
        orm.lastName,
        orm.speciality,
        orm.verified,
      );
    }
    return new User(
      orm.id,
      orm.email,
      orm.passwordHash,
      orm.firstName,
      orm.lastName,
      orm.role as UserRole,
    );
  }

  // Mapping Domain
  private toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.email = user.email;
    orm.passwordHash = user.passwordHash;
    orm.firstName = user.firstName;
    orm.lastName = user.lastName;
    orm.role = user.role;
    if (user instanceof Student) {
      orm.level = user.level;
      orm.points = user.points;
    }
    if (user instanceof Teacher) {
      orm.speciality = user.speciality;
      orm.verified = user.verified;
    }
    return orm;
  }
}
