import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectOrmEntity } from '../infrastructure/database/entities/subject.orm-entity';
import { SubjectTypeOrmRepository } from '../infrastructure/database/repositories/subject.typeorm-repository';
import { SubjectController } from '../infrastructure/http/controllers/subject.controller';
import { SUBJECT_REPOSITORY } from '../domain/repositories/subject.repository';

@Module({
    imports: [TypeOrmModule.forFeature([SubjectOrmEntity])],
    controllers: [SubjectController],
    providers: [
        { provide: SUBJECT_REPOSITORY, useClass: SubjectTypeOrmRepository },
    ],
    exports: [SUBJECT_REPOSITORY],
})
export class SubjectModule {}