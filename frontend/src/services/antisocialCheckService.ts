import api, { callWithRetry } from './api';

/**
 * 反社会的勢力チェックサービス
 */

interface AntisocialCheckRequest {
  companyName: string;
  representativeName: string;
}

interface AntisocialCheckResponse {
  result: 'clean' | 'suspicious' | 'blacklisted';
  score: number;
  details?: string;
}

/**
 * 反社会的勢力チェックを実行する
 * @param data チェック対象データ
 * @returns チェック結果
 */
export const performAntisocialCheck = async (
  data: AntisocialCheckRequest
): Promise<AntisocialCheckResponse> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.post<AntisocialCheckResponse>('/antisocial-check', data));

    // デモ用のモックレスポンス
    // 通常は99%以上のケースで問題なしとなる
    const randomScore = Math.random() * 100;

    if (randomScore > 99.5) {
      return {
        result: 'blacklisted',
        score: randomScore,
        details: 'ブラックリストに登録されている可能性があります。詳細な調査が必要です。',
      };
    } else if (randomScore > 98) {
      return {
        result: 'suspicious',
        score: randomScore,
        details: '一部の項目で注意が必要です。追加調査をお勧めします。',
      };
    } else {
      return {
        result: 'clean',
        score: randomScore,
      };
    }
  } catch (error) {
    console.error('反社会的勢力チェックに失敗しました', error);
    throw error;
  }
};

// AntisocialCheckインターフェースをエクスポート
export interface AntisocialCheck extends AntisocialCheckResponse {
  id?: string;
  partnerId: string;
  checkDate: string;
}

// デフォルトエクスポートを追加
const antisocialCheckService = {
  performAntisocialCheck,
};

export default antisocialCheckService;
