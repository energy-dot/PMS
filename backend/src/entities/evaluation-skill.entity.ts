import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Evaluation } from './evaluation.entity';

@Entity('evaluation_skills')
export class EvaluationSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'evaluation_id' })
  evaluationId: string;

  @ManyToOne(() => Evaluation, evaluation => evaluation.skills, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'evaluation_id' })
  evaluation: Evaluation;

  @Column({ name: 'skill_name' })
  skillName: string;

  @Column({ name: 'skill_level' })
  skillLevel: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
