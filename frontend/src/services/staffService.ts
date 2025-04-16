// staffService.tsの修正 - デフォルトエクスポートを追加

import api, { callWithRetry } from './api';
import { Staff } from '../shared-types';

// 検索パラメータの型定義を追加
export interface SearchStaffParams {
  skills?: string[];
  availability?: string;
  experience?: number;
  partnerId?: string;
}

/**
 * スタッフ情報を取得する
 * @returns スタッフ情報の配列
 */
export const getStaffs = async (): Promise<Staff[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Staff[]>('/staffs'));

    // デモ用のモックデータ
    return [
      {
        id: 'staff-1',
        name: '山田太郎',
        partnerId: 'partner-1',
        firstName: '太郎',
        lastName: '山田',
        email: 'yamada@example.com',
        phoneNumber: '090-1234-5678',
        skills: ['Java', 'Spring', 'AWS'],
        experience: 5,
        hourlyRate: 5000,
        availability: 'available',
        status: 'available',
      },
      {
        id: 'staff-2',
        name: '佐藤次郎',
        partnerId: 'partner-1',
        firstName: '次郎',
        lastName: '佐藤',
        email: 'sato@example.com',
        phoneNumber: '090-2345-6789',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: 3,
        hourlyRate: 4500,
        availability: 'partially_available',
        status: 'assigned',
      },
      {
        id: 'staff-3',
        name: '鈴木花子',
        partnerId: 'partner-2',
        firstName: '花子',
        lastName: '鈴木',
        email: 'suzuki@example.com',
        phoneNumber: '090-3456-7890',
        skills: ['Python', 'Django', 'GCP'],
        experience: 4,
        hourlyRate: 4800,
        availability: 'available',
        status: 'available',
      },
    ];
  } catch (error) {
    console.error('スタッフ情報の取得に失敗しました', error);
    throw error;
  }
};

/**
 * 特定のスタッフ情報を取得する
 * @param id スタッフID
 * @returns スタッフ情報
 */
export const getStaffById = async (id: string): Promise<Staff> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Staff>(`/staffs/${id}`));

    // デモ用のモックデータ
    const staffs = await getStaffs();
    const staff = staffs.find(s => s.id === id);

    if (!staff) {
      throw new Error(`スタッフID ${id} が見つかりません`);
    }

    return staff;
  } catch (error) {
    console.error(`スタッフID ${id} の情報取得に失敗しました`, error);
    throw error;
  }
};

/**
 * スタッフを検索する
 * @param params 検索パラメータ
 * @returns 検索結果のスタッフ情報の配列
 */
export const searchStaffs = async (params: SearchStaffParams): Promise<Staff[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Staff[]>('/staffs/search', { params }));

    // デモ用のモックデータ
    const staffs = await getStaffs();

    // 検索条件に基づいてフィルタリング
    return staffs.filter(staff => {
      // スキルでフィルタリング
      if (params.skills && params.skills.length > 0) {
        const hasSkills = params.skills.every(skill =>
          staff.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        );
        if (!hasSkills) return false;
      }

      // 稼働状況でフィルタリング
      if (params.availability && staff.availability !== params.availability) {
        return false;
      }

      // 経験年数でフィルタリング
      if (params.experience !== undefined && staff.experience < params.experience) {
        return false;
      }

      // パートナーIDでフィルタリング
      if (params.partnerId && staff.partnerId !== params.partnerId) {
        return false;
      }

      return true;
    });
  } catch (error) {
    console.error('スタッフの検索に失敗しました', error);
    throw error;
  }
};

/**
 * スタッフを削除する
 * @param id スタッフID
 * @returns 削除結果
 */
export const deleteStaff = async (id: string): Promise<{ success: boolean }> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.delete<{ success: boolean }>(`/staffs/${id}`));

    // デモ用のモックレスポンス
    console.log(`スタッフID ${id} を削除しました`);
    return { success: true };
  } catch (error) {
    console.error(`スタッフID ${id} の削除に失敗しました`, error);
    throw error;
  }
};

// デフォルトエクスポートを追加
const staffService = {
  getStaffs,
  getStaffById,
  searchStaffs,
  deleteStaff,
};

export default staffService;
