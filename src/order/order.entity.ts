import { Car } from 'src/car/car.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from 'src/profile/profile.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

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
  carId: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  cancellationReason?: string;

  @Column({ nullable: true })
  lastStatusUpdatedById?: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Car)
  @JoinColumn({ name: 'carId' })
  car: Car;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'lastStatusUpdatedById' })
  lastStatusUpdatedBy: Profile;
}
