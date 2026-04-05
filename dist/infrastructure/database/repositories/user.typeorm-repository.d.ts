import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
export declare class UserTypeOrmRepository implements IUserRepository {
    private readonly repo;
    constructor(repo: Repository<UserOrmEntity>);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    private toDomain;
    private toOrm;
}
