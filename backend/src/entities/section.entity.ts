import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Department } from './department.entity';
import { Project } from './project.entity';

@Entity('sections')
@Index('IDX_SECTION_CODE', ['code'], { unique: true })
@Index('IDX_SECTION_DEPARTMENT', ['departmentId'])
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  departmentId: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Department, department => department.sections, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => Project, project => project.section)
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
