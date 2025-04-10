import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Department } from './department.entity';
// 循環参照を避けるためにTypeとしてインポート
import type { Project } from './project.entity';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  departmentId: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Department, department => department.sections)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  // プロジェクトとの関連 - 文字列で参照
  @OneToMany('Project', (project: any) => project.section, {
    cascade: false
  })
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}