import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import { createSafeStorage } from './storageUtils';

/**
 * 永続化を使用するストアを作成するヘルパー関数
 * 
 * @param name ストレージキー名
 * @param stateCreator 状態作成関数
 * @param options オプション設定
 * @returns Zustandストア
 */
export function createPersistentStore<T extends object>(
  name: string,
  stateCreator: (set: any, get: any) => T,
  options?: {
    partialize?: (state: T) => Partial<T>;
  }
) {
  // 永続化の設定
  const persistConfig: PersistOptions<T> = {
    name,
    storage: createJSONStorage(createSafeStorage),
  };
  
  if (options?.partialize) {
    // 型アサーションを使用して型エラーを回避
    persistConfig.partialize = options.partialize as (state: T) => T;
  }
  
  // 永続化ミドルウェアを適用
  const persistedStateCreator = persist(stateCreator, persistConfig);
  
  // ストアを作成して返す
  return create(persistedStateCreator);
}
