// services/masterDataService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { MasterData } from '../shared-types';
import { mockMasterData, mockMasterDataTypes } from '../mocks/masterDataMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * マスターデータタイプの一覧を取得する
 * @returns マスターデータタイプの配列
 */
export const getMasterDataTypes = async (): Promise<string[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockMasterDataTypes;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/master-data/types'));
  } catch (error) {
    logError(error, 'getMasterDataTypes');
    throw handleApiError(error, 'マスターデータタイプの取得に失敗しました');
  }
};

/**
 * 特定のタイプのマスターデータを取得する
 * @param type マスターデータタイプ
 * @returns マスターデータの配列
 */
export const getMasterDataByType = async (type: string): Promise<MasterData[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockMasterData.filter(data => data.type === type);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/master-data/type/${type}`));
  } catch (error) {
    logError(error, `getMasterDataByType(${type})`);
    throw handleApiError(error, `タイプ: ${type} のマスターデータの取得に失敗しました`);
  }
};

/**
 * 特定のマスターデータを取得する
 * @param id マスターデータID
 * @returns マスターデータ
 */
export const getMasterDataById = async (id: string): Promise<MasterData> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const masterData = mockMasterData.find(data => data.id === id);
      if (!masterData) {
        throw new Error(`マスターデータID ${id} が見つかりません`);
      }
      return masterData;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/master-data/${id}`));
  } catch (error) {
    logError(error, `getMasterDataById(${id})`);
    throw handleApiError(error, `ID: ${id} のマスターデータの取得に失敗しました`);
  }
};

/**
 * マスターデータを作成する
 * @param type マスターデータタイプ
 * @param data マスターデータ
 * @returns 作成されたマスターデータ
 */
export const createMasterData = async (
  type: string,
  data: Omit<MasterData, 'id' | 'type' | 'createdAt' | 'updatedAt'>
): Promise<MasterData> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const now = new Date().toISOString();
      return {
        id: `master-${Date.now()}`,
        type,
        ...data,
        createdAt: now,
        updatedAt: now
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/master-data', {
      ...data,
      type,
    }));
  } catch (error) {
    logError(error, `createMasterData(${type})`);
    throw handleApiError(error, 'マスターデータの作成に失敗しました');
  }
};

/**
 * マスターデータを更新する
 * @param id マスターデータID
 * @param data 更新データ
 * @returns 更新されたマスターデータ
 */
export const updateMasterData = async (
  id: string,
  data: Partial<MasterData>
): Promise<MasterData> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const masterDataIndex = mockMasterData.findIndex(item => item.id === id);
      if (masterDataIndex === -1) {
        throw new Error(`マスターデータID ${id} が見つかりません`);
      }
      
      const updatedMasterData = {
        ...mockMasterData[masterDataIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return updatedMasterData;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.patch(`/master-data/${id}`, data));
  } catch (error) {
    logError(error, `updateMasterData(${id})`);
    throw handleApiError(error, `ID: ${id} のマスターデータの更新に失敗しました`);
  }
};

/**
 * マスターデータを削除する
 * @param id マスターデータID
 */
export const deleteMasterData = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: MasterData with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/master-data/${id}`));
  } catch (error) {
    logError(error, `deleteMasterData(${id})`);
    throw handleApiError(error, `ID: ${id} のマスターデータの削除に失敗しました`);
  }
};

/**
 * 新しいマスターデータタイプを作成する
 * @param type マスターデータタイプ
 */
export const createMasterDataType = async (type: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: MasterData type ${type} created`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.post('/master-data/types', { type }));
  } catch (error) {
    logError(error, `createMasterDataType(${type})`);
    throw handleApiError(error, `タイプ: ${type} の作成に失敗しました`);
  }
};

// デフォルトエクスポート
const masterDataService = {
  getMasterDataTypes,
  getMasterDataByType,
  getMasterDataById,
  createMasterData,
  updateMasterData,
  deleteMasterData,
  createMasterDataType
};

export default masterDataService;
