// services/contractService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { Contract } from '../shared-types';
import { mockContracts } from '../mocks/contractMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * 契約情報を取得する
 * @returns 契約情報の配列
 */
export const getContracts = async (): Promise<Contract[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockContracts;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/contracts'));
  } catch (error) {
    logError(error, 'getContracts');
    throw handleApiError(error, '契約情報の取得に失敗しました');
  }
};

/**
 * プロジェクトIDに基づいて契約情報を取得する
 * @param projectId プロジェクトID
 * @returns 契約情報の配列
 */
export const getContractsByProjectId = async (projectId: string): Promise<Contract[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockContracts.filter(contract => contract.projectId === projectId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/contracts/project/${projectId}`));
  } catch (error) {
    logError(error, `getContractsByProjectId(${projectId})`);
    throw handleApiError(error, `プロジェクト(ID: ${projectId})の契約情報の取得に失敗しました`);
  }
};

/**
 * スタッフIDに基づいて契約情報を取得する
 * @param staffId スタッフID
 * @returns 契約情報の配列
 */
export const getContractsByStaffId = async (staffId: string): Promise<Contract[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockContracts.filter(contract => contract.staffId === staffId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/contracts/staff/${staffId}`));
  } catch (error) {
    logError(error, `getContractsByStaffId(${staffId})`);
    throw handleApiError(error, `スタッフ(ID: ${staffId})の契約情報の取得に失敗しました`);
  }
};

/**
 * ステータスに基づいて契約情報を取得する
 * @param status 契約ステータス
 * @returns 契約情報の配列
 */
export const getContractsByStatus = async (status: string): Promise<Contract[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockContracts.filter(contract => contract.status === status);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/contracts/status/${status}`));
  } catch (error) {
    logError(error, `getContractsByStatus(${status})`);
    throw handleApiError(error, `ステータス(${status})の契約情報の取得に失敗しました`);
  }
};

/**
 * 特定の契約情報を取得する
 * @param id 契約ID
 * @returns 契約情報
 */
export const getContractById = async (id: string): Promise<Contract> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const contract = mockContracts.find(c => c.id === id);
      if (!contract) {
        throw new Error(`契約ID ${id} が見つかりません`);
      }
      return contract;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/contracts/${id}`));
  } catch (error) {
    logError(error, `getContractById(${id})`);
    throw handleApiError(error, `契約ID ${id} の情報取得に失敗しました`);
  }
};

/**
 * 新しい契約を作成する
 * @param data 契約データ
 * @returns 作成された契約情報
 */
export const createContract = async (data: Omit<Contract, 'id'>): Promise<Contract> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return {
        id: `contract-${Date.now()}`,
        ...data,
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/contracts', data));
  } catch (error) {
    logError(error, 'createContract');
    throw handleApiError(error, '契約の作成に失敗しました');
  }
};

/**
 * 契約情報を更新する
 * @param id 契約ID
 * @param data 更新データ
 * @returns 更新された契約情報
 */
export const updateContract = async (id: string, data: Partial<Contract>): Promise<Contract> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const contractIndex = mockContracts.findIndex(c => c.id === id);
      if (contractIndex === -1) {
        throw new Error(`契約ID ${id} が見つかりません`);
      }
      
      const updatedContract = {
        ...mockContracts[contractIndex],
        ...data,
      };
      
      return updatedContract;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.put(`/contracts/${id}`, data));
  } catch (error) {
    logError(error, `updateContract(${id})`);
    throw handleApiError(error, `契約ID ${id} の更新に失敗しました`);
  }
};

/**
 * 契約情報の一部を更新する
 * @param id 契約ID
 * @param data 更新データ
 * @returns 更新された契約情報
 */
export const patchContract = async (id: string, data: Partial<Contract>): Promise<Contract> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const contractIndex = mockContracts.findIndex(c => c.id === id);
      if (contractIndex === -1) {
        throw new Error(`契約ID ${id} が見つかりません`);
      }
      
      const updatedContract = {
        ...mockContracts[contractIndex],
        ...data,
      };
      
      return updatedContract;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.patch(`/contracts/${id}`, data));
  } catch (error) {
    logError(error, `patchContract(${id})`);
    throw handleApiError(error, `契約ID ${id} の部分更新に失敗しました`);
  }
};

/**
 * 契約を削除する
 * @param id 契約ID
 */
export const deleteContract = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: Contract with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/contracts/${id}`));
  } catch (error) {
    logError(error, `deleteContract(${id})`);
    throw handleApiError(error, `契約ID ${id} の削除に失敗しました`);
  }
};

/**
 * 契約の更新通知を送信する
 * @param id 契約ID
 * @returns 通知送信結果
 */
export const sendRenewalNotice = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const contract = await getContractById(id);
      if (contract.status !== 'active') {
        throw new Error('アクティブな契約のみ更新通知を送信できます');
      }
      return { success: true, message: '更新通知が正常に送信されました' };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post(`/contracts/${id}/renewal-notice`));
  } catch (error) {
    logError(error, `sendRenewalNotice(${id})`);
    throw handleApiError(error, `契約ID ${id} の更新通知送信に失敗しました`);
  }
};

// デフォルトエクスポート
const contractService = {
  getContracts,
  getContractsByProjectId,
  getContractsByStaffId,
  getContractsByStatus,
  getContractById,
  createContract,
  updateContract,
  patchContract,
  deleteContract,
  sendRenewalNotice
};

export default contractService;
