import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Brand } from '../brand/brand.entity';
import { Model } from '../model/model.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  vin: string;

  @Column()
  brandId: number;

  @Column()
  modelId: number;

  @Column({ default: '' })
  info: string;

  @Column()
  condition: string;

  @Column()
  bodyType: string;

  @Column({ type: 'timestamp' })
  firstRegistration: Date;

  @Column()
  mileage: number;

  @Column()
  fuelType: string;

  @Column()
  transmission: string;

  @Column({ type: 'timestamp' })
  maintenance: Date;

  @Column()
  ecoClass: string;

  @Column()
  keys: string;

  @Column()
  price: number;

  @Column({ type: 'jsonb', nullable: true })
  imageNames: string[];

  @Column({ default: '' })
  specFilename: string;

  @Column()
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @ManyToOne(() => Model)
  @JoinColumn({ name: 'modelId' })
  model: Model;
}
