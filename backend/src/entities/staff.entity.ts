import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Partner } from './partner.entity';
import { Contract } from './contract.entity';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    // SQLiteはenum型をサポートしていないため、テスト用に変更
    // type: 'enum',
    type: 'varchar',
    enum: ['稼働中', '待機中', '契約終了'],
    default: '待機中',
  })
  status: string;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column({ nullable: true })
  experience: number;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  resume: string;

  @Column({ nullable: true })
  remarks: string;

  @ManyToOne(() => Partner, partner => partner.staff)
  partner: Partner;

  @OneToMany(() => Contract, contract => contract.staff)
  contracts: Contract[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
