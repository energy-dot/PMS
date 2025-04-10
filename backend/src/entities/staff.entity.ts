import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Partner } from './partner.entity';
import { Contract } from './contract.entity';
import { Department } from './department.entity';
import { Section } from './section.entity';

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
    enum: ['稼働中', '待機中', '契約終了', '選考中', '予約済み'],
    default: '待機中',
  })
  status: string;

  @Column('simple-array', { nullable: true })
  skills: string[];

  // スキルレベルをJSONとして格納（SQLiteではJSONをサポートしていないため、TEXTとして格納し、アプリケーション側で変換）
  @Column('simple-json', { nullable: true, default: '{}' })
  skillLevels: Record<string, number>;

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

  // 事業部への参照を追加
  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: true })
  departmentId: string;

  // 部への参照を追加
  @ManyToOne(() => Section, { nullable: true })
  @JoinColumn({ name: 'sectionId' })
  section: Section;

  @Column({ nullable: true })
  sectionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
