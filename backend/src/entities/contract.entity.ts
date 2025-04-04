import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Staff } from './staff.entity';
import { Project } from './project.entity';

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

  @Column({ default: false })
  isAutoRenew: boolean;

  @Column({ nullable: true })
  renewalNoticeDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
