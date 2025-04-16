// utils/errorHandler.ts
// エラーハンドリングユーティリティ

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const handleApiError = (error: any, defaultMessage: string): never => {
  if (error instanceof ApiError) {
    throw error;
  }
  
  if (error.response) {
    throw new ApiError(
      error.response.data.message || defaultMessage,
      error.response.status
    );
  }
  
  throw new ApiError(defaultMessage, 500);
};

// エラーメッセージを人間が読みやすい形式に変換する
export const getHumanReadableErrorMessage = (error: any): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || '';
    
    // ステータスコードに基づいたメッセージ
    switch (status) {
      case 400:
        return `リクエストが不正です: ${message || '入力内容を確認してください'}`;
      case 401:
        return 'ログインが必要です。再度ログインしてください';
      case 403:
        return 'この操作を行う権限がありません';
      case 404:
        return `リソースが見つかりません: ${message || '指定されたデータが存在しません'}`;
      case 409:
        return `データの競合が発生しました: ${message || '他のユーザーが同時に編集した可能性があります'}`;
      case 422:
        return `入力データが無効です: ${message || '入力内容を確認してください'}`;
      case 500:
        return 'サーバーエラーが発生しました。しばらく経ってから再度お試しください';
      case 503:
        return 'サービスが一時的に利用できません。しばらく経ってから再度お試しください';
      default:
        return message || 'エラーが発生しました。しばらく経ってから再度お試しください';
    }
  }
  
  if (error.request) {
    return 'サーバーに接続できません。ネットワーク接続を確認してください';
  }
  
  return error.message || 'エラーが発生しました';
};

// エラーをコンソールに記録する
export const logError = (error: any, context?: string): void => {
  if (context) {
    console.error(`Error in ${context}:`, error);
  } else {
    console.error('Error:', error);
  }
  
  // エラー詳細を記録
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
  } else if (error.request) {
    console.error('Request:', error.request);
  } else {
    console.error('Error message:', error.message);
  }
  
  if (error.config) {
    console.error('Request config:', error.config);
  }
  
  // スタックトレースを記録
  console.error('Stack trace:', error.stack);
};

// エラーをグループ化する
export const groupErrors = (errors: Record<string, string>): string => {
  return Object.entries(errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join('\n');
};

// リトライ機能付きの関数実行
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  shouldRetry: (error: any) => boolean = (error) => {
    // デフォルトでは、ネットワークエラーまたは5xxエラーの場合にリトライ
    return !error.response || (error.response && error.response.status >= 500);
  }
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // リトライすべきエラーかどうかを判断
      if (!shouldRetry(error)) {
        throw error;
      }
      
      // 最後の試行ではリトライしない
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // 指数バックオフでリトライ
      const retryDelay = delay * Math.pow(2, attempt);
      console.log(`Retrying operation in ${retryDelay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  throw lastError;
};
