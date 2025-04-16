import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createSafeStorage } from '../utils/storageUtils';

interface UIState {
  // 状態
  sidebarOpen: boolean;
  darkMode: boolean;
  currentView: string;

  // セレクター
  getIsSidebarOpen: () => boolean;
  getIsDarkMode: () => boolean;
  getCurrentView: () => string;

  // アクション
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  setCurrentView: (view: string) => void;
}

/**
 * UI状態を管理するストア
 * ユーザーインターフェースの状態を一元管理し、ページをリロードしても設定を維持する
 */
const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // 初期状態
      sidebarOpen: true,
      darkMode: false,
      currentView: 'dashboard',

      // セレクター - メモ化されたデータアクセス
      getIsSidebarOpen: () => get().sidebarOpen,
      getIsDarkMode: () => get().darkMode,
      getCurrentView: () => get().currentView,

      // アクション
      toggleSidebar: () =>
        set(state => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      setSidebarOpen: isOpen =>
        set({
          sidebarOpen: isOpen,
        }),

      toggleDarkMode: () =>
        set(state => ({
          darkMode: !state.darkMode,
        })),

      setDarkMode: isDark =>
        set({
          darkMode: isDark,
        }),

      setCurrentView: view =>
        set({
          currentView: view,
        }),
    }),
    {
      name: 'pms-ui-storage',
      storage: createJSONStorage(createSafeStorage),
    }
  )
);

export default useUIStore;
