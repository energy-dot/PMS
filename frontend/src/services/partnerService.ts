// services/partnerService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { Partner } from '../shared-types';
import { mockPartners } from '../mocks/partnerMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * パートナー情報を取得する
 * @returns パートナー情報の配列
 */
export const getPartners = async (): Promise<Partner[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockPartners;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/partners'));
  } catch (error) {
    logError(error, 'getPartners');
    throw handleApiError(error, 'パートナー情報の取得に失敗しました');
  }
};

/**
 * 特定のパートナー情報を取得する
 * @param id パートナーID
 * @returns パートナー情報
 */
export const getPartnerById = async (id: string): Promise<Partner> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const partner = mockPartners.find(p => p.id === id);
      if (!partner) {
        throw new Error(`パートナーID ${id} が見つかりません`);
      }
      return partner;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/partners/${id}`));
  } catch (error) {
    logError(error, `getPartnerById(${id})`);
    throw handleApiError(error, `パートナーID ${id} の情報取得に失敗しました`);
  }
};

/**
 * パートナーを作成する
 * @param data パートナーデータ
 * @returns 作成されたパートナー情報
 */
export const createPartner = async (data: Omit<Partner, 'id'>): Promise<Partner> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const newId = `partner-${Math.floor(Math.random() * 1000)}`;
      const newPartner: Partner = {
        id: newId,
        ...data,
      };
      return newPartner;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/partners', data));
  } catch (error) {
    logError(error, 'createPartner');
    throw handleApiError(error, 'パートナーの作成に失敗しました');
  }
};

/**
 * パートナー情報を更新する
 * @param id パートナーID
 * @param data 更新データ
 * @returns 更新されたパートナー情報
 */
export const updatePartner = async (id: string, data: Partial<Partner>): Promise<Partner> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const partner = mockPartners.find(p => p.id === id);
      if (!partner) {
        throw new Error(`パートナーID ${id} が見つかりません`);
      }
      const updatedPartner: Partner = {
        ...partner,
        ...data,
      };
      return updatedPartner;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.put(`/partners/${id}`, data));
  } catch (error) {
    logError(error, `updatePartner(${id})`);
    throw handleApiError(error, `パートナーID ${id} の情報更新に失敗しました`);
  }
};

/**
 * パートナーを削除する
 * @param id パートナーID
 * @returns 削除結果
 */
export const deletePartner = async (id: string): Promise<{ success: boolean }> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: パートナーID ${id} を削除しました`);
      return { success: true };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.delete(`/partners/${id}`));
  } catch (error) {
    logError(error, `deletePartner(${id})`);
    throw handleApiError(error, `パートナーID ${id} の削除に失敗しました`);
  }
};

/**
 * パートナーを検索する
 * @param query 検索クエリ
 * @returns 検索結果のパートナー情報の配列
 */
export const searchPartners = async (query: string): Promise<Partner[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockPartners.filter(partner => 
        partner.name.toLowerCase().includes(query.toLowerCase()) || 
        partner.code?.toLowerCase().includes(query.toLowerCase()) || 
        partner.industry.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/partners/search', { params: { query } }));
  } catch (error) {
    logError(error, `searchPartners(${query})`);
    throw handleApiError(error, 'パートナー検索に失敗しました');
  }
};

// デフォルトエクスポート
const partnerService = {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  searchPartners
};

export default partnerService;
