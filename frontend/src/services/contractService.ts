import api, { callWithRetry } from './api';
import { Contract } from '../shared-types';

/**
 * 契約情報を取得する
 * @returns 契約情報の配列
 */
export const getContracts = async (): Promise<Contract[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Contract[]>('/contracts'));

    // デモ用のモックデータ
    return [
      {
        id: 'contract-1',
        projectId: 'proj-1',
        staffId: 'staff-1',
        startDate: '2023-04-01',
        endDate: '2023-09-30',
        rate: 8000,
        status: 'active',
      },
      {
        id: 'contract-2',
        projectId: 'proj-2',
        staffId: 'staff-2',
        startDate: '2023-05-15',
        endDate: '2023-12-31',
        rate: 9000,
        status: 'active',
      },
    ];
  } catch (error) {
    console.error('契約情報の取得に失敗しました', error);
    throw error;
  }
};

/**
 * 特定の契約情報を取得する
 * @param id 契約ID
 * @returns 契約情報
 */
export const getContractById = async (id: string): Promise<Contract> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Contract>(`/contracts/${id}`));

    // デモ用のモックデータ
    const contracts = await getContracts();
    const contract = contracts.find(c => c.id === id);

    if (!contract) {
      throw new Error(`契約ID ${id} が見つかりません`);
    }

    return contract;
  } catch (error) {
    console.error(`契約ID ${id} の情報取得に失敗しました`, error);
    throw error;
  }
};

/**
 * 新しい契約を作成する
 * @param data 契約データ
 * @returns 作成された契約情報
 */
export const createContract = async (data: Omit<Contract, 'id'>): Promise<Contract> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.post<Contract>('/contracts', data));

    // デモ用のモックレスポンス
    return {
      id: `contract-${Date.now()}`,
      ...data,
    };
  } catch (error) {
    console.error('契約の作成に失敗しました', error);
    throw error;
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
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.put<Contract>(`/contracts/${id}`, data));

    // デモ用のモックレスポンス
    const contract = await getContractById(id);
    return {
      ...contract,
      ...data,
    };
  } catch (error) {
    console.error(`契約ID ${id} の更新に失敗しました`, error);
    throw error;
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
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.patch<Contract>(`/contracts/${id}`, data));

    // デモ用のモックレスポンス
    const contract = await getContractById(id);
    return {
      ...contract,
      ...data,
    };
  } catch (error) {
    console.error(`契約ID ${id} の部分更新に失敗しました`, error);
    throw error;
  }
};

/**
 * 契約を削除する
 * @param id 契約ID
 * @returns 削除結果
 */
export const deleteContract = async (id: string): Promise<{ success: boolean }> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.delete<{ success: boolean }>(`/contracts/${id}`));

    // デモ用のモックレスポンス
    return { success: true };
  } catch (error) {
    console.error(`契約ID ${id} の削除に失敗しました`, error);
    throw error;
  }
};

// デフォルトエクスポートを追加
const contractService = {
  getContracts,
  getContractById,
  createContract,
  updateContract,
  patchContract,
  deleteContract,
};

export default contractService;
