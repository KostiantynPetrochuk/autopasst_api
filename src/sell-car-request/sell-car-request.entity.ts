import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sell_car_requests')
export class SellCarRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: string;

  @Column()
  mileage: string;

  @Column()
  price: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  infoMethod: string;

  @Column()
  contact: string;

  @Column()
  countryOfExploitation: string;

  @Column()
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  imageNames: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
