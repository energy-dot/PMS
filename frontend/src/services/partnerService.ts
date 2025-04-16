// partnerService.tsの修正 - デフォルトエクスポートを追加

import api, { callWithRetry } from './api';
import { Partner } from '../shared-types';

/**
 * パートナー情報を取得する
 * @returns パートナー情報の配列
 */
export const getPartners = async (): Promise<Partner[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Partner[]>('/partners'));

    // デモ用のモックデータ
    return [
      {
        id: 'partner-1',
        code: 'TS001',
        name: 'テックソリューション株式会社',
        address: '東京都渋谷区神宮前1-1-1',
        phoneNumber: '03-1234-5678',
        email: 'info@techsolution.example.com',
        website: 'https://techsolution.example.com',
        industry: 'IT',
        establishedDate: '2010-04-01',
        status: 'active',
      },
      {
        id: 'partner-2',
        code: 'DI002',
        name: 'デジタルイノベーション株式会社',
        address: '大阪府大阪市北区梅田2-2-2',
        phoneNumber: '06-2345-6789',
        email: 'info@digitalinnovation.example.com',
        website: 'https://digitalinnovation.example.com',
        industry: 'IT',
        establishedDate: '2015-07-15',
        status: 'active',
      },
      {
        id: 'partner-3',
        name: 'フューチャーテクノロジー株式会社',
        address: '福岡県福岡市博多区博多駅前3-3-3',
        phoneNumber: '092-3456-7890',
        email: 'info@futuretech.example.com',
        website: 'https://futuretech.example.com',
        industry: 'IT',
        establishedDate: '2018-01-10',
        status: 'pending',
      },
    ];
  } catch (error) {
    console.error('パートナー情報の取得に失敗しました', error);
    throw error;
  }
};

/**
 * 特定のパートナー情報を取得する
 * @param id パートナーID
 * @returns パートナー情報
 */
export const getPartnerById = async (id: string): Promise<Partner> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Partner>(`/partners/${id}`));

    // デモ用のモックデータ
    const partners = await getPartners();
    const partner = partners.find(p => p.id === id);

    if (!partner) {
      throw new Error(`パートナーID ${id} が見つかりません`);
    }

    return partner;
  } catch (error) {
    console.error(`パートナーID ${id} の情報取得に失敗しました`, error);
    throw error;
  }
};

// デフォルトエクスポートを追加
const partnerService = {
  getPartners,
  getPartnerById,
};

export default partnerService;
