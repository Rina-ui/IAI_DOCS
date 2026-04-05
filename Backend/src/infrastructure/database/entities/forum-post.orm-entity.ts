import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('forum_posts')
export class ForumPostOrmEntity {
  @PrimaryColumn('uuid') id: string;
  @Column() authorId: string;
  @Column() title: string;
  @Column('text') content: string;
  @Column({ default: 0 }) upvotes: number;
  @CreateDateColumn() createdAt: Date;
}
