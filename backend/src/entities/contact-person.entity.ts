import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Partner } from './partner.entity';
import { Application } from './application.entity';

@Entity('contact_persons')
export class ContactPerson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Partner, partner => partner.contactPersons)
  partner: Partner;

  @Column()
  name: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  mobilePhone: string;

  @Column({
    type: 'varchar',
    enum: ['主要担当', '営業担当', '技術担当', 'その他'],
    default: '営業担当',
  })
  type: string;

  @Column({ nullable: true })
  remarks: string;

  @Column({ nullable: true })
  preferredContactMethod: string;

  @OneToMany(() => Application, application => application.contactPerson)
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
