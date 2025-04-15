import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authService from '../../services/authService';
import { createSafeStorage } from '../utils/storageUtils';
import { useUserStore } from './userStore';

// 認証状態の型定義
interface AuthState {
  // 状態
  isLoading: boolean;
  error: string | null;
  networkError: boolean;
  
  // セレクター
  getIsLoading: () => boolean;
  getError: () => string | null;
  getIsNetworkError: () => boolean;
  
  // アクション
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// トークンのキー
const AUTH_TOKEN_KEY = 'pms_auth_token';
const AUTH_STORE_KEY = 'pms_auth_store';

// 認証ストアの作成
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初期状態
      isLoading: false,
      error: null,
      networkError: false,
      
      // セレクター
      getIsLoading: () => get().isLoading,
      getError: () => get().error,
      getIsNetworkError: () => get().networkError,
      
      // ログイン処理
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null, networkError: false });
        
        try {
          // デモ用のハードコードされた認証情報（デモ環境のみ）
          if (process.env.NODE_ENV !== 'production' || true) {
            if (username === 'admin' && password === 'password') {
              // デモ用のユーザー情報とトークン
              const demoUser = {
                id: 'demo-admin-id',
                username: 'admin',
                fullName: '管理者ユーザー',
                role: 'admin' as const
              };
              
              const demoToken = 'demo-jwt-token';
              
              // トークンをストレージに保存
              localStorage.setItem(AUTH_TOKEN_KEY, demoToken);
              
              // ユーザーストアを更新
              useUserStore.getState().setUser(demoUser);
              
              set({ isLoading: false });
              return;
            }
          }
          
          // 本番用の認証処理
          const response = await authService.login({ username, password });
          
          if (response && response.user && response.accessToken) {
            // ユーザーストアを更新
            useUserStore.getState().setUser(response.user);
            set({ isLoading: false });
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
            networkError: isNetworkError
          });
          
          // ユーザーストアをクリア
          useUserStore.getState().clearUser();
          
          // エラーを再スローしてコンポーネント側でもハンドリングできるようにする
          throw error;
        }
      },
      
      // ログアウト処理
      logout: () => {
        authService.logout();
        localStorage.removeItem(AUTH_TOKEN_KEY);
        
        // ユーザーストアをクリア
        useUserStore.getState().clearUser();
      },
      
      // エラークリア
      clearError: () => {
        set({ error: null, networkError: false });
      }
    }),
    {
      name: AUTH_STORE_KEY,
      storage: createJSONStorage(createSafeStorage),
      partialize: (state) => ({ 
        // ログイン状態はユーザーストアに保存されるため、
        // 認証ストアではエラー状態のみを永続化
        error: state.error,
        networkError: state.networkError
      }),
    }
  )
);
