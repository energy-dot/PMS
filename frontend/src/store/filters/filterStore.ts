import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createSafeStorage } from '../utils/storageUtils';

interface FilterState {
  // 状態
  selectedDepartmentId: string | null;
  selectedSectionId: string | null;

  // セレクター
  getSelectedDepartmentId: () => string | null;
  getSelectedSectionId: () => string | null;

  // アクション
  setDepartment: (departmentId: string | null) => void;
  setSection: (sectionId: string | null) => void;
  reset: () => void;
}

/**
 * 事業部・部フィルタの状態を管理するストア
 * ブラウザのローカルストレージに状態を保存し、ページをリロードしても選択状態を維持する
 */
const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      // 初期状態
      selectedDepartmentId: null,
      selectedSectionId: null,

      // セレクター
      getSelectedDepartmentId: () => get().selectedDepartmentId,
      getSelectedSectionId: () => get().selectedSectionId,

      // アクション
      setDepartment: departmentId =>
        set({
          selectedDepartmentId: departmentId,
          // 事業部が変更されたら部の選択をクリア
          selectedSectionId: null,
        }),

      setSection: sectionId => set({ selectedSectionId: sectionId }),

      reset: () =>
        set({
          selectedDepartmentId: null,
          selectedSectionId: null,
        }),
    }),
    {
      name: 'pms-filter-storage', // ストレージのキー名
      storage: createJSONStorage(createSafeStorage),
    }
  )
);

export default useFilterStore;
