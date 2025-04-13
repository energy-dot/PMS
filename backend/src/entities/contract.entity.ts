import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Staff } from './staff.entity';
import { Project } from './project.entity';
import { ContractDocument } from './contract-document.entity';
import { ContractRenewal } from './contract-renewal.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Staff, staff => staff.contracts)
  staff: Staff;

  @ManyToOne(() => Project, project => project.contracts)
  project: Project;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  price: number;

  // 月額単価（price と同じ値も可）
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  monthlyRate: number;

  // 工数（人月）
  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2, default: 1 })
  manMonth: number;

  // 契約タイプ（準委任、派遣など）
  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  paymentTerms: string;

  @Column({
    // SQLiteはenum型をサポートしていないため、テスト用に変更
    // type: 'enum',
    type: 'varchar',
    enum: ['契約中', '更新待ち', '契約終了'],
    default: '契約中',
  })
  status: string;

  @Column({ nullable: true })
  contractFile: string;

  @Column({ nullable: true })
  remarks: string;

  // 備考（備考の翻訳ミスまたは追加フィールド）
  @Column({ nullable: true })
  notes: string;

  @Column({ default: false })
  isAutoRenew: boolean;

  @Column({ nullable: true })
  renewalNoticeDate: Date;

  @Column({ nullable: true })
  renewalReminderSent: boolean;

  @Column({ nullable: true })
  terminationNoticePeriod: number;

  @OneToMany(() => ContractDocument, document => document.contract)
  documents: ContractDocument[];

  @OneToMany(() => ContractRenewal, renewal => renewal.contract)
  renewalHistory: ContractRenewal[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
