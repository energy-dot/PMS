// services/staffService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { Staff } from '../shared-types';
import { mockStaffs, SearchStaffParams } from '../mocks/staffMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * スタッフ情報を取得する
 * @returns スタッフ情報の配列
 */
export const getStaffs = async (): Promise<Staff[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockStaffs;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/staffs'));
  } catch (error) {
    logError(error, 'getStaffs');
    throw handleApiError(error, 'スタッフ情報の取得に失敗しました');
  }
};

/**
 * 特定のスタッフ情報を取得する
 * @param id スタッフID
 * @returns スタッフ情報
 */
export const getStaffById = async (id: string): Promise<Staff> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const staff = mockStaffs.find(s => s.id === id);
      if (!staff) {
        throw new Error(`スタッフID ${id} が見つかりません`);
      }
      return staff;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/staffs/${id}`));
  } catch (error) {
    logError(error, `getStaffById(${id})`);
    throw handleApiError(error, `スタッフID ${id} の情報取得に失敗しました`);
  }
};

/**
 * スタッフを検索する
 * @param params 検索パラメータ
 * @returns 検索結果のスタッフ情報の配列
 */
export const searchStaffs = async (params: SearchStaffParams): Promise<Staff[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockStaffs.filter(staff => {
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
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/staffs/search', { params }));
  } catch (error) {
    logError(error, 'searchStaffs');
    throw handleApiError(error, 'スタッフの検索に失敗しました');
  }
};

/**
 * スタッフを作成する
 * @param data スタッフデータ
 * @returns 作成されたスタッフ情報
 */
export const createStaff = async (data: Omit<Staff, 'id'>): Promise<Staff> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const newId = `staff-${Math.floor(Math.random() * 1000)}`;
      const newStaff: Staff = {
        id: newId,
        ...data,
      };
      return newStaff;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/staffs', data));
  } catch (error) {
    logError(error, 'createStaff');
    throw handleApiError(error, 'スタッフの作成に失敗しました');
  }
};

/**
 * スタッフ情報を更新する
 * @param id スタッフID
 * @param data 更新データ
 * @returns 更新されたスタッフ情報
 */
export const updateStaff = async (id: string, data: Partial<Staff>): Promise<Staff> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const staff = mockStaffs.find(s => s.id === id);
      if (!staff) {
        throw new Error(`スタッフID ${id} が見つかりません`);
      }
      const updatedStaff: Staff = {
        ...staff,
        ...data,
      };
      return updatedStaff;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.put(`/staffs/${id}`, data));
  } catch (error) {
    logError(error, `updateStaff(${id})`);
    throw handleApiError(error, `スタッフID ${id} の情報更新に失敗しました`);
  }
};

/**
 * スタッフを削除する
 * @param id スタッフID
 * @returns 削除結果
 */
export const deleteStaff = async (id: string): Promise<{ success: boolean }> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: スタッフID ${id} を削除しました`);
      return { success: true };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.delete(`/staffs/${id}`));
  } catch (error) {
    logError(error, `deleteStaff(${id})`);
    throw handleApiError(error, `スタッフID ${id} の削除に失敗しました`);
  }
};

/**
 * スタッフのスキルを更新する
 * @param id スタッフID
 * @param skills スキル配列
 * @returns 更新されたスタッフ情報
 */
export const updateStaffSkills = async (id: string, skills: string[]): Promise<Staff> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const staff = mockStaffs.find(s => s.id === id);
      if (!staff) {
        throw new Error(`スタッフID ${id} が見つかりません`);
      }
      const updatedStaff: Staff = {
        ...staff,
        skills,
      };
      return updatedStaff;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.put(`/staffs/${id}/skills`, { skills }));
  } catch (error) {
    logError(error, `updateStaffSkills(${id})`);
    throw handleApiError(error, `スタッフID ${id} のスキル更新に失敗しました`);
  }
};

// デフォルトエクスポート
const staffService = {
  getStaffs,
  getStaffById,
  searchStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
  updateStaffSkills,
};

export default staffService;
