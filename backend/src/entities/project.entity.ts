import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Contract } from './contract.entity';
import { Application } from './application.entity';
import { Evaluation } from './evaluation.entity';
import { Department } from './department.entity';
import { Section } from './section.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: false })
  @Index('IDX_PROJECT_DEPARTMENT')
  departmentId: string;

  @ManyToOne(() => Department, department => department.projects, {
    cascade: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ nullable: false })
  @Index('IDX_PROJECT_SECTION')
  sectionId: string;

  @ManyToOne(() => Section, section => section.projects, {
    cascade: false,
    onDelete: 'RESTRICT',
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

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  requiredSkills: string;

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

  // 以下のプロパティはプロジェクトサービスで使用されている
  @Column({ nullable: true })
  requiredHeadcount: number;

  @Column({ nullable: true })
  currentHeadcount: number;

  @Column({ nullable: true })
  approvalStatus: string;

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

  // 以下のプロパティはworkflowsサービスで使用されている
  @Column({ nullable: true })
  approverId: string;

  @Column({ nullable: true })
  approvalDate: Date;

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
