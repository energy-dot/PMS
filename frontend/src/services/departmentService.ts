import api, { callWithRetry } from './api';
import { Department } from '../shared-types';

/**
 * 部署情報を取得する
 * @returns 部署情報の配列
 */
export const getDepartments = async (): Promise<Department[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Department[]>('/departments'));

    // デモ用のモックデータ
    return [
      {
        id: 'dept-1',
        code: 'DEV',
        name: '開発部',
        managerId: 'user-1',
        sections: [
          { id: 'section-1', name: 'フロントエンド開発チーム' },
          { id: 'section-2', name: 'バックエンド開発チーム' },
        ],
      },
      {
        id: 'dept-2',
        code: 'SALES',
        name: '営業部',
        managerId: 'user-2',
        sections: [
          { id: 'section-3', name: '国内営業チーム' },
          { id: 'section-4', name: '海外営業チーム' },
        ],
      },
    ];
  } catch (error) {
    console.error('部署情報の取得に失敗しました', error);
    throw error;
  }
};

/**
 * 特定の部署情報を取得する
 * @param id 部署ID
 * @returns 部署情報
 */
export const getDepartmentById = async (id: string): Promise<Department> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Department>(`/departments/${id}`));

    // デモ用のモックデータ
    const departments = await getDepartments();
    const department = departments.find(d => d.id === id);

    if (!department) {
      throw new Error(`部署ID ${id} が見つかりません`);
    }

    return department;
  } catch (error) {
    console.error(`部署ID ${id} の情報取得に失敗しました`, error);
    throw error;
  }
};

/**
 * 部署のセクション情報を取得する
 * @param departmentId 部署ID
 * @returns セクション情報の配列
 */
export const getDepartmentSections = async (departmentId: string): Promise<any[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<any[]>(`/departments/${departmentId}/sections`));

    // デモ用のモックデータ
    const department = await getDepartmentById(departmentId);
    return department?.sections || [];
  } catch (error) {
    console.error(`部署ID ${departmentId} のセクション情報取得に失敗しました`, error);
    throw error;
  }
};

// デフォルトエクスポートを追加
const departmentService = {
  getDepartments,
  getDepartmentById,
  getDepartmentSections,
};

export default departmentService;
