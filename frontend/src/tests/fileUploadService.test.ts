import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadFile, getFilesByEntity } from '../services/fileUploadService';
import { mockFileUploads } from '../mocks/fileUploadMock';
import * as api from '../services/api';

// APIモジュールをモック化
vi.mock('../services/api', () => ({
  callWithRetry: vi.fn(),
  USE_MOCK_DATA: true
}));

describe('fileUploadService', () => {
  beforeEach(() => {
    // テスト前にモックをリセット
    vi.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('モックモードではファイルアップロード情報を返す', async () => {
      // FormDataを作成
      const formData = new FormData();
      const mockFile = new File(['テストファイル内容'], 'test.pdf', { type: 'application/pdf' });
      formData.append('file', mockFile);
      formData.append('entityType', 'project');
      formData.append('entityId', 'proj-test');
      formData.append('description', 'テスト用ファイル');
      formData.append('uploadedBy', 'user-test');
      
      const result = await uploadFile(formData);
      
      // 結果の検証
      expect(result).toHaveProperty('id');
      expect(result.originalName).toBe('test.pdf');
      expect(result.mimeType).toBe('application/pdf');
      expect(result.entityType).toBe('project');
      expect(result.entityId).toBe('proj-test');
      expect(result.description).toBe('テスト用ファイル');
      
      // モックモードではAPIは呼ばれないことを確認
      expect(api.callWithRetry).not.toHaveBeenCalled();
    });

    it('本番モードではAPIを呼び出す', async () => {
      // 一時的にモックモードをオフに設定
      const originalUseMode = api.USE_MOCK_DATA;
      Object.defineProperty(api, 'USE_MOCK_DATA', { value: false });
      
      const formData = new FormData();
      const mockFile = new File(['テストファイル内容'], 'test.pdf', { type: 'application/pdf' });
      formData.append('file', mockFile);
      
      const mockResponse = { id: 'file-test', fileName: 'uploaded-test.pdf' };
      
      // APIレスポンスをモック
      vi.mocked(api.callWithRetry).mockResolvedValueOnce(mockResponse);
      
      const result = await uploadFile(formData);
      
      // APIが正しく呼び出されたことを確認
      expect(api.callWithRetry).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      
      // モックモードを元に戻す
      Object.defineProperty(api, 'USE_MOCK_DATA', { value: originalUseMode });
    });
  });

  describe('getFilesByEntity', () => {
    it('モックモードではエンティティに関連するファイル一覧を返す', async () => {
      const entityType = 'project';
      const entityId = 'proj-1';
      
      const result = await getFilesByEntity(entityType, entityId);
      
      // エンティティタイプとIDに一致するファイルのみが返されることを確認
      expect(result).toEqual(
        mockFileUploads.filter(f => f.entityType === entityType && f.entityId === entityId)
      );
      
      // モックモードではAPIは呼ばれないことを確認
      expect(api.callWithRetry).not.toHaveBeenCalled();
    });
  });
});
