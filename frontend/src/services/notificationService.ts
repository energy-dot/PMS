import api, { callWithRetry } from './api';

/**
 * 通知サービス
 */

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
}

/**
 * ユーザーの通知一覧を取得する
 * @param userId ユーザーID
 * @returns 通知の配列
 */
export const getNotificationsByUser = async (userId: string): Promise<Notification[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Notification[]>(`/users/${userId}/notifications`));

    // デモ用のモックデータ
    return [
      {
        id: 'notif-1',
        userId,
        title: '新規応募があります',
        message: 'プロジェクト「ECサイトリニューアル」に新しい応募がありました。',
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        userId,
        title: '契約が承認されました',
        message: '「社内業務システム開発」の契約が承認されました。',
        type: 'success',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1日前
      },
    ];
  } catch (error) {
    console.error(`ユーザーID ${userId} の通知情報の取得に失敗しました`, error);
    throw error;
  }
};

/**
 * 特定の通知情報を取得する
 * @param id 通知ID
 * @returns 通知情報
 */
export const getNotificationById = async (id: string): Promise<Notification> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Notification>(`/notifications/${id}`));

    // デモ用のモックデータ
    const mockNotifications = [
      {
        id: 'notif-1',
        userId: 'user-1',
        title: '新規応募があります',
        message: 'プロジェクト「ECサイトリニューアル」に新しい応募がありました。',
        type: 'info' as const,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        userId: 'user-1',
        title: '契約が承認されました',
        message: '「社内業務システム開発」の契約が承認されました。',
        type: 'success' as const,
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1日前
      },
    ];

    const notification = mockNotifications.find(n => n.id === id);

    if (!notification) {
      throw new Error(`通知ID ${id} が見つかりません`);
    }

    return notification;
  } catch (error) {
    console.error(`通知ID ${id} の情報取得に失敗しました`, error);
    throw error;
  }
};

/**
 * 通知を既読にする
 * @param id 通知ID
 * @returns 更新された通知情報
 */
export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.patch<Notification>(`/notifications/${id}/read`, {}));

    // デモ用のモックレスポンス
    const notification = await getNotificationById(id);
    return {
      ...notification,
      isRead: true,
    };
  } catch (error) {
    console.error(`通知ID ${id} の既読設定に失敗しました`, error);
    throw error;
  }
};

/**
 * 全ての通知を既読にする
 * @param userId ユーザーID
 * @returns 成功結果
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<{ success: boolean }> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.post<{ success: boolean }>(`/users/${userId}/notifications/read-all`, {}));

    // デモ用のモックレスポンス
    return { success: true };
  } catch (error) {
    console.error(`ユーザーID ${userId} の全通知既読設定に失敗しました`, error);
    throw error;
  }
};

/**
 * 通知を削除する
 * @param id 通知ID
 * @returns 削除結果
 */
export const deleteNotification = async (id: string): Promise<{ success: boolean }> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.delete<{ success: boolean }>(`/notifications/${id}`));

    // デモ用のモックレスポンス
    return { success: true };
  } catch (error) {
    console.error(`通知ID ${id} の削除に失敗しました`, error);
    throw error;
  }
};

// デフォルトエクスポートを追加
const notificationService = {
  getNotificationsByUser,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};

export default notificationService;
