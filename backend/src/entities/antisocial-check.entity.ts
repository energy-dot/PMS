import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Partner } from './partner.entity';

@Entity('antisocial_checks')
export class AntisocialCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Partner, partner => partner.antisocialChecks)
  partner: Partner;

  @Column()
  checkDate: Date;

  @Column({ nullable: true })
  checkedBy: string;

  @Column({ nullable: true })
  checkMethod: string;

  @Column({
    type: 'varchar',
    enum: ['問題なし', '要確認', 'NG'],
    default: '要確認',
  })
  result: string;

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
