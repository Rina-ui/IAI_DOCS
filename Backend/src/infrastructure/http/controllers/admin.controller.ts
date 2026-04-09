import { Body, Controller, Delete, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreateTeacherUseCase } from '../../../application/admin/create-teacher.usecase';
import { CreateAnnouncementUseCase } from '../../../application/admin/create-announcement.usecase';
import * as announcementRepository from '../../../domain/repositories/announcement.repository';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
    constructor(
        private readonly createTeacherUseCase: CreateTeacherUseCase,
        private readonly createAnnouncementUseCase: CreateAnnouncementUseCase,
        @Inject(announcementRepository.ANNOUNCEMENT_REPOSITORY) private readonly announcementRepo: announcementRepository.IAnnouncementRepository,
    ) {}

    // ─── TEACHERS
    @Post('teachers')
    @Roles('admin')
    @ApiOperation({ summary: 'Créer un compte professeur (Admin only)' })
    @ApiBody({
        schema: {
            example: {
                email: 'prof.martin@iai.com',
                password: 'motdepasse123',
                firstName: 'Martin',
                lastName: 'Dupont',
                specialty: 'Mathématiques',
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Professeur créé' })
    @ApiResponse({ status: 403, description: 'Accès refusé — Admin uniquement' })
    @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
    addTeacher(@Body() body: any) {
        return this.createTeacherUseCase.execute(body);
    }

    // ─── ANNONCES ────────────────────────────────────────────
    @Get('announcements')
    @Roles('admin')
    @ApiOperation({ summary: 'Toutes les annonces (Admin only)' })
    getAllAnnouncements() {
        return this.announcementRepo.findAll();
    }

    @Post('announcements')
    @Roles('admin')
    @ApiOperation({ summary: 'Publier une annonce (Admin only)' })
    @ApiBody({
        schema: {
            example: {
                title: 'Notes du semestre 1 disponibles',
                content: 'Les notes sont affichees.',
                type: 'NOTES',
                expiresAt: '2026-02-01T00:00:00.000Z',
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Annonce publiée' })
    publishAnnouncement(@Body() body: any, @CurrentUser() user: any) {
        return this.createAnnouncementUseCase.execute({
            ...body,
            authorId: user.id,
            expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
        });
    }

    @Delete('announcements/:id')
    @Roles('admin')
    @ApiOperation({ summary: 'Supprimer une annonce (Admin only)' })
    removeAnnouncement(@Param('id') id: string) {
        return this.announcementRepo.delete(id);
    }
}