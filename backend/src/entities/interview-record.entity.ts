import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from './application.entity';
import { User } from './user.entity';

@Entity('interview_records')
export class InterviewRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_id' })
  applicationId: string;

  @ManyToOne(() => Application, application => application.interviewRecords, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Column({ name: 'interview_date' })
  interviewDate: Date;

  @Column({ name: 'interviewer_id', nullable: true })
  interviewerId: string;

  @ManyToOne(() => User, user => user.conductedInterviews, {
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({ name: 'interviewer_id' })
  interviewer: User;

  @Column({ name: 'interview_format' })
  interviewFormat: string;

  @Column({ nullable: true })
  evaluation: string;

  @Column({ name: 'evaluation_comment', type: 'text', nullable: true })
  evaluationComment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
