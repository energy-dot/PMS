import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDepartments, getDepartmentById } from '../services/departmentService';
import { mockDepartments } from '../mocks/departmentMock';
import * as api from '../services/api';
import { handleApiError } from '../utils/errorHandler';

// APIモジュールをモック化
vi.mock('../services/api', () => ({
  callWithRetry: vi.fn(),
  USE_MOCK_DATA: true
}));

// エラーハンドラーをモック化
vi.mock('../utils/errorHandler', () => ({
  handleApiError: vi.fn((error, message) => {
    throw new Error(`${message}: ${error.message}`);
  }),
  logError: vi.fn()
}));

describe('departmentService', () => {
  beforeEach(() => {
    // テスト前にモックをリセット
    vi.clearAllMocks();
  });

  describe('getDepartments', () => {
    it('モックモードでは部署一覧を返す', async () => {
      const result = await getDepartments();
      
      // モックデータが返されることを確認
      expect(result).toEqual(mockDepartments);
      
      // モックモードではAPIは呼ばれないことを確認
      expect(api.callWithRetry).not.toHaveBeenCalled();
    });

    it('本番モードではAPIを呼び出す', async () => {
      // 一時的にモックモードをオフに設定
      const originalUseMode = api.USE_MOCK_DATA;
      Object.defineProperty(api, 'USE_MOCK_DATA', { value: false });
      
      const mockResponse = [{ id: 'test-dept', name: 'テスト部署' }];
      
      // APIレスポンスをモック
      vi.mocked(api.callWithRetry).mockResolvedValueOnce(mockResponse);
      
      const result = await getDepartments();
      
      // APIが正しく呼び出されたことを確認
      expect(api.callWithRetry).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      
      // モックモードを元に戻す
      Object.defineProperty(api, 'USE_MOCK_DATA', { value: originalUseMode });
    });

    it('エラー発生時は適切にハンドリングする', async () => {
      // 一時的にモックモードをオフに設定
      const originalUseMode = api.USE_MOCK_DATA;
      Object.defineProperty(api, 'USE_MOCK_DATA', { value: false });
      
      // APIエラーをモック
      const mockError = new Error('API接続エラー');
      vi.mocked(api.callWithRetry).mockRejectedValueOnce(mockError);
      
      // エラーがスローされることを確認
      await expect(getDepartments()).rejects.toThrow();
      
      // エラーハンドラーが呼ばれたことを確認
      expect(handleApiError).toHaveBeenCalledWith(mockError, '部署情報の取得に失敗しました');
      
      // モックモードを元に戻す
      Object.defineProperty(api, 'USE_MOCK_DATA', { value: originalUseMode });
    });
  });

  describe('getDepartmentById', () => {
    it('モックモードでは特定の部署を返す', async () => {
      const departmentId = 'dept-1';
      const result = await getDepartmentById(departmentId);
      
      // 指定されたIDの部署が返されることを確認
      expect(result).toEqual(mockDepartments.find(d => d.id === departmentId));
      
      // モックモードではAPIは呼ばれないことを確認
      expect(api.callWithRetry).not.toHaveBeenCalled();
    });

    it('存在しない部署IDの場合はエラーをスローする', async () => {
      const nonExistentId = 'non-existent-id';
      
      // エラーがスローされることを確認
      await expect(getDepartmentById(nonExistentId)).rejects.toThrow(`部署ID ${nonExistentId} が見つかりません`);
      
      // モックモードではAPIは呼ばれないことを確認
      expect(api.callWithRetry).not.toHaveBeenCalled();
    });
  });
});
