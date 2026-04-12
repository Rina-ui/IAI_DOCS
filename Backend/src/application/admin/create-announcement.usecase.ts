import { Inject, Injectable } from '@nestjs/common';
import * as announcementRepository from '../../domain/repositories/announcement.repository';
import {Announcement, AnnouncementType} from '../../domain/entities/announcement.entity';
import {v4 as uuidv4} from 'uuid';

export interface CreateAnnouncementDto {
    title: string;
    content: string;
    type: AnnouncementType;
    authorId: string;
    expiresAt?: Date;
}

@Injectable()
export class CreateAnnouncementUseCase {
    constructor(
        @Inject(announcementRepository.ANNOUNCEMENT_REPOSITORY) private announcementRepo: announcementRepository.IAnnouncementRepository,
    ) {}

    async execute(dto: CreateAnnouncementDto): Promise<Announcement> {
        const announcement = new Announcement(
            uuidv4(),
            dto.title,
            dto.content,
            dto.type,
            dto.authorId,
            new Date(),
            dto.expiresAt,
        );
        return this.announcementRepo.save(announcement);
    }
}