// services/notificationService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { Notification } from '../shared-types';
import { mockNotifications } from '../mocks/notificationMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * ユーザーの通知一覧を取得する
 * @param userId ユーザーID
 * @returns 通知の配列
 */
export const getNotificationsByUser = async (userId: string): Promise<Notification[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockNotifications.filter(notification => notification.userId === userId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/users/${userId}/notifications`));
  } catch (error) {
    logError(error, `getNotificationsByUser(${userId})`);
    throw handleApiError(error, `ユーザーID ${userId} の通知情報の取得に失敗しました`);
  }
};

/**
 * ユーザーの通知一覧を取得する（getUserNotifications関数の追加）
 * NotificationBellコンポーネントとの互換性のために追加
 * @returns 通知の配列
 */
export const getUserNotifications = async (): Promise<Notification[]> => {
  try {
    // デフォルトユーザーIDを使用
    const defaultUserId = 'user-1';
    
    // 既存の関数を呼び出す
    return await getNotificationsByUser(defaultUserId);
  } catch (error) {
    logError(error, 'getUserNotifications');
    throw handleApiError(error, '通知情報の取得に失敗しました');
  }
};

/**
 * 特定の通知情報を取得する
 * @param id 通知ID
 * @returns 通知情報
 */
export const getNotificationById = async (id: string): Promise<Notification> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const notification = mockNotifications.find(n => n.id === id);
      if (!notification) {
        throw new Error(`通知ID ${id} が見つかりません`);
      }
      return notification;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/notifications/${id}`));
  } catch (error) {
    logError(error, `getNotificationById(${id})`);
    throw handleApiError(error, `通知ID ${id} の情報取得に失敗しました`);
  }
};

/**
 * 通知を既読にする
 * @param id 通知ID
 * @returns 更新された通知情報
 */
export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const notificationIndex = mockNotifications.findIndex(n => n.id === id);
      if (notificationIndex === -1) {
        throw new Error(`通知ID ${id} が見つかりません`);
      }
      
      const updatedNotification = {
        ...mockNotifications[notificationIndex],
        isRead: true,
      };
      
      return updatedNotification;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.patch(`/notifications/${id}/read`, {}));
  } catch (error) {
    logError(error, `markNotificationAsRead(${id})`);
    throw handleApiError(error, `通知ID ${id} の既読設定に失敗しました`);
  }
};

/**
 * 全ての通知を既読にする
 * @param userId ユーザーID
 * @returns 成功結果
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<{ success: boolean }> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      return { success: true };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post(`/users/${userId}/notifications/read-all`, {}));
  } catch (error) {
    logError(error, `markAllNotificationsAsRead(${userId})`);
    throw handleApiError(error, `ユーザーID ${userId} の全通知既読設定に失敗しました`);
  }
};

/**
 * 通知を削除する
 * @param id 通知ID
 * @returns 削除結果
 */
export const deleteNotification = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: Notification with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/notifications/${id}`));
  } catch (error) {
    logError(error, `deleteNotification(${id})`);
    throw handleApiError(error, `通知ID ${id} の削除に失敗しました`);
  }
};

/**
 * 新しい通知を作成する
 * @param data 通知データ
 * @returns 作成された通知情報
 */
export const createNotification = async (data: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return {
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...data,
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/notifications', data));
  } catch (error) {
    logError(error, 'createNotification');
    throw handleApiError(error, '通知の作成に失敗しました');
  }
};

/**
 * 未読の通知数を取得する
 * @param userId ユーザーID
 * @returns 未読通知数
 */
export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockNotifications.filter(n => n.userId === userId && !n.isRead).length;
    }
    
    // 本番環境APIを使用
    const response = await callWithRetry(() => api.get(`/users/${userId}/notifications/unread-count`));
    return response.count;
  } catch (error) {
    logError(error, `getUnreadNotificationCount(${userId})`);
    throw handleApiError(error, `ユーザーID ${userId} の未読通知数取得に失敗しました`);
  }
};

// デフォルトエクスポート
const notificationService = {
  getNotificationsByUser,
  getUserNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createNotification,
  getUnreadNotificationCount
};

export default notificationService;
