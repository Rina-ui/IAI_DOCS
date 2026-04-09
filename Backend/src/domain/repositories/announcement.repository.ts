import { Announcement } from '../entities/announcement.entity';

export interface IAnnouncementRepository {
    findAll(): Promise<Announcement[]>;
    findActive(): Promise<Announcement[]>;
    findById(id: string): Promise<Announcement | null>;
    save(announcement: Announcement): Promise<Announcement>;
    delete(id: string): Promise<void>;
}
export const ANNOUNCEMENT_REPOSITORY = Symbol('IAnnouncementRepository');