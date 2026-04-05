import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('trainings')
export class TrainingOrmEntity {
  @PrimaryColumn('uuid') id: string;
  @Column() studentId: string;
  @Column() examId: string;
  @Column('float', { default: 0 }) score: number;
  @CreateDateColumn() startedAt: Date;
  @Column({ nullable: true }) submittedAt: Date;
}
