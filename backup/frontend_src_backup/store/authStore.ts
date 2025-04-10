import { create } from 'zustand';

// ユーザー情報の型定義
interface User {
  id: string;
  name: string;
  role: 'developer' | 'partner_manager' | 'admin' | 'viewer';
}

// 認証状態の型定義
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// 認証ストアの作成
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // ログイン処理
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // 実際の実装ではAPIリクエストを行う
      // ここではモック実装
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ログイン成功時
      if (username === 'admin' && password === 'password') {
        const user: User = {
          id: '1',
          name: '管理者',
          role: 'admin'
        };
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        // ログイン失敗時
        set({ error: 'ユーザー名またはパスワードが正しくありません', isLoading: false });
      }
    } catch (error) {
      set({ error: '認証中にエラーが発生しました', isLoading: false });
    }
  },
  
  // ログアウト処理
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  // エラークリア
  clearError: () => {
    set({ error: null });
  }
}));
