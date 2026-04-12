import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('announcements')
export class AnnouncementOrmEntity {
    @PrimaryColumn('uuid') id: string;
    @Column() title: string;
    @Column('text') content: string;
    @Column({ default: 'GENERAL' }) type: string;
    @Column() authorId: string;
    @Column({ nullable: true }) imageUrl: string;
    @CreateDateColumn() createdAt: Date;
    @Column({ nullable: true }) expiresAt: Date;
}