import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
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

  @Column({ default: false })
  verified: boolean;

  @Column()
  level: string;

  @Column()
  points: number;
}
