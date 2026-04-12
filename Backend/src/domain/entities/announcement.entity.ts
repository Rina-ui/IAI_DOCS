export type AnnouncementType = 'NOTES' | 'EVENEMENT' | 'URGENT' | 'GENERAL';

export class Announcement {
    constructor(
        public readonly id: string,
        public title: string,
        public content: string,
        public type: AnnouncementType,
        public authorId: string,
        public createdAt: Date = new Date(),
        public expiresAt?: Date,
    ) {}

    isExpired(): boolean {
        if (!this.expiresAt) return false;
        return new Date() > this.expiresAt;
    }
}