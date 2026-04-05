import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IQuestionRepository } from '../../../domain/repositories/question.repository';
import { Question } from '../../../domain/entities/question.entity';
import { QuestionOrmEntity } from '../entities/question.orm-entity';

@Injectable()
export class QuestionTypeOrmRepository implements IQuestionRepository {
  constructor(
    @InjectRepository(QuestionOrmEntity)
    private readonly repo: Repository<QuestionOrmEntity>,
  ) {}

  async findByExam(examId: string): Promise<Question[]> {
    const list = await this.repo.find({ where: { examId } });
    return list.map(this.toDomain);
  }

  async findById(id: string): Promise<Question | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async save(question: Question): Promise<Question> {
    const saved = await this.repo.save(this.toOrm(question));
    return this.toDomain(saved);
  }

  async saveMany(questions: Question[]): Promise<Question[]> {
    const saved = await this.repo.save(questions.map(this.toOrm));
    return saved.map(this.toDomain);
  }

  private toDomain(orm: QuestionOrmEntity): Question {
    return new Question(
      orm.id,
      orm.examId,
      orm.questionText,
      orm.points,
      orm.correctAnswer,
      orm.explanation,
    );
  }

  private toOrm(q: Question): QuestionOrmEntity {
    const orm = new QuestionOrmEntity();
    Object.assign(orm, {
      id: q.id,
      examId: q.examId,
      questionText: q.questionText,
      points: q.points,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    });
    return orm;
  }
}
