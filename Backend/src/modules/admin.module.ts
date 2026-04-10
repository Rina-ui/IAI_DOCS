import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTeacherUseCase } from '../application/admin/create-teacher.usecase';
import { CreateAnnouncementUseCase } from '../application/admin/create-announcement.usecase';
import { AnnouncementOrmEntity } from '../infrastructure/database/entities/announcement.orm-entity';
import { UserOrmEntity } from '../infrastructure/database/entities/user.orm-entity';
import { AnnouncementTypeOrmRepository } from '../infrastructure/database/repositories/announcement.typeorm-repository';
import { UserTypeOrmRepository } from '../infrastructure/database/repositories/user.typeorm-repository';
import { AdminController } from '../infrastructure/http/controllers/admin.controller';
import { AnnouncementController } from '../infrastructure/http/controllers/announcement.controller';
import { ANNOUNCEMENT_REPOSITORY } from '../domain/repositories/announcement.repository';
import { USER_REPOSITORY } from '../domain/repositories/user.repository';
import { AuthModule } from './auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AnnouncementOrmEntity, UserOrmEntity]),
        AuthModule,
    ],
    controllers: [AdminController, AnnouncementController],
    providers: [
        CreateTeacherUseCase,
        CreateAnnouncementUseCase,
        { provide: ANNOUNCEMENT_REPOSITORY, useClass: AnnouncementTypeOrmRepository },
        { provide: USER_REPOSITORY, useClass: UserTypeOrmRepository },
    ],
})
export class AdminModule {}