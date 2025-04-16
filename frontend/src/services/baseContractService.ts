import api, { callWithRetry } from './api';

/**
 * 基本契約サービス
 */

export interface BaseContract {
  id: string;
  partnerId: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  terms: string;
  attachments?: string[];
}

/**
 * パートナー会社の基本契約一覧を取得する
 * @param partnerId パートナー会社ID
 * @returns 基本契約の配列
 */
export const getBaseContractsByPartner = async (partnerId: string): Promise<BaseContract[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<BaseContract[]>(`/partners/${partnerId}/base-contracts`));

    // デモ用のモックデータ
    return [
      {
        id: 'base-contract-1',
        partnerId,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        status: 'active',
        terms: '基本契約書の内容...',
      },
    ];
  } catch (error) {
    console.error(`パートナーID ${partnerId} の基本契約情報の取得に失敗しました`, error);
    throw error;
  }
};

/**
 * 特定の基本契約情報を取得する
 * @param id 基本契約ID
 * @returns 基本契約情報
 */
export const getBaseContractById = async (id: string): Promise<BaseContract> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<BaseContract>(`/base-contracts/${id}`));

    // デモ用のモックデータ
    const mockContracts = [
      {
        id: 'base-contract-1',
        partnerId: 'partner-1',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        status: 'active' as const,
        terms: '基本契約書の内容...',
      },
    ];

    const contract = mockContracts.find(c => c.id === id);

    if (!contract) {
      throw new Error(`基本契約ID ${id} が見つかりません`);
    }

    return contract;
  } catch (error) {
    console.error(`基本契約ID ${id} の情報取得に失敗しました`, error);
    throw error;
  }
};

/**
 * 新しい基本契約を作成する
 * @param data 基本契約データ
 * @returns 作成された基本契約情報
 */
export const createBaseContract = async (data: Omit<BaseContract, 'id'>): Promise<BaseContract> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.post<BaseContract>('/base-contracts', data));

    // デモ用のモックレスポンス
    return {
      id: `base-contract-${Date.now()}`,
      ...data,
    };
  } catch (error) {
    console.error('基本契約の作成に失敗しました', error);
    throw error;
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
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.put<BaseContract>(`/base-contracts/${id}`, data));

    // デモ用のモックレスポンス
    const contract = await getBaseContractById(id);
    return {
      ...contract,
      ...data,
    };
  } catch (error) {
    console.error(`基本契約ID ${id} の更新に失敗しました`, error);
    throw error;
  }
};

/**
 * 基本契約を削除する
 * @param id 基本契約ID
 * @returns 削除結果
 */
export const deleteBaseContract = async (id: string): Promise<{ success: boolean }> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.delete<{ success: boolean }>(`/base-contracts/${id}`));

    // デモ用のモックレスポンス
    return { success: true };
  } catch (error) {
    console.error(`基本契約ID ${id} の削除に失敗しました`, error);
    throw error;
  }
};

// デフォルトエクスポートを追加
const baseContractService = {
  getBaseContractsByPartner,
  getBaseContractById,
  createBaseContract,
  updateBaseContract,
  deleteBaseContract,
};

export default baseContractService;
