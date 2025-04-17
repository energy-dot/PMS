// services/sectionService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { Section } from '../shared-types';
import { mockSections } from '../mocks/sectionMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * 全てのセクションを取得する
 * @returns セクション情報の配列
 */
export const getAllSections = async (): Promise<Section[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockSections;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/sections'));
  } catch (error) {
    logError(error, 'getAllSections');
    throw handleApiError(error, 'セクション情報の取得に失敗しました');
  }
};

/**
 * 特定の部署に属するセクションを取得する
 * @param departmentId 部署ID
 * @returns セクション情報の配列
 */
export const getSectionsByDepartment = async (departmentId: string): Promise<Section[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockSections.filter(section => section.departmentId === departmentId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/sections`, { params: { departmentId } }));
  } catch (error) {
    logError(error, `getSectionsByDepartment(${departmentId})`);
    throw handleApiError(error, `部署ID: ${departmentId} のセクション取得に失敗しました`);
  }
};

/**
 * 特定のセクションを取得する
 * @param id セクションID
 * @returns セクション情報
 */
export const getSectionById = async (id: string): Promise<Section> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const section = mockSections.find(s => s.id === id);
      if (!section) {
        throw new Error(`セクションID ${id} が見つかりません`);
      }
      return section;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/sections/${id}`));
  } catch (error) {
    logError(error, `getSectionById(${id})`);
    throw handleApiError(error, `ID: ${id} のセクション取得に失敗しました`);
  }
};

/**
 * 新しいセクションを作成する
 * @param data セクションデータ
 * @returns 作成されたセクション情報
 */
export const createSection = async (data: Omit<Section, 'id'>): Promise<Section> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return {
        id: `section-${Date.now()}`,
        ...data,
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/sections', data));
  } catch (error) {
    logError(error, 'createSection');
    throw handleApiError(error, 'セクションの作成に失敗しました');
  }
};

/**
 * セクション情報を更新する
 * @param id セクションID
 * @param data 更新データ
 * @returns 更新されたセクション情報
 */
export const updateSection = async (
  id: string,
  data: Partial<Section>
): Promise<Section> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const sectionIndex = mockSections.findIndex(s => s.id === id);
      if (sectionIndex === -1) {
        throw new Error(`セクションID ${id} が見つかりません`);
      }
      
      const updatedSection = {
        ...mockSections[sectionIndex],
        ...data,
      };
      
      return updatedSection;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.patch(`/sections/${id}`, data));
  } catch (error) {
    logError(error, `updateSection(${id})`);
    throw handleApiError(error, `ID: ${id} のセクション更新に失敗しました`);
  }
};

/**
 * セクションを削除する
 * @param id セクションID
 */
export const deleteSection = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: Section with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/sections/${id}`));
  } catch (error) {
    logError(error, `deleteSection(${id})`);
    throw handleApiError(error, `ID: ${id} のセクション削除に失敗しました`);
  }
};

// デフォルトエクスポート
const sectionService = {
  getAllSections,
  getSectionsByDepartment,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
};

export default sectionService;
