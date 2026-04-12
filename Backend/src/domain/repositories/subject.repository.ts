import { Subject } from '../entities/subject.entity';

export interface ISubjectRepository {
    findAll(): Promise<Subject[]>;
    findByFiliere(filiere: string): Promise<Subject[]>;
    findById(id: string): Promise<Subject | null>;
}
export const SUBJECT_REPOSITORY = Symbol('ISubjectRepository');