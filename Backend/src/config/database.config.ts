import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => {
  const rawUrl = process.env.DB_URL;
  console.log('DB_URL reçue:', rawUrl ? 'OUI' : 'NON');

  const url = new URL(rawUrl!);

  return {
    type: 'postgres',
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    username: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace('/', ''),
    ssl: { rejectUnauthorized: false },
    entities: [__dirname + '/../**/*.orm-entity{.ts,.js}'],
    synchronize: true,
    logging: false,
    retryAttempts: 5,
    retryDelay: 3000,
  };
};