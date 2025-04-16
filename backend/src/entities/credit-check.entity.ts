import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Partner } from './partner.entity';

@Entity('credit_checks')
export class CreditCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Partner, partner => partner.creditChecks)
  partner: Partner;

  @Column()
  checkDate: Date;

  @Column({ nullable: true })
  checkedBy: string;

  @Column({ nullable: true })
  checkMethod: string;

  @Column({
    type: 'varchar',
    enum: ['良好', '注意', '不良'],
    default: '注意',
  })
  result: string;

  @Column({ nullable: true })
  creditScore: number;

  @Column({ nullable: true })
  financialStability: string;

  @Column({ nullable: true })
  paymentHistory: string;

  @Column({ nullable: true })
  expiryDate: Date;

  @Column({ nullable: true })
  documentFile: string;

  @Column({ nullable: true })
  remarks: string;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
