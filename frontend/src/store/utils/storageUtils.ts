import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// メモリストレージ（フォールバック用）
const memoryStorage: Record<string, string> = {};

/**
 * 安全なストレージアクセスを提供するユーティリティ
 * localStorage が利用できない環境でもメモリストレージにフォールバックする
 */
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
        console.warn('ストレージ読み取りエラー、メモリストレージを使用します');
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
        console.warn('ストレージ書き込みエラー、メモリストレージのみ使用します');
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
        console.warn('ストレージ削除エラー');
      }
    }
  },
};

/**
 * Zustandのpersistミドルウェア用のカスタムストレージ
 * safeStorageを使用して、localStorage非対応環境でもメモリにフォールバックする
 */
export const createSafeStorage = () => ({
  getItem: (name: string) => {
    const value = safeStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    safeStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    safeStorage.removeItem(name);
  },
});
