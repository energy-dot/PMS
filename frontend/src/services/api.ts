// APIユーティリティ関数をエクスポート

// リクエストオプションの型定義
interface RequestOptions {
  headers?: Record<string, string>;
  [key: string]: any;
}

// デフォルトエクスポートとしてAPIクライアントを提供
const api = {
  // 基本的なHTTPメソッド
  get: async <T = any>(url: string, options: RequestOptions = {}) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error('API GET request failed:', error);
      throw error;
    }
  },

  post: async <T = any>(url: string, data: any, options: RequestOptions = {}) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error('API POST request failed:', error);
      throw error;
    }
  },

  put: async <T = any>(url: string, data: any, options: RequestOptions = {}) => {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error('API PUT request failed:', error);
      throw error;
    }
  },

  patch: async <T = any>(url: string, data: any, options: RequestOptions = {}) => {
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error('API PATCH request failed:', error);
      throw error;
    }
  },

  delete: async <T = any>(url: string, options: RequestOptions = {}) => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error('API DELETE request failed:', error);
      throw error;
    }
  },
};

export default api;

// APIユーティリティ関数
export const callWithRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    console.log(
      `API呼び出しに失敗しました。${delay}ms後に再試行します。残り再試行回数: ${retries}`
    );

    await new Promise(resolve => setTimeout(resolve, delay));
    return callWithRetry(fn, retries - 1, delay * 2);
  }
};
