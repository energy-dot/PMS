// テスト用スクリプト - エラーハンドリング機能のテスト
// /home/ubuntu/PMS/frontend/src/tests/error-handling.test.ts

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { ApiError, handleApiError, getHumanReadableErrorMessage, retryOperation } from '../utils/errorHandler';
import useErrorHandler from '../hooks/useErrorHandler';
import { renderHook, act } from '@testing-library/react-hooks';

describe('エラーハンドリング機能テスト', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // コンソールエラーをモック化して、テスト出力をクリーンに保つ
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('ApiError', () => {
    it('正しくインスタンス化される', () => {
      const error = new ApiError('テストエラー', 404);
      expect(error.message).toBe('テストエラー');
      expect(error.status).toBe(404);
      expect(error.name).toBe('ApiError');
    });
  });

  describe('handleApiError', () => {
    it('ApiErrorをそのまま再スローする', () => {
      const apiError = new ApiError('既存のApiError', 400);
      expect(() => handleApiError(apiError, 'デフォルトメッセージ')).toThrow(apiError);
    });

    it('レスポンスを持つエラーを適切に変換する', () => {
      const error = {
        response: {
          data: { message: 'サーバーエラーメッセージ' },
          status: 500
        }
      };
      
      try {
        handleApiError(error, 'デフォルトメッセージ');
        fail('エラーがスローされるべき');
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError);
        expect(e.message).toBe('サーバーエラーメッセージ');
        expect(e.status).toBe(500);
      }
    });

    it('レスポンスメッセージがない場合はデフォルトメッセージを使用する', () => {
      const error = {
        response: {
          data: {},
          status: 500
        }
      };
      
      try {
        handleApiError(error, 'デフォルトメッセージ');
        fail('エラーがスローされるべき');
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError);
        expect(e.message).toBe('デフォルトメッセージ');
        expect(e.status).toBe(500);
      }
    });

    it('レスポンスがない場合は500エラーを返す', () => {
      const error = new Error('一般的なエラー');
      
      try {
        handleApiError(error, 'デフォルトメッセージ');
        fail('エラーがスローされるべき');
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError);
        expect(e.message).toBe('デフォルトメッセージ');
        expect(e.status).toBe(500);
      }
    });
  });

  describe('getHumanReadableErrorMessage', () => {
    it('ApiErrorのメッセージをそのまま返す', () => {
      const error = new ApiError('APIエラーメッセージ', 400);
      expect(getHumanReadableErrorMessage(error)).toBe('APIエラーメッセージ');
    });

    it('ステータスコードに基づいて適切なメッセージを返す', () => {
      const error400 = { response: { status: 400, data: { message: 'バリデーションエラー' } } };
      expect(getHumanReadableErrorMessage(error400)).toContain('リクエストが不正です');
      
      const error401 = { response: { status: 401 } };
      expect(getHumanReadableErrorMessage(error401)).toContain('ログインが必要です');
      
      const error404 = { response: { status: 404 } };
      expect(getHumanReadableErrorMessage(error404)).toContain('リソースが見つかりません');
    });

    it('リクエストエラーの場合は接続エラーメッセージを返す', () => {
      const error = { request: {}, message: 'リクエストエラー' };
      expect(getHumanReadableErrorMessage(error)).toContain('サーバーに接続できません');
    });

    it('その他のエラーの場合はエラーメッセージを返す', () => {
      const error = new Error('一般的なエラー');
      expect(getHumanReadableErrorMessage(error)).toBe('一般的なエラー');
    });
  });

  describe('retryOperation', () => {
    it('成功した場合は結果を返す', async () => {
      const operation = jest.fn().mockResolvedValue('成功');
      const result = await retryOperation(operation);
      expect(result).toBe('成功');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('一時的なエラーの場合はリトライする', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce({ response: { status: 500 } })
        .mockResolvedValueOnce('成功');
      
      const result = await retryOperation(operation, 2);
      expect(result).toBe('成功');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('永続的なエラーの場合はリトライしない', async () => {
      const error = { response: { status: 400 } };
      const operation = jest.fn().mockRejectedValue(error);
      
      await expect(retryOperation(operation, 3)).rejects.toEqual(error);
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('最大リトライ回数を超えた場合はエラーをスローする', async () => {
      const error = { response: { status: 500 } };
      const operation = jest.fn().mockRejectedValue(error);
      
      await expect(retryOperation(operation, 3)).rejects.toEqual(error);
      expect(operation).toHaveBeenCalledTimes(3);
    });
  });

  describe('useErrorHandler', () => {
    it('非同期処理を正しく処理する', async () => {
      const successCallback = jest.fn();
      const asyncOperation = jest.fn().mockResolvedValue('成功');
      
      const { result } = renderHook(() => useErrorHandler('テストコンテキスト'));
      
      await act(async () => {
        await result.current.handleAsync(asyncOperation, successCallback);
      });
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(asyncOperation).toHaveBeenCalledTimes(1);
      expect(successCallback).toHaveBeenCalledWith('成功');
    });

    it('エラーを適切に処理する', async () => {
      const error = new Error('テストエラー');
      const asyncOperation = jest.fn().mockRejectedValue(error);
      
      const { result } = renderHook(() => useErrorHandler('テストコンテキスト'));
      
      await act(async () => {
        await result.current.handleAsync(asyncOperation);
      });
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('テストエラー');
      expect(asyncOperation).toHaveBeenCalledTimes(1);
    });

    it('カスタムエラーメッセージを設定できる', async () => {
      const error = new Error('オリジナルエラー');
      const asyncOperation = jest.fn().mockRejectedValue(error);
      const customErrorMessage = 'カスタムエラーメッセージ';
      
      const { result } = renderHook(() => useErrorHandler('テストコンテキスト'));
      
      await act(async () => {
        await result.current.handleAsync(asyncOperation, undefined, customErrorMessage);
      });
      
      expect(result.current.error).toBe(customErrorMessage);
    });

    it('エラーをクリアできる', async () => {
      const error = new Error('テストエラー');
      const asyncOperation = jest.fn().mockRejectedValue(error);
      
      const { result } = renderHook(() => useErrorHandler('テストコンテキスト'));
      
      await act(async () => {
        await result.current.handleAsync(asyncOperation);
      });
      
      expect(result.current.error).toBe('テストエラー');
      
      act(() => {
        result.current.clearError();
      });
      
      expect(result.current.error).toBeNull();
    });
  });
});
