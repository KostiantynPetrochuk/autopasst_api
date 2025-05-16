import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Brand } from '../brand/brand.entity';

@Entity('models')
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modelName: string;

  @Column()
  brandId: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => Brand, (brand) => brand.models)
  @JoinColumn({ name: 'brandId' })
  brand: Brand;
}
