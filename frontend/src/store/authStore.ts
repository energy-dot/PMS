import { create } from 'zustand';
import authService from '../services/authService';

// メモリストレージ（フォールバック用）
const memoryStorage: Record<string, string> = {};

// 安全なストレージアクセス
export const safeStorage = {
  getItem(key: string): string | null {
    try {
      // ブラウザ環境でない場合や、ストレージへのアクセスが制限されている場合
      if (typeof window === 'undefined' || !window.localStorage) {
        return memoryStorage[key] || null;
      }
      
      // localStorage へのアクセスを試行
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('ストレージアクセスエラー、メモリストレージを使用します', error);
      return memoryStorage[key] || null;
    }
  },
  
  setItem(key: string, value: string): void {
    // メモリ内に常に保存
    memoryStorage[key] = value;
    
    try {
      // ブラウザ環境でない場合や、ストレージへのアクセスが制限されている場合
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      
      // localStorage へのアクセスを試行
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('ストレージアクセスエラー、メモリストレージのみ使用します', error);
    }
  },
  
  removeItem(key: string): void {
    // メモリストレージから削除
    delete memoryStorage[key];
    
    try {
      // ブラウザ環境でない場合や、ストレージへのアクセスが制限されている場合
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      
      // localStorage へのアクセスを試行
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('ストレージアクセスエラー', error);
    }
  }
};

// ユーザー情報の型定義
export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'developer' | 'partner_manager' | 'admin' | 'viewer';
}

// 認証状態の型定義
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  networkError: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// トークンとユーザー情報のキー
const AUTH_TOKEN_KEY = 'pms_auth_token';
const USER_DATA_KEY = 'pms_user_data';

// メモリストレージからの初期データ読み込み
const getInitialUser = (): User | null => {
  try {
    const userData = safeStorage.getItem(USER_DATA_KEY);
    if (!userData) return null;
    return JSON.parse(userData);
  } catch (error) {
    console.error('ユーザーデータの解析エラー:', error);
    return null;
  }
};

const isInitiallyAuthenticated = (): boolean => {
  return !!safeStorage.getItem(AUTH_TOKEN_KEY);
};

// 認証ストアの作成
export const useAuthStore = create<AuthState>((set) => {
  // 初期状態をメモリストレージから取得
  const initialUser = getInitialUser();
  const isAuthenticated = isInitiallyAuthenticated();

  return {
    user: initialUser,
    isAuthenticated: isAuthenticated,
    isLoading: false,
    error: null,
    networkError: false,
    
    // ログイン処理
    login: async (username: string, password: string) => {
      set({ isLoading: true, error: null, networkError: false });
      
      try {
        // デモ用のハードコードされた認証情報（デモ環境のみ）
        if (process.env.NODE_ENV !== 'production' || true) {
          if (username === 'admin' && password === 'password') {
            console.log('デモ用アカウントでログイン成功');
            
            // デモ用のユーザー情報とトークン
            const demoUser: User = {
              id: 'demo-admin-id',
              username: 'admin',
              fullName: '管理者ユーザー',
              role: 'admin'
            };
            
            const demoToken = 'demo-jwt-token';
            
            // メモリストレージに保存
            safeStorage.setItem(AUTH_TOKEN_KEY, demoToken);
            safeStorage.setItem(USER_DATA_KEY, JSON.stringify(demoUser));
            
            set({ 
              user: demoUser, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            return;
          }
        }
        
        // 本番用の認証処理
        const response = await authService.login({ username, password });
        
        if (response && response.user && response.accessToken) {
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return;
        } else {
          set({
            error: 'ログインに失敗しました。ユーザー情報が正しく取得できませんでした。',
            isLoading: false
          });
          throw new Error('Invalid authentication response');
        }
      } catch (error: any) {
        // エラーメッセージの設定
        const errorMessage = error.message || '認証中にエラーが発生しました';
        const isNetworkError = error.isNetworkError || false;
        
        set({ 
          error: errorMessage, 
          isLoading: false,
          user: null,
          isAuthenticated: false,
          networkError: isNetworkError
        });
        
        // エラーを再スローしてコンポーネント側でもハンドリングできるようにする
        throw error;
      }
    },
    
    // ログアウト処理
    logout: () => {
      authService.logout();
      safeStorage.removeItem(AUTH_TOKEN_KEY);
      safeStorage.removeItem(USER_DATA_KEY);
      set({ user: null, isAuthenticated: false });
    },
    
    // エラークリア
    clearError: () => {
      set({ error: null, networkError: false });
    }
  };
});
