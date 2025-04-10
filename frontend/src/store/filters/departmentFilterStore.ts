import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DepartmentFilterState {
  selectedDepartmentId: string | null;
  selectedSectionId: string | null;
  setDepartment: (departmentId: string | null) => void;
  setSection: (sectionId: string | null) => void;
  reset: () => void;
}

/**
 * 事業部・部フィルタの状態を管理するストア
 * ブラウザのローカルストレージに状態を保存し、ページをリロードしても選択状態を維持する
 */
const useDepartmentFilterStore = create<DepartmentFilterState>()(
  persist(
    (set) => ({
      selectedDepartmentId: null,
      selectedSectionId: null,
      
      setDepartment: (departmentId) => set({ 
        selectedDepartmentId: departmentId,
        // 事業部が変更されたら部の選択をクリア
        selectedSectionId: null
      }),
      
      setSection: (sectionId) => set({ selectedSectionId: sectionId }),
      
      reset: () => set({ 
        selectedDepartmentId: null, 
        selectedSectionId: null 
      }),
    }),
    {
      name: 'department-filter-storage', // ストレージのキー名
    }
  )
);

export default useDepartmentFilterStore;
