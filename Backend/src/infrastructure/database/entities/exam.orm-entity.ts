import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('exams')
export class ExamOrmEntity {
  @PrimaryColumn('uuid') id: string;
  @Column() title: string;
  @Column() subject: string;
  @Column() year: number;
  @Column() level: string;
  @Column() fileUrl: string;
  @Column() uploadedById: string;
  @Column({ default: 'pending' }) status: string;
  @CreateDateColumn() createdAt: Date;
}
