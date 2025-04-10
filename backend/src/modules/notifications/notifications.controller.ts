import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { Notification } from '../../entities/notification.entity';
import { CreateNotificationDto } from '../../dto/notifications/create-notification.dto';
import { UpdateNotificationDto } from '../../dto/notifications/update-notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // 通知関連のエンドポイント
  @Get()
  findAllNotifications(): Promise<Notification[]> {
    return this.notificationsService.findAllNotifications();
  }

  @Get(':id')
  findNotificationById(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.findNotificationById(id);
  }

  @Get('user/:userId')
  findNotificationsByUserId(@Param('userId') userId: string): Promise<Notification[]> {
    return this.notificationsService.findNotificationsByUserId(userId);
  }

  @Get('user/:userId/unread')
  findUnreadNotificationsByUserId(@Param('userId') userId: string): Promise<Notification[]> {
    return this.notificationsService.findUnreadNotificationsByUserId(userId);
  }

  @Get('user/:userId/unread/count')
  countUnreadNotificationsByUserId(@Param('userId') userId: string): Promise<{ count: number }> {
    return this.notificationsService.countUnreadNotificationsByUserId(userId)
      .then(count => ({ count }));
  }

  @Post()
  createNotification(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.createNotification(createNotificationDto);
  }

  @Patch(':id')
  updateNotification(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.updateNotification(id, updateNotificationDto);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('user/:userId/read-all')
  markAllAsRead(@Param('userId') userId: string): Promise<{ success: boolean }> {
    return this.notificationsService.markAllAsRead(userId)
      .then(() => ({ success: true }));
  }

  @Delete(':id')
  removeNotification(@Param('id') id: string): Promise<void> {
    return this.notificationsService.removeNotification(id);
  }

  // 通知生成のヘルパーエンドポイント
  @Post('system')
  createSystemNotification(
    @Body() body: { userId: string; title: string; content: string },
  ): Promise<Notification> {
    return this.notificationsService.createSystemNotification(
      body.userId,
      body.title,
      body.content,
    );
  }

  @Post('project')
  createProjectNotification(
    @Body() body: { userId: string; title: string; content: string; projectId: string },
  ): Promise<Notification> {
    return this.notificationsService.createProjectNotification(
      body.userId,
      body.title,
      body.content,
      body.projectId,
    );
  }

  @Post('application')
  createApplicationNotification(
    @Body() body: { userId: string; title: string; content: string; applicationId: string },
  ): Promise<Notification> {
    return this.notificationsService.createApplicationNotification(
      body.userId,
      body.title,
      body.content,
      body.applicationId,
    );
  }

  @Post('approval')
  createApprovalNotification(
    @Body() body: { userId: string; title: string; content: string; requestHistoryId: string },
  ): Promise<Notification> {
    return this.notificationsService.createApprovalNotification(
      body.userId,
      body.title,
      body.content,
      body.requestHistoryId,
    );
  }
}
