import axios from 'axios';

// APIの基本URL
// 環境変数 > 自動検出 > デフォルト値 の優先順位
const getBaseUrl = () => {
  // 環境変数がある場合はそれを優先
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // ブラウザ環境の場合は現在のホストを基準に設定
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // 同一オリジンのAPIエンドポイント（ポート3001を使用）
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:3001`;
    } else {
      // 本番環境ではAPIルートを使用
      return '/api';
    }
  }
  
  // デフォルト値
  return 'http://localhost:3001';
};

// APIクライアントの基本URL
const API_URL = getBaseUrl();

// メモリストレージ（フォールバック用）
const memoryStorage: Record<string, string> = {};

// 安全なストレージアクセス
const safeStorage = {
  getItem(key: string): string | null {
    try {
      // ブラウザ環境でない場合
      if (typeof window === 'undefined' || !window.localStorage) {
        return memoryStorage[key] || null;
      }
      
      // 通常のローカルストレージアクセス
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('ストレージアクセスエラー、メモリストレージを使用します');
      return memoryStorage[key] || null;
    }
  },
  
  setItem(key: string, value: string): void {
    // メモリ内に常に保存
    memoryStorage[key] = value;
    
    try {
      // ブラウザ環境でない場合
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      
      // 通常のローカルストレージアクセス
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('ストレージアクセスエラー、メモリストレージのみ使用します');
    }
  },
  
  removeItem(key: string): void {
    // メモリストレージから削除
    delete memoryStorage[key];
    
    try {
      // ブラウザ環境でない場合
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      
      // 通常のローカルストレージアクセス
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('ストレージアクセスエラー');
    }
  }
};

// Axiosインスタンスの作成
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15秒でタイムアウト
  withCredentials: true // CORSでクッキーを送信する
});

// リクエストインターセプター：認証トークンを追加
api.interceptors.request.use(
  (config) => {
    // トークンの取得（安全な方法で）
    const token = safeStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター：共通エラーハンドリング
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 認証エラー（401）の場合、ログアウト処理
    if (error.response?.status === 401) {
      safeStorage.removeItem('token');
      safeStorage.removeItem('user');
      
      // 現在のページがログインページでない場合のみリダイレクト
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // オリジナルのエラーを加工して詳細を追加
    if (error.message && error.message.includes('Network Error')) {
      error.isNetworkError = true;
      error.friendlyMessage = 'サーバーに接続できません。サーバーが起動しているか確認してください。';
    }
    
    return Promise.reject(error);
  }
);

// リトライ機能付きのAPI呼び出し
export const callWithRetry = async (fn: Function, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error: any) {
    // ネットワークエラーの場合のみリトライ
    if (
      (error.message && (
        error.message.includes('Network Error') ||
        error.message.includes('net::ERR_CONNECTION_REFUSED') ||
        error.message.includes('timeout')
      )) || 
      !error.response
    ) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return callWithRetry(fn, retries - 1, delay * 1.5);
      }
    }
    
    throw error;
  }
};

export default api;
export { safeStorage };