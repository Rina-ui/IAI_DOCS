"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const databaseConfig = () => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    entities: [__dirname + '/../**/*.orm-entity{.ts,.js}'],
    synchronize: true,
    logging: false,
});
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map