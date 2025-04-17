// services/creditCheckService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { CreditCheck } from '../shared-types';
import { mockCreditChecks } from '../mocks/creditCheckMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * 与信チェック一覧を取得する
 * @returns 与信チェック情報の配列
 */
export const getCreditChecks = async (): Promise<CreditCheck[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockCreditChecks;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/credit-checks'));
  } catch (error) {
    logError(error, 'getCreditChecks');
    throw handleApiError(error, '与信チェック一覧の取得に失敗しました');
  }
};

/**
 * 特定の与信チェック情報を取得する
 * @param id 与信チェックID
 * @returns 与信チェック情報
 */
export const getCreditCheck = async (id: string): Promise<CreditCheck> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const creditCheck = mockCreditChecks.find(check => check.id === id);
      if (!creditCheck) {
        throw new Error(`与信チェックID ${id} が見つかりません`);
      }
      return creditCheck;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/credit-checks/${id}`));
  } catch (error) {
    logError(error, `getCreditCheck(${id})`);
    throw handleApiError(error, `与信チェックID ${id} の情報取得に失敗しました`);
  }
};

/**
 * パートナーIDに基づいて与信チェック情報を取得する
 * @param partnerId パートナーID
 * @returns 与信チェック情報の配列
 */
export const getCreditChecksByPartnerId = async (partnerId: string): Promise<CreditCheck[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockCreditChecks.filter(check => check.partnerId === partnerId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/credit-checks/partner/${partnerId}`));
  } catch (error) {
    logError(error, `getCreditChecksByPartnerId(${partnerId})`);
    throw handleApiError(error, `パートナーID ${partnerId} の与信チェック情報取得に失敗しました`);
  }
};

/**
 * 新しい与信チェック情報を作成する
 * @param creditCheck 与信チェックデータ
 * @returns 作成された与信チェック情報
 */
export const createCreditCheck = async (
  creditCheck: Omit<CreditCheck, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CreditCheck> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const now = new Date();
      return {
        id: `credit-${Date.now()}`,
        ...creditCheck,
        createdAt: now,
        updatedAt: now
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/credit-checks', creditCheck));
  } catch (error) {
    logError(error, 'createCreditCheck');
    throw handleApiError(error, '与信チェック情報の作成に失敗しました');
  }
};

/**
 * 与信チェック情報を更新する
 * @param id 与信チェックID
 * @param creditCheck 更新データ
 * @returns 更新された与信チェック情報
 */
export const updateCreditCheck = async (
  id: string,
  creditCheck: Partial<CreditCheck>
): Promise<CreditCheck> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const creditCheckIndex = mockCreditChecks.findIndex(check => check.id === id);
      if (creditCheckIndex === -1) {
        throw new Error(`与信チェックID ${id} が見つかりません`);
      }
      
      const updatedCreditCheck = {
        ...mockCreditChecks[creditCheckIndex],
        ...creditCheck,
        updatedAt: new Date()
      };
      
      return updatedCreditCheck;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.patch(`/credit-checks/${id}`, creditCheck));
  } catch (error) {
    logError(error, `updateCreditCheck(${id})`);
    throw handleApiError(error, `与信チェックID ${id} の更新に失敗しました`);
  }
};

/**
 * 与信チェック情報を削除する
 * @param id 与信チェックID
 */
export const deleteCreditCheck = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: CreditCheck with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/credit-checks/${id}`));
  } catch (error) {
    logError(error, `deleteCreditCheck(${id})`);
    throw handleApiError(error, `与信チェックID ${id} の削除に失敗しました`);
  }
};

// デフォルトエクスポート
const creditCheckService = {
  getCreditChecks,
  getCreditCheck,
  getCreditChecksByPartnerId,
  createCreditCheck,
  updateCreditCheck,
  deleteCreditCheck
};

export default creditCheckService;
