// services/baseContractService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { BaseContract } from '../shared-types';
import { mockBaseContracts } from '../mocks/baseContractMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * パートナー会社の基本契約一覧を取得する
 * @param partnerId パートナー会社ID
 * @returns 基本契約の配列
 */
export const getBaseContractsByPartner = async (partnerId: string): Promise<BaseContract[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockBaseContracts.filter(contract => contract.partnerId === partnerId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/partners/${partnerId}/base-contracts`));
  } catch (error) {
    logError(error, `getBaseContractsByPartner(${partnerId})`);
    throw handleApiError(error, `パートナーID ${partnerId} の基本契約情報の取得に失敗しました`);
  }
};

/**
 * すべての基本契約情報を取得する
 * @returns 基本契約の配列
 */
export const getAllBaseContracts = async (): Promise<BaseContract[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockBaseContracts;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/base-contracts'));
  } catch (error) {
    logError(error, 'getAllBaseContracts');
    throw handleApiError(error, '基本契約情報の取得に失敗しました');
  }
};

/**
 * ステータスに基づいて基本契約情報を取得する
 * @param status 契約ステータス
 * @returns 基本契約の配列
 */
export const getBaseContractsByStatus = async (status: string): Promise<BaseContract[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockBaseContracts.filter(contract => contract.status === status);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/base-contracts/status/${status}`));
  } catch (error) {
    logError(error, `getBaseContractsByStatus(${status})`);
    throw handleApiError(error, `ステータス(${status})の基本契約情報の取得に失敗しました`);
  }
};

/**
 * 特定の基本契約情報を取得する
 * @param id 基本契約ID
 * @returns 基本契約情報
 */
export const getBaseContractById = async (id: string): Promise<BaseContract> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const contract = mockBaseContracts.find(c => c.id === id);
      if (!contract) {
        throw new Error(`基本契約ID ${id} が見つかりません`);
      }
      return contract;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/base-contracts/${id}`));
  } catch (error) {
    logError(error, `getBaseContractById(${id})`);
    throw handleApiError(error, `基本契約ID ${id} の情報取得に失敗しました`);
  }
};

/**
 * 新しい基本契約を作成する
 * @param data 基本契約データ
 * @returns 作成された基本契約情報
 */
export const createBaseContract = async (data: Omit<BaseContract, 'id'>): Promise<BaseContract> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return {
        id: `base-contract-${Date.now()}`,
        ...data,
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/base-contracts', data));
  } catch (error) {
    logError(error, 'createBaseContract');
    throw handleApiError(error, '基本契約の作成に失敗しました');
  }
};

/**
 * 基本契約情報を更新する
 * @param id 基本契約ID
 * @param data 更新データ
 * @returns 更新された基本契約情報
 */
export const updateBaseContract = async (
  id: string,
  data: Partial<BaseContract>
): Promise<BaseContract> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const contractIndex = mockBaseContracts.findIndex(c => c.id === id);
      if (contractIndex === -1) {
        throw new Error(`基本契約ID ${id} が見つかりません`);
      }
      
      const updatedContract = {
        ...mockBaseContracts[contractIndex],
        ...data,
      };
      
      return updatedContract;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.put(`/base-contracts/${id}`, data));
  } catch (error) {
    logError(error, `updateBaseContract(${id})`);
    throw handleApiError(error, `基本契約ID ${id} の更新に失敗しました`);
  }
};

/**
 * 基本契約情報の一部を更新する
 * @param id 基本契約ID
 * @param data 更新データ
 * @returns 更新された基本契約情報
 */
export const patchBaseContract = async (
  id: string,
  data: Partial<BaseContract>
): Promise<BaseContract> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const contractIndex = mockBaseContracts.findIndex(c => c.id === id);
      if (contractIndex === -1) {
        throw new Error(`基本契約ID ${id} が見つかりません`);
      }
      
      const updatedContract = {
        ...mockBaseContracts[contractIndex],
        ...data,
      };
      
      return updatedContract;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.patch(`/base-contracts/${id}`, data));
  } catch (error) {
    logError(error, `patchBaseContract(${id})`);
    throw handleApiError(error, `基本契約ID ${id} の部分更新に失敗しました`);
  }
};

/**
 * 基本契約を削除する
 * @param id 基本契約ID
 */
export const deleteBaseContract = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: BaseContract with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/base-contracts/${id}`));
  } catch (error) {
    logError(error, `deleteBaseContract(${id})`);
    throw handleApiError(error, `基本契約ID ${id} の削除に失敗しました`);
  }
};

// デフォルトエクスポート
const baseContractService = {
  getBaseContractsByPartner,
  getAllBaseContracts,
  getBaseContractsByStatus,
  getBaseContractById,
  createBaseContract,
  updateBaseContract,
  patchBaseContract,
  deleteBaseContract,
};

export default baseContractService;
