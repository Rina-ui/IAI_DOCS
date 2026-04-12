import { Inject, Injectable } from '@nestjs/common';
import {Announcement, AnnouncementType} from '../../domain/entities/announcement.entity';
import {v4 as uuidv4} from 'uuid';
import * as announcementRepository_1 from "../../domain/repositories/announcement.repository";

export interface CreateAnnouncementDto {
    title: string;
    content: string;
    type: AnnouncementType;
    authorId: string;
    expiresAt?: Date;
    imageUrl?: string;
}

@Injectable()
export class CreateAnnouncementUseCase {
    constructor(
        @Inject(announcementRepository_1.ANNOUNCEMENT_REPOSITORY) private announcementRepo: announcementRepository_1.IAnnouncementRepository,
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
            dto.imageUrl, // ← nouveau
        );
        return this.announcementRepo.save(announcement);
    }
}