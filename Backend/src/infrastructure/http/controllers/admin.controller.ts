import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post, UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreateTeacherUseCase } from '../../../application/admin/create-teacher.usecase';
import { CreateAnnouncementUseCase } from '../../../application/admin/create-announcement.usecase';
import * as announcementRepository from '../../../domain/repositories/announcement.repository';
import {CloudinaryService} from "../../storage/cloudinary.service";
import {FileInterceptor} from "@nestjs/platform-express";

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
    constructor(
        private readonly createTeacherUseCase: CreateTeacherUseCase,
        private readonly createAnnouncementUseCase: CreateAnnouncementUseCase,
        private readonly cloudinaryService: CloudinaryService,
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

//creer une annonce
    @Post('announcements')
    @Roles('admin')
    @ApiOperation({ summary: 'Publier une annonce avec image optionnelle (Admin only)' })
    @ApiConsumes('multipart/form-data', 'application/json')
    @UseInterceptors(FileInterceptor('image', {
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                cb(new BadRequestException('Seules les images sont acceptées'), false);
            } else {
                cb(null, true);
            }
        },
    }))
    async publishAnnouncement(
        @UploadedFile() image: Express.Multer.File,
        @Body() body: any,
        @CurrentUser() user: any,
    ) {
        let imageUrl: string | undefined;

        // Si une image est uploadée → Cloudinary
        if (image) {
            imageUrl = await this.cloudinaryService.uploadImage(image.buffer, `announcement-${Date.now()}`);
        }

        return this.createAnnouncementUseCase.execute({
            ...body,
            authorId: user.id,
            expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
            imageUrl,
        });
    }

    @Delete('announcements/:id')
    @Roles('admin')
    @ApiOperation({ summary: 'Supprimer une annonce (Admin only)' })
    removeAnnouncement(@Param('id') id: string) {
        return this.announcementRepo.delete(id);
    }
}