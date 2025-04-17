// services/applicationService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { Application } from '../shared-types';
import { mockApplications } from '../mocks/applicationMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * 応募情報を取得する
 * @returns 応募情報の配列
 */
export const getApplications = async (): Promise<Application[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockApplications;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/applications'));
  } catch (error) {
    logError(error, 'getApplications');
    throw handleApiError(error, '応募情報の取得に失敗しました');
  }
};

/**
 * プロジェクトIDに基づいて応募情報を取得する
 * @param projectId プロジェクトID
 * @returns 応募情報の配列
 */
export const getApplicationsByProjectId = async (projectId: string): Promise<Application[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockApplications.filter(app => app.projectId === projectId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/applications/project/${projectId}`));
  } catch (error) {
    logError(error, `getApplicationsByProjectId(${projectId})`);
    throw handleApiError(error, `プロジェクト(ID: ${projectId})の応募情報の取得に失敗しました`);
  }
};

/**
 * パートナーIDに基づいて応募情報を取得する
 * @param partnerId パートナーID
 * @returns 応募情報の配列
 */
export const getApplicationsByPartnerId = async (partnerId: string): Promise<Application[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockApplications.filter(app => app.partnerId === partnerId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/applications/partner/${partnerId}`));
  } catch (error) {
    logError(error, `getApplicationsByPartnerId(${partnerId})`);
    throw handleApiError(error, `パートナー(ID: ${partnerId})の応募情報の取得に失敗しました`);
  }
};

/**
 * ステータスに基づいて応募情報を取得する
 * @param status 応募ステータス
 * @returns 応募情報の配列
 */
export const getApplicationsByStatus = async (status: string): Promise<Application[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockApplications.filter(app => app.status === status);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/applications/status/${status}`));
  } catch (error) {
    logError(error, `getApplicationsByStatus(${status})`);
    throw handleApiError(error, `ステータス(${status})の応募情報の取得に失敗しました`);
  }
};

/**
 * 特定の応募情報を取得する
 * @param id 応募ID
 * @returns 応募情報
 */
export const getApplicationById = async (id: string): Promise<Application> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const application = mockApplications.find(a => a.id === id);
      if (!application) {
        throw new Error(`応募ID ${id} が見つかりません`);
      }
      return application;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/applications/${id}`));
  } catch (error) {
    logError(error, `getApplicationById(${id})`);
    throw handleApiError(error, `応募ID ${id} の情報取得に失敗しました`);
  }
};

/**
 * 新しい応募を作成する
 * @param data 応募データ
 * @returns 作成された応募情報
 */
export const createApplication = async (data: Omit<Application, 'id'>): Promise<Application> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return {
        id: `app-${Date.now()}`,
        ...data,
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/applications', data));
  } catch (error) {
    logError(error, 'createApplication');
    throw handleApiError(error, '応募の作成に失敗しました');
  }
};

/**
 * 応募情報を更新する
 * @param id 応募ID
 * @param data 更新データ
 * @returns 更新された応募情報
 */
export const updateApplication = async (
  id: string,
  data: Partial<Application>
): Promise<Application> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const applicationIndex = mockApplications.findIndex(a => a.id === id);
      if (applicationIndex === -1) {
        throw new Error(`応募ID ${id} が見つかりません`);
      }
      
      const updatedApplication = {
        ...mockApplications[applicationIndex],
        ...data,
      };
      
      return updatedApplication;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.put(`/applications/${id}`, data));
  } catch (error) {
    logError(error, `updateApplication(${id})`);
    throw handleApiError(error, `応募ID ${id} の更新に失敗しました`);
  }
};

/**
 * 応募情報の一部を更新する
 * @param id 応募ID
 * @param data 更新データ
 * @returns 更新された応募情報
 */
export const patchApplication = async (
  id: string,
  data: Partial<Application>
): Promise<Application> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const applicationIndex = mockApplications.findIndex(a => a.id === id);
      if (applicationIndex === -1) {
        throw new Error(`応募ID ${id} が見つかりません`);
      }
      
      const updatedApplication = {
        ...mockApplications[applicationIndex],
        ...data,
      };
      
      return updatedApplication;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.patch(`/applications/${id}`, data));
  } catch (error) {
    logError(error, `patchApplication(${id})`);
    throw handleApiError(error, `応募ID ${id} の部分更新に失敗しました`);
  }
};

/**
 * 応募を削除する
 * @param id 応募ID
 * @returns 削除結果
 */
export const deleteApplication = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: Application with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/applications/${id}`));
  } catch (error) {
    logError(error, `deleteApplication(${id})`);
    throw handleApiError(error, `応募ID ${id} の削除に失敗しました`);
  }
};

// デフォルトエクスポート
const applicationService = {
  getApplications,
  getApplicationsByProjectId,
  getApplicationsByPartnerId,
  getApplicationsByStatus,
  getApplicationById,
  createApplication,
  updateApplication,
  patchApplication,
  deleteApplication,
};

export default applicationService;
