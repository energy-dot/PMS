import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Contract } from './contract.entity';

@Entity('contract_renewals')
export class ContractRenewal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Contract, contract => contract.renewalHistory)
  contract: Contract;

  @Column()
  previousStartDate: Date;

  @Column()
  previousEndDate: Date;

  @Column()
  previousPrice: number;

  @Column()
  newStartDate: Date;

  @Column()
  newEndDate: Date;

  @Column()
  newPrice: number;

  @Column({ nullable: true })
  changeReason: string;

  @Column({
    type: 'varchar',
    enum: ['自動更新', '条件変更', '価格変更', '期間延長', 'その他'],
    default: '自動更新',
  })
  renewalType: string;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ nullable: true })
  approvedDate: Date;

  @Column({
    type: 'varchar',
    enum: ['申請中', '承認済', '却下', '取消'],
    default: '申請中',
  })
  status: string;

  @Column({ nullable: true })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
