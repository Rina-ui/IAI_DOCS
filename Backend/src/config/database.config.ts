import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => {
  const url = process.env.DB_URL || process.env.DATABASE_URL;
  console.log('DB URL reçue:', url ? 'OUI' : 'NON');

  return {
    type: 'postgres',
    url,
    ssl: { rejectUnauthorized: false },
    entities: [__dirname + '/../**/*.orm-entity{.ts,.js}'],
    synchronize: true,
    logging: false,
    retryAttempts: 5,
    retryDelay: 3000,
  };
};