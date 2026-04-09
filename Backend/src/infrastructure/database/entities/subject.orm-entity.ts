import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('subjects')
export class SubjectOrmEntity {
    @PrimaryColumn('uuid') id: string;
    @Column({ unique: true }) name: string;
    @Column() filiere: string;
    @Column({ nullable: true }) description: string;
}