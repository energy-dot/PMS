import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../shared-types';

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

// メモリストレージ（フォールバック用）
const memoryStorage: Record<string, any> = {};

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
          const authState = {
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
          };
          
          // メモリストレージに直接保存（フォールバック用）
          memoryStorage['auth-storage'] = {
            state: {
              isAuthenticated: authState.isAuthenticated,
              user: authState.user,
              token: authState.token,
            },
            version: 0,
          };
          
          set(authState);
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
        // メモリストレージからも削除
        delete memoryStorage['auth-storage'];
        
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
      storage: {
        getItem: (name) => {
          try {
            // まずメモリストレージをチェック
            if (memoryStorage[name]) {
              return Promise.resolve(memoryStorage[name]);
            }
            
            // ブラウザ環境でない場合
            if (typeof window === 'undefined' || !window.localStorage) {
              return Promise.resolve(null);
            }
            
            // localStorageを試行
            try {
              const value = localStorage.getItem(name);
              if (value) {
                const parsed = JSON.parse(value);
                // メモリストレージにも保存
                memoryStorage[name] = parsed;
                return Promise.resolve(parsed);
              }
              return Promise.resolve(null);
            } catch (e) {
              console.warn('ローカルストレージの読み取りに失敗しました:', e);
              return Promise.resolve(null);
            }
          } catch (e) {
            console.error('ストレージアクセスエラー:', e);
            return Promise.resolve(null);
          }
        },
        setItem: (name, value) => {
          // メモリストレージに保存
          memoryStorage[name] = value;
          
          // ブラウザ環境でない場合
          if (typeof window === 'undefined' || !window.localStorage) {
            return Promise.resolve();
          }
          
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (e) {
            console.warn('ローカルストレージの書き込みに失敗しました:', e);
          }
          return Promise.resolve();
        },
        removeItem: (name) => {
          // メモリストレージから削除
          delete memoryStorage[name];
          
          // ブラウザ環境でない場合
          if (typeof window === 'undefined' || !window.localStorage) {
            return Promise.resolve();
          }
          
          try {
            localStorage.removeItem(name);
          } catch (e) {
            console.warn('ローカルストレージの削除に失敗しました:', e);
          }
          return Promise.resolve();
        }
      }
    }
  )
);

// セレクター関数
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectUser = (state: AuthState) => state.user;
export const selectToken = (state: AuthState) => state.token;
export const selectLoading = (state: AuthState) => state.loading;
export const selectError = (state: AuthState) => state.error;
