import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';

@Entity('request_histories')
export class RequestHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @ManyToOne(() => Project, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'requester_id' })
  requesterId: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Column({ name: 'request_type' })
  requestType: string;

  @Column({ name: 'request_status', default: '承認待ち' })
  requestStatus: string;

  @Column({ name: 'request_date' })
  requestDate: Date;

  @Column({ name: 'approver_id', nullable: true })
  approverId: string;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'approver_id' })
  approver: User;

  @Column({ name: 'approval_date', nullable: true })
  approvalDate: Date;

  @Column({ name: 'rejection_date', nullable: true })
  rejectionDate: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
