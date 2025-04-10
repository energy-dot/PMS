import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Notification } from './notification.entity';
import { NotificationSetting } from './notification-setting.entity';

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

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @OneToMany(() => NotificationSetting, notificationSetting => notificationSetting.user)
  notificationSettings: NotificationSetting[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
