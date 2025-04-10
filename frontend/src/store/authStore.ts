import { create } from 'zustand';
import authService from '../services/authService';

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

// 認証ストアの作成
export const useAuthStore = create<AuthState>((set) => {
  // 初期状態をauthServiceから取得
  const initialUser = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

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
        const response = await authService.login({ username, password });
        
        if (response && response.user && response.accessToken) {
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return response;
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
      set({ user: null, isAuthenticated: false });
    },
    
    // エラークリア
    clearError: () => {
      set({ error: null, networkError: false });
    }
  };
});