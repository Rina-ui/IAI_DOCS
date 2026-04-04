import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [__dirname + '/../**/*.orm-entity{.ts,.js}'],
  //en mode developpement seulement tchaiiii
  synchronize: true,
  logging: false,
});
