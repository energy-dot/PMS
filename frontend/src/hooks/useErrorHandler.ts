// hooks/useErrorHandler.ts
import { useState, useCallback } from 'react';
import { getHumanReadableErrorMessage, logError } from '../utils/errorHandler';

/**
 * エラーハンドリングのためのカスタムフック
 * @param context エラーが発生した場所を示すコンテキスト名
 * @returns エラーハンドリングに関連する状態と関数
 */
const useErrorHandler = (context: string) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * 非同期処理を実行し、エラーハンドリングを行う
   * @param asyncOperation 実行する非同期処理
   * @param onSuccess 成功時のコールバック関数
   * @param customErrorMessage カスタムエラーメッセージ
   */
  const handleAsync = useCallback(
    async <T,>(
      asyncOperation: () => Promise<T>,
      onSuccess?: (result: T) => void,
      customErrorMessage?: string
    ): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await asyncOperation();
        if (onSuccess) {
          onSuccess(result);
        }
        return result;
      } catch (err: any) {
        // エラーをログに記録
        logError(err, context);

        // ユーザーフレンドリーなエラーメッセージを設定
        const message = customErrorMessage || getHumanReadableErrorMessage(err);
        setError(message);
        
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  /**
   * エラーメッセージをクリアする
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isLoading,
    handleAsync,
    clearError,
    setError
  };
};

export default useErrorHandler;
