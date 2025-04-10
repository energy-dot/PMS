import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { Partner } from './partner.entity';
import { ContactPerson } from './contact-person.entity';
import { User } from './user.entity';
import { InterviewRecord } from './interview-record.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @ManyToOne(() => Project, project => project.applications, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'partner_id' })
  partnerId: string;

  @ManyToOne(() => Partner, partner => partner.applications, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @Column({ name: 'contact_person_id', nullable: true })
  contactPersonId: string;

  @ManyToOne(() => ContactPerson, contactPerson => contactPerson.applications, {
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({ name: 'contact_person_id' })
  contactPerson: ContactPerson;

  @Column({ name: 'applicant_name' })
  applicantName: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ name: 'nearest_station', nullable: true })
  nearestStation: string;

  @Column({ name: 'desired_rate', nullable: true })
  desiredRate: string;

  @Column({ name: 'skill_summary', type: 'text', nullable: true })
  skillSummary: string;

  @Column({ name: 'skill_sheet_url', nullable: true })
  skillSheetUrl: string;

  @Column({ name: 'application_date' })
  applicationDate: Date;

  @Column({ name: 'application_source', nullable: true })
  applicationSource: string;

  @Column({
    type: 'varchar',
    default: '新規応募'
  })
  status: string;

  @Column({ name: 'document_screener_id', nullable: true })
  documentScreenerId: string;

  @ManyToOne(() => User, user => user.screenedApplications, {
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({ name: 'document_screener_id' })
  documentScreener: User;

  @Column({ name: 'document_screening_comment', type: 'text', nullable: true })
  documentScreeningComment: string;

  @Column({ name: 'final_result_notification_date', nullable: true })
  finalResultNotificationDate: Date;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @OneToMany(() => InterviewRecord, interviewRecord => interviewRecord.application)
  interviewRecords: InterviewRecord[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
