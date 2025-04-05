import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Partner } from './partner.entity';

@Entity('base_contracts')
export class BaseContract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Partner, partner => partner.baseContracts)
  partner: Partner;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    type: 'varchar',
    enum: ['有効', '更新待ち', '終了'],
    default: '有効',
  })
  status: string;

  @Column({ nullable: true })
  contractType: string;

  @Column({ nullable: true })
  contractFile: string;

  @Column({ nullable: true })
  terms: string;

  @Column({ default: false })
  isAutoRenew: boolean;

  @Column({ nullable: true })
  renewalNoticeDate: Date;

  @Column({ nullable: true })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
