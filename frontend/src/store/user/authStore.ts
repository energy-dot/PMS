// store/user/authStore.tsの修正 - StoreUser型定義の修正

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../../shared-types';

// ストアで使用するユーザー型
interface StoreUser {
  id: string;
  username: string;
  fullName?: string; // オプショナルに変更
  email: string;
  role: 'developer' | 'partner_manager' | 'admin' | 'viewer' | 'user'; // 'user'を追加
  isActive: boolean;
}

// 認証状態の型定義
interface AuthState {
  isAuthenticated: boolean;
  user: StoreUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// 認証ストアの作成
export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,

      // ログイン処理
      login: async (username, password) => {
        set({ loading: true, error: null });

        try {
          // 本番環境では実際のAPIエンドポイントを呼び出す
          // const response = await api.post('/auth/login', { username, password });

          // デモ用のモックレスポンス
          const mockResponse = {
            token: 'mock-jwt-token',
            user: {
              id: '1',
              username,
              fullName: 'テストユーザー',
              email: `${username}@example.com`,
              role: 'admin',
              isActive: true,
            },
          };

          // 認証成功時の処理
          set({
            isAuthenticated: true,
            user: {
              id: mockResponse.user.id,
              username: mockResponse.user.username,
              fullName: mockResponse.user.fullName,
              email: mockResponse.user.email,
              role: mockResponse.user.role,
              isActive: mockResponse.user.isActive,
            },
            token: mockResponse.token,
            loading: false,
          });
        } catch (error) {
          // 認証失敗時の処理
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: 'ユーザー名またはパスワードが正しくありません',
          });
        }
      },

      // ログアウト処理
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      },

      // エラークリア
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // ローカルストレージのキー
      partialize: state => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

// セレクター関数
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectUser = (state: AuthState) => state.user;
export const selectToken = (state: AuthState) => state.token;
export const selectLoading = (state: AuthState) => state.loading;
export const selectError = (state: AuthState) => state.error;
