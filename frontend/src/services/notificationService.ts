import api from './api';

// 通知の型定義
export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  notificationType: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  // 関連エンティティ
  user?: any;
}

// 通知作成用DTO
export interface CreateNotificationDto {
  userId: string;
  title: string;
  content: string;
  notificationType: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  isRead?: boolean;
}

// 通知更新用DTO
export interface UpdateNotificationDto extends Partial<CreateNotificationDto> {}

/**
 * 通知関連のAPI操作を行うサービス
 */
const notificationService = {
  /**
   * 通知一覧を取得
   * @returns 通知一覧
   */
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get<Notification[]>('/notifications');
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  /**
   * 通知詳細を取得
   * @param id 通知ID
   * @returns 通知詳細
   */
  async getNotification(id: string): Promise<Notification> {
    try {
      const response = await api.get<Notification>(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get notification ${id} error:`, error);
      throw error;
    }
  },

  /**
   * ユーザーIDを指定して通知一覧を取得
   * @param userId ユーザーID
   * @returns 通知一覧
   */
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    try {
      const response = await api.get<Notification[]>(`/notifications/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Get notifications by user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * ユーザーIDを指定して未読通知一覧を取得
   * @param userId ユーザーID
   * @returns 未読通知一覧
   */
  async getUnreadNotificationsByUser(userId: string): Promise<Notification[]> {
    try {
      const response = await api.get<Notification[]>(`/notifications/user/${userId}/unread`);
      return response.data;
    } catch (error) {
      console.error(`Get unread notifications by user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * ユーザーIDを指定して未読通知数を取得
   * @param userId ユーザーID
   * @returns 未読通知数
   */
  async countUnreadNotificationsByUser(userId: string): Promise<number> {
    try {
      const response = await api.get<{ count: number }>(`/notifications/user/${userId}/unread/count`);
      return response.data.count;
    } catch (error) {
      console.error(`Count unread notifications by user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * 通知を作成
   * @param notificationData 通知データ
   * @returns 作成された通知
   */
  async createNotification(notificationData: CreateNotificationDto): Promise<Notification> {
    try {
      const response = await api.post<Notification>('/notifications', notificationData);
      return response.data;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  },

  /**
   * 通知を更新
   * @param id 通知ID
   * @param notificationData 更新データ
   * @returns 更新された通知
   */
  async updateNotification(id: string, notificationData: UpdateNotificationDto): Promise<Notification> {
    try {
      const response = await api.patch<Notification>(`/notifications/${id}`, notificationData);
      return response.data;
    } catch (error) {
      console.error(`Update notification ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 通知を既読にする
   * @param id 通知ID
   * @returns 更新された通知
   */
  async markAsRead(id: string): Promise<Notification> {
    try {
      const response = await api.patch<Notification>(`/notifications/${id}/read`, {});
      return response.data;
    } catch (error) {
      console.error(`Mark notification ${id} as read error:`, error);
      throw error;
    }
  },

  /**
   * ユーザーの全通知を既読にする
   * @param userId ユーザーID
   * @returns 成功結果
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const response = await api.patch<{ success: boolean }>(`/notifications/user/${userId}/read-all`, {});
      return response.data.success;
    } catch (error) {
      console.error(`Mark all notifications as read for user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * 通知を削除
   * @param id 通知ID
   * @returns 削除結果
   */
  async deleteNotification(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error(`Delete notification ${id} error:`, error);
      throw error;
    }
  },

  /**
   * システム通知を作成
   * @param userId ユーザーID
   * @param title タイトル
   * @param content 内容
   * @returns 作成された通知
   */
  async createSystemNotification(userId: string, title: string, content: string): Promise<Notification> {
    try {
      const response = await api.post<Notification>('/notifications/system', {
        userId,
        title,
        content
      });
      return response.data;
    } catch (error) {
      console.error('Create system notification error:', error);
      throw error;
    }
  },

  /**
   * プロジェクト関連の通知を作成
   * @param userId ユーザーID
   * @param title タイトル
   * @param content 内容
   * @param projectId プロジェクトID
   * @returns 作成された通知
   */
  async createProjectNotification(userId: string, title: string, content: string, projectId: string): Promise<Notification> {
    try {
      const response = await api.post<Notification>('/notifications/project', {
        userId,
        title,
        content,
        projectId
      });
      return response.data;
    } catch (error) {
      console.error('Create project notification error:', error);
      throw error;
    }
  },

  /**
   * 応募関連の通知を作成
   * @param userId ユーザーID
   * @param title タイトル
   * @param content 内容
   * @param applicationId 応募ID
   * @returns 作成された通知
   */
  async createApplicationNotification(userId: string, title: string, content: string, applicationId: string): Promise<Notification> {
    try {
      const response = await api.post<Notification>('/notifications/application', {
        userId,
        title,
        content,
        applicationId
      });
      return response.data;
    } catch (error) {
      console.error('Create application notification error:', error);
      throw error;
    }
  },

  /**
   * 承認関連の通知を作成
   * @param userId ユーザーID
   * @param title タイトル
   * @param content 内容
   * @param requestHistoryId 申請履歴ID
   * @returns 作成された通知
   */
  async createApprovalNotification(userId: string, title: string, content: string, requestHistoryId: string): Promise<Notification> {
    try {
      const response = await api.post<Notification>('/notifications/approval', {
        userId,
        title,
        content,
        requestHistoryId
      });
      return response.data;
    } catch (error) {
      console.error('Create approval notification error:', error);
      throw error;
    }
  }
};

export default notificationService;
