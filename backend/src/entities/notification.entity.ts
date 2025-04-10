import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, user => user.notifications, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'notification_type' })
  notificationType: string;

  @Column({ name: 'related_entity_type', nullable: true })
  relatedEntityType: string;

  @Column({ name: 'related_entity_id', nullable: true })
  relatedEntityId: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;
  
  @Column({ name: 'priority', default: 'normal', nullable: true })
  priority: string;
  
  @Column({ name: 'expiration_date', nullable: true })
  expirationDate: Date;
  
  @Column({ name: 'action_url', nullable: true })
  actionUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
