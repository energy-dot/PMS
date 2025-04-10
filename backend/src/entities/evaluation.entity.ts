import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { EvaluationSkill } from './evaluation-skill.entity';

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'staff_id' })
  staffId: string;

  @ManyToOne(() => User, user => user.receivedEvaluations, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'staff_id' })
  staff: User;

  @Column({ name: 'evaluator_id' })
  evaluatorId: string;

  @ManyToOne(() => User, user => user.givenEvaluations, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'evaluator_id' })
  evaluator: User;

  @Column({ name: 'project_id', nullable: true })
  projectId: string;

  @ManyToOne(() => Project, project => project.evaluations, {
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'evaluation_date' })
  evaluationDate: Date;

  @Column({ name: 'technical_skill' })
  technicalSkill: number;

  @Column({ name: 'communication_skill' })
  communicationSkill: number;

  @Column({ name: 'problem_solving' })
  problemSolving: number;

  @Column({ name: 'teamwork' })
  teamwork: number;

  @Column({ name: 'leadership' })
  leadership: number;

  @Column({ name: 'overall_rating' })
  overallRating: number;

  @Column({ type: 'text', nullable: true })
  strengths: string;

  @Column({ name: 'areas_to_improve', type: 'text', nullable: true })
  areasToImprove: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @OneToMany(() => EvaluationSkill, evaluationSkill => evaluationSkill.evaluation, {
    cascade: true
  })
  skills: EvaluationSkill[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
