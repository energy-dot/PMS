import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createSafeStorage } from '../utils/storageUtils';

// プロジェクト状態の型定義
interface ProjectState {
  // 状態
  selectedProjectId: string | null;
  recentProjects: string[];

  // セレクター
  getSelectedProjectId: () => string | null;
  getRecentProjects: () => string[];

  // アクション
  selectProject: (projectId: string | null) => void;
  addRecentProject: (projectId: string) => void;
  clearRecentProjects: () => void;
}

// 最大表示する最近のプロジェクト数
const MAX_RECENT_PROJECTS = 5;

/**
 * プロジェクト関連の状態を管理するストア
 */
const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // 初期状態
      selectedProjectId: null,
      recentProjects: [],

      // セレクター - メモ化されたデータアクセス
      getSelectedProjectId: () => get().selectedProjectId,
      getRecentProjects: () => get().recentProjects,

      // アクション
      selectProject: projectId =>
        set({
          selectedProjectId: projectId,
        }),

      addRecentProject: projectId =>
        set(state => {
          // 既存のリストから同じIDを削除
          const filteredList = state.recentProjects.filter(id => id !== projectId);

          // 新しいIDを先頭に追加し、最大数を超える場合は古いものを削除
          const newList = [projectId, ...filteredList].slice(0, MAX_RECENT_PROJECTS);

          return { recentProjects: newList };
        }),

      clearRecentProjects: () =>
        set({
          recentProjects: [],
        }),
    }),
    {
      name: 'pms-project-storage',
      storage: createJSONStorage(createSafeStorage),
    }
  )
);

export default useProjectStore;
