import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Notification } from './notification.entity';
import { NotificationSetting } from './notification-setting.entity';
import { Application } from './application.entity';
import { Evaluation } from './evaluation.entity';
import { InterviewRecord } from './interview-record.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  department: string;

  @Column({
    // SQLiteはenum型をサポートしていないため、テスト用に変更
    // type: 'enum',
    type: 'varchar',
    enum: ['admin', 'partner_manager', 'developer', 'viewer'],
    default: 'viewer',
  })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLogin: Date;

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @OneToMany(() => NotificationSetting, notificationSetting => notificationSetting.user)
  notificationSettings: NotificationSetting[];

  @OneToMany(() => Application, application => application.documentScreener)
  screenedApplications: Application[];

  @OneToMany(() => Evaluation, evaluation => evaluation.evaluatedUser)
  receivedEvaluations: Evaluation[];

  @OneToMany(() => Evaluation, evaluation => evaluation.evaluator)
  givenEvaluations: Evaluation[];

  @OneToMany(() => InterviewRecord, interviewRecord => interviewRecord.interviewer)
  conductedInterviews: InterviewRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
