import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNotificationsByUser, markNotificationAsRead } from '../services/notificationService';
import { mockNotifications } from '../mocks/notificationMock';
import * as api from '../services/api';

// APIモジュールをモック化
vi.mock('../services/api', () => ({
  callWithRetry: vi.fn(),
  USE_MOCK_DATA: true
}));

describe('notificationService', () => {
  beforeEach(() => {
    // テスト前にモックをリセット
    vi.clearAllMocks();
  });

  describe('getNotificationsByUser', () => {
    it('モックモードでは特定ユーザーの通知を返す', async () => {
      const userId = 'user-1';
      const result = await getNotificationsByUser(userId);
      
      // ユーザーIDに一致する通知のみが返されることを確認
      expect(result).toEqual(mockNotifications.filter(n => n.userId === userId));
      
      // モックモードではAPIは呼ばれないことを確認
      expect(api.callWithRetry).not.toHaveBeenCalled();
    });

    it('本番モードではAPIを呼び出す', async () => {
      // 一時的にモックモードをオフに設定
      const originalUseMode = api.USE_MOCK_DATA;
      Object.defineProperty(api, 'USE_MOCK_DATA', { value: false });
      
      const userId = 'user-1';
      const mockResponse = [{ id: 'test-notif', userId, title: 'Test' }];
      
      // APIレスポンスをモック
      vi.mocked(api.callWithRetry).mockResolvedValueOnce(mockResponse);
      
      const result = await getNotificationsByUser(userId);
      
      // APIが正しく呼び出されたことを確認
      expect(api.callWithRetry).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      
      // モックモードを元に戻す
      Object.defineProperty(api, 'USE_MOCK_DATA', { value: originalUseMode });
    });
  });

  describe('markNotificationAsRead', () => {
    it('モックモードでは通知を既読に更新する', async () => {
      const notificationId = 'notif-1';
      const result = await markNotificationAsRead(notificationId);
      
      // 通知が既読に更新されていることを確認
      expect(result.isRead).toBe(true);
      expect(result.id).toBe(notificationId);
      
      // モックモードではAPIは呼ばれないことを確認
      expect(api.callWithRetry).not.toHaveBeenCalled();
    });
  });
});
