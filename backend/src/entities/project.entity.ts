import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Contract } from './contract.entity';
// 循環参照を避けるためにTypeとしてインポート
import type { Section } from './section.entity';
import type { Department } from './department.entity';
import { Application } from './application.entity';
import { Evaluation } from './evaluation.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // 旧カラム - 移行期間中は残しておく
  @Column()
  department: string;

  // 新カラム - 事業部との関連
  @Column({ nullable: true })
  departmentId: string;

  @ManyToOne('Department', (department: any) => department.projects, {
    cascade: false
  })
  @JoinColumn({ name: 'department_id' })
  departmentObj: Department;

  // 新カラム - 部との関連
  @Column({ nullable: true })
  sectionId: string;

  @ManyToOne('Section', (section: any) => section.projects, {
    cascade: false
  })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @Column({ nullable: true })
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    // SQLiteはenum型をサポートしていないため、テスト用に変更
    // type: 'enum',
    type: 'varchar',
    enum: ['募集中', '選考中', '充足', '承認待ち', '差し戻し', '終了'],
    default: '承認待ち',
  })
  status: string;

  @Column({ nullable: true, type: 'varchar', default: '承認待ち' })
  approvalStatus: string;

  @Column({ nullable: true })
  approverId: string;

  @Column({ nullable: true })
  approvalDate: Date;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  requiredSkills: string;

  @Column({ nullable: true })
  requiredExperience: string;

  @Column({ nullable: true })
  requiredNumber: number;

  @Column({ nullable: true })
  budget: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  workingHours: string;

  @Column({ default: false })
  isRemote: boolean;

  @Column({ nullable: true })
  remarks: string;

  @Column({ nullable: true })
  requiredHeadcount: number;

  @Column({ nullable: true, default: 0 })
  currentHeadcount: number;

  // プロジェクトの契約タイプ
  @Column({ nullable: true })
  contractType: string;

  // 希望単価範囲
  @Column({ nullable: true, type: 'float' })
  rateMin: number;

  @Column({ nullable: true, type: 'float' })
  rateMax: number;

  // 承認関連
  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ nullable: true })
  approvedAt: Date;

  @OneToMany(() => Contract, contract => contract.project)
  contracts: Contract[];

  @OneToMany(() => Application, application => application.project)
  applications: Application[];

  @OneToMany(() => Evaluation, evaluation => evaluation.project)
  evaluations: Evaluation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
