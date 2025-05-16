import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/enums/role.enum';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  hashPwd: string;

  @Column()
  salt: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('jsonb', { default: [Role.User] })
  roles: Role[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
