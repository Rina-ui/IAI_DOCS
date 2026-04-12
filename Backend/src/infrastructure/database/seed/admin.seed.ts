import { DataSource } from 'typeorm';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(UserOrmEntity);

    const existing = await repo.findOne({ where: { email: 'admin@iai.com' } });
    if (!existing) {
        const admin = new UserOrmEntity();
        admin.id = uuidv4();
        admin.email = 'admin@iai.com';
        admin.passwordHash = await bcrypt.hash('Admin@IAI2024', 10);
        admin.firstName = 'Super';
        admin.lastName = 'Admin';
        admin.role = 'admin';
        admin.points = 0;
        admin.verified = true;
        await repo.save(admin);
        console.log('👑 Admin créé : admin@iai.com / Admin@IAI2024');
    }
}