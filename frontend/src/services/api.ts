import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
api.interceptors.request.use(
  (config) => {
    // トークンの取得と設定
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // エラーハンドリング
    if (error.response) {
      // サーバーからのレスポンスがある場合
      console.error('API Error:', error.response.status, error.response.data);
      
      // 認証エラー（401）の場合はログアウト処理
      if (error.response.status === 401) {
        // ログアウト処理
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない場合
      console.error('No response received:', error.request);
    } else {
      // リクエスト設定中にエラーが発生した場合
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// リトライ機能付きAPI呼び出し
export const callWithRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // ネットワークエラーまたは5xxエラーの場合のみリトライ
      if (!error.response || (error.response && error.response.status >= 500)) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
        continue;
      }
      
      // その他のエラーはリトライしない
      throw error;
    }
  }
  
  throw lastError;
};

export default api;
