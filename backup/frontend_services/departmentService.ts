// services/departmentService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { Department, Section } from '../shared-types';
import { mockDepartments, mockSections } from '../mocks/departmentMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * 部署情報を取得する
 * @returns 部署情報の配列
 */
export const getDepartments = async (): Promise<Department[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockDepartments;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/departments'));
  } catch (error) {
    logError(error, 'getDepartments');
    throw handleApiError(error, '部署情報の取得に失敗しました');
  }
};

/**
 * 特定の部署情報を取得する
 * @param id 部署ID
 * @returns 部署情報
 */
export const getDepartmentById = async (id: string): Promise<Department> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const department = mockDepartments.find(d => d.id === id);
      if (!department) {
        throw new Error(`部署ID ${id} が見つかりません`);
      }
      return department;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/departments/${id}`));
  } catch (error) {
    logError(error, `getDepartmentById(${id})`);
    throw handleApiError(error, `部署ID ${id} の情報取得に失敗しました`);
  }
};

/**
 * 部署のセクション情報を取得する
 * @param departmentId 部署ID
 * @returns セクション情報の配列
 */
export const getDepartmentSections = async (departmentId: string): Promise<Section[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockSections.filter(section => section.departmentId === departmentId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/departments/${departmentId}/sections`));
  } catch (error) {
    logError(error, `getDepartmentSections(${departmentId})`);
    throw handleApiError(error, `部署ID ${departmentId} のセクション情報取得に失敗しました`);
  }
};

/**
 * 新しい部署を作成する
 * @param data 部署データ
 * @returns 作成された部署情報
 */
export const createDepartment = async (data: Omit<Department, 'id'>): Promise<Department> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return {
        id: `dept-${Date.now()}`,
        ...data,
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/departments', data));
  } catch (error) {
    logError(error, 'createDepartment');
    throw handleApiError(error, '部署の作成に失敗しました');
  }
};

/**
 * 部署情報を更新する
 * @param id 部署ID
 * @param data 更新データ
 * @returns 更新された部署情報
 */
export const updateDepartment = async (
  id: string,
  data: Partial<Department>
): Promise<Department> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const departmentIndex = mockDepartments.findIndex(d => d.id === id);
      if (departmentIndex === -1) {
        throw new Error(`部署ID ${id} が見つかりません`);
      }
      
      const updatedDepartment = {
        ...mockDepartments[departmentIndex],
        ...data,
      };
      
      return updatedDepartment;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.put(`/departments/${id}`, data));
  } catch (error) {
    logError(error, `updateDepartment(${id})`);
    throw handleApiError(error, `部署ID ${id} の更新に失敗しました`);
  }
};

/**
 * 部署を削除する
 * @param id 部署ID
 */
export const deleteDepartment = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: Department with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/departments/${id}`));
  } catch (error) {
    logError(error, `deleteDepartment(${id})`);
    throw handleApiError(error, `部署ID ${id} の削除に失敗しました`);
  }
};

// デフォルトエクスポート
const departmentService = {
  getDepartments,
  getDepartmentById,
  getDepartmentSections,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};

export default departmentService;
