import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth.module';
import { ExamModule } from './modules/exam.module';
import { TrainingModule } from './modules/training.module';
import { ForumModule } from './modules/forum.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig()),
    AuthModule,
    ExamModule,
    TrainingModule,
    ForumModule,
  ],
})
export class AppModule {}
