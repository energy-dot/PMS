import api, { callWithRetry } from './api';
import { Application } from '../shared-types';

/**
 * 応募情報を取得する
 * @returns 応募情報の配列
 */
export const getApplications = async (): Promise<Application[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Application[]>('/applications'));

    // デモ用のモックデータ
    return [
      {
        id: 'app-1',
        projectId: 'proj-1',
        partnerId: 'partner-1',
        staffId: 'staff-1',
        applicationDate: '2023-03-15',
        status: 'accepted',
      },
      {
        id: 'app-2',
        projectId: 'proj-2',
        partnerId: 'partner-2',
        applicationDate: '2023-04-20',
        status: 'reviewing',
      },
    ];
  } catch (error) {
    console.error('応募情報の取得に失敗しました', error);
    throw error;
  }
};

/**
 * 特定の応募情報を取得する
 * @param id 応募ID
 * @returns 応募情報
 */
export const getApplicationById = async (id: string): Promise<Application> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<Application>(`/applications/${id}`));

    // デモ用のモックデータ
    const applications = await getApplications();
    const application = applications.find(a => a.id === id);

    if (!application) {
      throw new Error(`応募ID ${id} が見つかりません`);
    }

    return application;
  } catch (error) {
    console.error(`応募ID ${id} の情報取得に失敗しました`, error);
    throw error;
  }
};

/**
 * 新しい応募を作成する
 * @param data 応募データ
 * @returns 作成された応募情報
 */
export const createApplication = async (data: Omit<Application, 'id'>): Promise<Application> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.post<Application>('/applications', data));

    // デモ用のモックレスポンス
    return {
      id: `app-${Date.now()}`,
      ...data,
    };
  } catch (error) {
    console.error('応募の作成に失敗しました', error);
    throw error;
  }
};

/**
 * 応募情報を更新する
 * @param id 応募ID
 * @param data 更新データ
 * @returns 更新された応募情報
 */
export const updateApplication = async (
  id: string,
  data: Partial<Application>
): Promise<Application> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.put<Application>(`/applications/${id}`, data));

    // デモ用のモックレスポンス
    const application = await getApplicationById(id);
    return {
      ...application,
      ...data,
    };
  } catch (error) {
    console.error(`応募ID ${id} の更新に失敗しました`, error);
    throw error;
  }
};

/**
 * 応募情報の一部を更新する
 * @param id 応募ID
 * @param data 更新データ
 * @returns 更新された応募情報
 */
export const patchApplication = async (
  id: string,
  data: Partial<Application>
): Promise<Application> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.patch<Application>(`/applications/${id}`, data));

    // デモ用のモックレスポンス
    const application = await getApplicationById(id);
    return {
      ...application,
      ...data,
    };
  } catch (error) {
    console.error(`応募ID ${id} の部分更新に失敗しました`, error);
    throw error;
  }
};

/**
 * 応募を削除する
 * @param id 応募ID
 * @returns 削除結果
 */
export const deleteApplication = async (id: string): Promise<{ success: boolean }> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.delete<{ success: boolean }>(`/applications/${id}`));

    // デモ用のモックレスポンス
    return { success: true };
  } catch (error) {
    console.error(`応募ID ${id} の削除に失敗しました`, error);
    throw error;
  }
};

// デフォルトエクスポートを追加
const applicationService = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  patchApplication,
  deleteApplication,
};

export default applicationService;
