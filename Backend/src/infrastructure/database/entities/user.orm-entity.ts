import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  speciality?: string;

  @Column({ nullable: true })
  specialty?: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  level: string;

  @Column({ default: 0 })
  points: number;
}