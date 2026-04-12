import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as announcementRepository from '../../../domain/repositories/announcement.repository';

@ApiTags('Annonces')
@Controller('announcements')
export class AnnouncementController {
    constructor(
        @Inject(announcementRepository.ANNOUNCEMENT_REPOSITORY) private announcementRepo: announcementRepository.IAnnouncementRepository,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Voir les annonces actives (public — pas besoin de token)' })
    @ApiResponse({ status: 200, description: 'Liste des annonces actives triées par date' })
    findActive() {
        return this.announcementRepo.findActive();
    }
}