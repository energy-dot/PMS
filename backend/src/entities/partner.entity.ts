import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Staff } from './staff.entity';

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({
    // SQLiteはenum型をサポートしていないため、テスト用に変更
    // type: 'enum',
    type: 'varchar',
    enum: ['取引中', '取引停止', '候補'],
    default: '候補',
  })
  status: string;

  @Column({ nullable: true })
  businessCategory: string;

  @Column({ nullable: true })
  establishedYear: number;

  @Column({ nullable: true })
  employeeCount: number;

  @Column({ nullable: true })
  annualRevenue: string;

  @Column({ default: false })
  antisocialCheckCompleted: boolean;

  @Column({ nullable: true })
  antisocialCheckDate: Date;

  @Column({ default: false })
  creditCheckCompleted: boolean;

  @Column({ nullable: true })
  creditCheckDate: Date;

  @Column({ nullable: true })
  remarks: string;

  @OneToMany(() => Staff, staff => staff.partner)
  staff: Staff[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
