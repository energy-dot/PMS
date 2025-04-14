import { create } from 'zustand';
import authService from '../services/authService';

// メモリストレージ（フォールバック用）
const memoryStorage: Record<string, string> = {};

// 安全なストレージアクセス
export const safeStorage = {
  // ストレージが利用可能かどうかを確認する関数
  isStorageAvailable(): boolean {
    try {
      // ブラウザ環境でない場合
      if (typeof window === 'undefined') {
        return false;
      }
      
      // ストレージが存在するか確認
      if (!window.localStorage) {
        return false;
      }
      
      // テスト用のキーを設定して削除することでアクセス権を確認
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  getItem(key: string): string | null {
    // まずメモリストレージをチェック（常に利用可能）
    const memoryValue = memoryStorage[key] || null;
    
    // ストレージが利用可能な場合のみlocalStorageを試行
    if (this.isStorageAvailable()) {
      try {
        const storageValue = localStorage.getItem(key);
        // localStorageに値がある場合はそれを返し、メモリストレージも更新
        if (storageValue !== null) {
          memoryStorage[key] = storageValue;
          return storageValue;
        }
      } catch (error) {
        console.warn('ストレージ読み取りエラー、メモリストレージを使用します', error);
      }
    }
    
    // localStorageが利用できないか、エラーが発生した場合はメモリストレージを使用
    return memoryValue;
  },
  
  setItem(key: string, value: string): void {
    // メモリ内に常に保存（フォールバック用）
    memoryStorage[key] = value;
    
    // ストレージが利用可能な場合のみlocalStorageを試行
    if (this.isStorageAvailable()) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('ストレージ書き込みエラー、メモリストレージのみ使用します', error);
      }
    }
  },
  
  removeItem(key: string): void {
    // メモリストレージから削除
    delete memoryStorage[key];
    
    // ストレージが利用可能な場合のみlocalStorageを試行
    if (this.isStorageAvailable()) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('ストレージ削除エラー', error);
      }
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
