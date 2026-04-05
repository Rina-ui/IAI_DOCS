import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('corrections')
export class CorrectionOrmEntity {
  @PrimaryColumn('uuid') id: string;
  @Column() trainingId: string;
  @Column('float') totalScore: number;
  @Column('float') percentage: number;
  @Column('text') aiExplanation: string;
  @CreateDateColumn() generatedAt: Date;
}
