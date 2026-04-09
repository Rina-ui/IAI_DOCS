import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('forum_replies')
export class ForumReplyOrmEntity {
    @PrimaryColumn('uuid') id: string;
    @Column() postId: string;
    @Column() authorId: string;
    @Column('text') content: string;
    @Column({ default: 0 }) upvotes: number;
    @CreateDateColumn() createdAt: Date;
}