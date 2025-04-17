// services/antisocialCheckService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { AntisocialCheck } from '../shared-types';
import { mockAntisocialChecks, AntisocialCheckRequest } from '../mocks/antisocialCheckMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * 反社会的勢力チェックを実行する
 * @param data チェック対象データ
 * @returns チェック結果
 */
export const performAntisocialCheck = async (
  data: AntisocialCheckRequest
): Promise<AntisocialCheck> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      // 通常は99%以上のケースで問題なしとなる
      const randomScore = Math.random() * 100;
      const now = new Date().toISOString();
      
      let result: AntisocialCheck = {
        partnerId: data.companyName.includes('ID:') 
          ? data.companyName.split('ID:')[1].trim() 
          : `partner-${Date.now()}`,
        result: 'clean',
        score: randomScore,
        checkDate: now
      };

      if (randomScore > 99.5) {
        result.result = 'blacklisted';
        result.details = 'ブラックリストに登録されている可能性があります。詳細な調査が必要です。';
      } else if (randomScore > 98) {
        result.result = 'suspicious';
        result.details = '一部の項目で注意が必要です。追加調査をお勧めします。';
      }
      
      return result;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/antisocial-check', data));
  } catch (error) {
    logError(error, 'performAntisocialCheck');
    throw handleApiError(error, '反社会的勢力チェックに失敗しました');
  }
};

/**
 * パートナーIDに基づいてチェック履歴を取得する
 * @param partnerId パートナーID
 * @returns チェック履歴の配列
 */
export const getCheckHistoryByPartnerId = async (partnerId: string): Promise<AntisocialCheck[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockAntisocialChecks.filter(check => check.partnerId === partnerId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/antisocial-check/partner/${partnerId}`));
  } catch (error) {
    logError(error, `getCheckHistoryByPartnerId(${partnerId})`);
    throw handleApiError(error, `パートナーID ${partnerId} のチェック履歴取得に失敗しました`);
  }
};

/**
 * チェックIDに基づいてチェック結果を取得する
 * @param checkId チェックID
 * @returns チェック結果
 */
export const getCheckById = async (checkId: string): Promise<AntisocialCheck> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const check = mockAntisocialChecks.find(c => c.id === checkId);
      if (!check) {
        throw new Error(`チェックID ${checkId} が見つかりません`);
      }
      return check;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/antisocial-check/${checkId}`));
  } catch (error) {
    logError(error, `getCheckById(${checkId})`);
    throw handleApiError(error, `チェックID ${checkId} の結果取得に失敗しました`);
  }
};

// デフォルトエクスポート
const antisocialCheckService = {
  performAntisocialCheck,
  getCheckHistoryByPartnerId,
  getCheckById
};

export default antisocialCheckService;
