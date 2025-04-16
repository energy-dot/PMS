import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createSafeStorage } from '../utils/storageUtils';

// ユーザー情報の型定義
export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'developer' | 'partner_manager' | 'admin' | 'viewer';
}

// ユーザー状態の型定義
interface UserState {
  // 状態
  user: User | null;
  isAuthenticated: boolean;

  // セレクター
  getUser: () => User | null;
  getIsAuthenticated: () => boolean;
  getUserRole: () => string | null;

  // アクション
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

// トークンとユーザー情報のキー
const USER_STORE_KEY = 'pms_user_store';

// ユーザーストアの作成
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初期状態
      user: null,
      isAuthenticated: false,

      // セレクター - メモ化されたデータアクセス
      getUser: () => get().user,
      getIsAuthenticated: () => get().isAuthenticated,
      getUserRole: () => get().user?.role || null,

      // アクション
      setUser: user =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: USER_STORE_KEY,
      storage: createJSONStorage(createSafeStorage),
    }
  )
);
