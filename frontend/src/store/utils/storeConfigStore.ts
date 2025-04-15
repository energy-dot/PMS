import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createSafeStorage } from './storageUtils';

// ストア設定の型定義
interface StoreConfig {
  // 状態
  persistenceEnabled: boolean;
  debugMode: boolean;
  
  // セレクター
  getIsPersistenceEnabled: () => boolean;
  getIsDebugMode: () => boolean;
  
  // アクション
  togglePersistence: () => void;
  setPersistenceEnabled: (enabled: boolean) => void;
  toggleDebugMode: () => void;
  setDebugMode: (enabled: boolean) => void;
}

/**
 * ストア設定を管理するストア
 * アプリケーション全体のストア設定を一元管理する
 */
const useStoreConfigStore = create<StoreConfig>()(
  persist(
    (set, get) => ({
      // 初期状態
      persistenceEnabled: true,
      debugMode: false,
      
      // セレクター - メモ化されたデータアクセス
      getIsPersistenceEnabled: () => get().persistenceEnabled,
      getIsDebugMode: () => get().debugMode,
      
      // アクション
      togglePersistence: () => set(state => ({ 
        persistenceEnabled: !state.persistenceEnabled 
      })),
      
      setPersistenceEnabled: (enabled) => set({ 
        persistenceEnabled: enabled 
      }),
      
      toggleDebugMode: () => set(state => ({ 
        debugMode: !state.debugMode 
      })),
      
      setDebugMode: (enabled) => set({ 
        debugMode: enabled 
      }),
    }),
    {
      name: 'pms-store-config',
      storage: createJSONStorage(createSafeStorage),
    }
  )
);

export default useStoreConfigStore;
