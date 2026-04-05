import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('questions')
export class QuestionOrmEntity {
  @PrimaryColumn('uuid') id: string;
  @Column() examId: string;
  @Column('text') questionText: string;
  @Column('float') points: number;
  @Column('text') correctAnswer: string;
  @Column('text') explanation: string;
}
