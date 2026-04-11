import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => {
  const url = process.env.DATABASE_URL;

  console.log('DATABASE_URL reçue:', url ? 'OUI' : 'NON — UNDEFINED');

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