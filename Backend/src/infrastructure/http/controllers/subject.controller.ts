import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Inject } from '@nestjs/common';
import * as subjectRepository from '../../../domain/repositories/subject.repository';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectController {
    constructor(
        @Inject(subjectRepository.SUBJECT_REPOSITORY) private subjectRepo: subjectRepository.ISubjectRepository,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Lister toutes les matières' })
    @ApiQuery({ name: 'filiere', required: false, enum: ['TC1', 'TC2', 'GLSI', 'ASR', 'COMMUN'] })
    @ApiResponse({ status: 200, description: 'Liste des matières groupées par filière' })
    async findAll(@Query('filiere') filiere?: string) {
        if (filiere) {
            const subjects = await this.subjectRepo.findByFiliere(filiere);
            return { filiere, subjects };
        }

        // Sans filtre
        const all = await this.subjectRepo.findAll();
        return {
            TC1: all.filter(s => s.filiere === 'TC1' || s.filiere === 'COMMUN'),
            TC2: all.filter(s => s.filiere === 'TC2' || s.filiere === 'COMMUN'),
            GLSI: all.filter(s => s.filiere === 'GLSI' || s.filiere === 'COMMUN'),
            ASR: all.filter(s => s.filiere === 'ASR' || s.filiere === 'COMMUN'),
        };
    }

    @Get(':filiere/exams')
    @ApiOperation({ summary: 'Épreuves disponibles pour une filière' })
    @ApiResponse({ status: 200, description: 'Matières de la filière avec le nombre d\'épreuves' })
    getByFiliere(@Param('filiere') filiere: string) {
        return this.subjectRepo.findByFiliere(filiere.toUpperCase());
    }
}