import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('car_selections')
export class CarSelection {
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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
