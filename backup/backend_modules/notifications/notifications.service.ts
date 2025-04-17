import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';
import { CreateNotificationDto } from '../../dto/notifications/create-notification.dto';
import { UpdateNotificationDto } from '../../dto/notifications/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  // 通知関連のメソッド
  async findAllNotifications(): Promise<Notification[]> {
    return this.notificationsRepository.find({
      relations: ['user'],
    });
  }

  async findNotificationById(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException(`通知ID ${id} は見つかりませんでした`);
    }

    return notification;
  }

  async findNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUnreadNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId, isRead: false },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async countUnreadNotificationsByUserId(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      where: { userId, isRead: false },
    });
  }

  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const newNotification = this.notificationsRepository.create(createNotificationDto);
    return this.notificationsRepository.save(newNotification);
  }

  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.findNotificationById(id);

    // 更新対象のエンティティをマージ
    const updatedNotification = this.notificationsRepository.merge(
      notification,
      updateNotificationDto,
    );

    return this.notificationsRepository.save(updatedNotification);
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findNotificationById(id);
    notification.isRead = true;
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update({ userId, isRead: false }, { isRead: true });
  }

  async removeNotification(id: string): Promise<void> {
    const notification = await this.findNotificationById(id);
    await this.notificationsRepository.remove(notification);
  }

  // 通知生成のヘルパーメソッド
  async createSystemNotification(
    userId: string,
    title: string,
    content: string,
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      title,
      content,
      notificationType: 'system',
    });
  }

  async createProjectNotification(
    userId: string,
    title: string,
    content: string,
    projectId: string,
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      title,
      content,
      notificationType: 'project',
      relatedEntityType: 'project',
      relatedEntityId: projectId,
    });
  }

  async createApplicationNotification(
    userId: string,
    title: string,
    content: string,
    applicationId: string,
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      title,
      content,
      notificationType: 'application',
      relatedEntityType: 'application',
      relatedEntityId: applicationId,
    });
  }

  async createApprovalNotification(
    userId: string,
    title: string,
    content: string,
    requestHistoryId: string,
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      title,
      content,
      notificationType: 'approval',
      relatedEntityType: 'requestHistory',
      relatedEntityId: requestHistoryId,
    });
  }
}
