import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Staff } from './staff.entity';
import { AntisocialCheck } from './antisocial-check.entity';
import { BaseContract } from './base-contract.entity';
import { ContactPerson } from './contact-person.entity';
import { CreditCheck } from './credit-check.entity';
import { Application } from './application.entity';

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

  @OneToMany(() => AntisocialCheck, check => check.partner)
  antisocialChecks: AntisocialCheck[];

  @OneToMany(() => BaseContract, contract => contract.partner)
  baseContracts: BaseContract[];

  @OneToMany(() => ContactPerson, contactPerson => contactPerson.partner)
  contactPersons: ContactPerson[];
  
  @OneToMany(() => CreditCheck, creditCheck => creditCheck.partner)
  creditChecks: CreditCheck[];

  @OneToMany(() => Application, application => application.partner)
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
