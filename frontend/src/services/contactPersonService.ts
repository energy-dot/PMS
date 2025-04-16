import api, { callWithRetry } from './api';

/**
 * 連絡先担当者サービス
 */

export interface ContactPerson {
  id: string;
  partnerId: string;
  name: string;
  position: string;
  email: string;
  phoneNumber: string;
  isPrimary: boolean;
}

/**
 * パートナー会社の連絡先担当者一覧を取得する
 * @param partnerId パートナー会社ID
 * @returns 連絡先担当者の配列
 */
export const getContactPersonsByPartner = async (partnerId: string): Promise<ContactPerson[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<ContactPerson[]>(`/partners/${partnerId}/contacts`));

    // デモ用のモックデータ
    return [
      {
        id: 'contact-1',
        partnerId,
        name: '佐藤一郎',
        position: '営業部長',
        email: 'sato@example.com',
        phoneNumber: '03-1234-5678',
        isPrimary: true,
      },
      {
        id: 'contact-2',
        partnerId,
        name: '田中花子',
        position: '人事担当',
        email: 'tanaka@example.com',
        phoneNumber: '03-8765-4321',
        isPrimary: false,
      },
    ];
  } catch (error) {
    console.error(`パートナーID ${partnerId} の連絡先担当者情報の取得に失敗しました`, error);
    throw error;
  }
};

/**
 * 特定の連絡先担当者情報を取得する
 * @param id 連絡先担当者ID
 * @returns 連絡先担当者情報
 */
export const getContactPersonById = async (id: string): Promise<ContactPerson> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.get<ContactPerson>(`/contacts/${id}`));

    // デモ用のモックデータ
    const mockContacts = [
      {
        id: 'contact-1',
        partnerId: 'partner-1',
        name: '佐藤一郎',
        position: '営業部長',
        email: 'sato@example.com',
        phoneNumber: '03-1234-5678',
        isPrimary: true,
      },
      {
        id: 'contact-2',
        partnerId: 'partner-1',
        name: '田中花子',
        position: '人事担当',
        email: 'tanaka@example.com',
        phoneNumber: '03-8765-4321',
        isPrimary: false,
      },
    ];

    const contact = mockContacts.find(c => c.id === id);

    if (!contact) {
      throw new Error(`連絡先担当者ID ${id} が見つかりません`);
    }

    return contact;
  } catch (error) {
    console.error(`連絡先担当者ID ${id} の情報取得に失敗しました`, error);
    throw error;
  }
};

/**
 * 新しい連絡先担当者を作成する
 * @param data 連絡先担当者データ
 * @returns 作成された連絡先担当者情報
 */
export const createContactPerson = async (
  data: Omit<ContactPerson, 'id'>
): Promise<ContactPerson> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.post<ContactPerson>('/contacts', data));

    // デモ用のモックレスポンス
    return {
      id: `contact-${Date.now()}`,
      ...data,
    };
  } catch (error) {
    console.error('連絡先担当者の作成に失敗しました', error);
    throw error;
  }
};

/**
 * 連絡先担当者情報を更新する
 * @param id 連絡先担当者ID
 * @param data 更新データ
 * @returns 更新された連絡先担当者情報
 */
export const updateContactPerson = async (
  id: string,
  data: Partial<ContactPerson>
): Promise<ContactPerson> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.put<ContactPerson>(`/contacts/${id}`, data));

    // デモ用のモックレスポンス
    const contact = await getContactPersonById(id);
    return {
      ...contact,
      ...data,
    };
  } catch (error) {
    console.error(`連絡先担当者ID ${id} の更新に失敗しました`, error);
    throw error;
  }
};

/**
 * 連絡先担当者を削除する
 * @param id 連絡先担当者ID
 * @returns 削除結果
 */
export const deleteContactPerson = async (id: string): Promise<{ success: boolean }> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.delete<{ success: boolean }>(`/contacts/${id}`));

    // デモ用のモックレスポンス
    return { success: true };
  } catch (error) {
    console.error(`連絡先担当者ID ${id} の削除に失敗しました`, error);
    throw error;
  }
};

// デフォルトエクスポートを追加
const contactPersonService = {
  getContactPersonsByPartner,
  getContactPersonById,
  createContactPerson,
  updateContactPerson,
  deleteContactPerson,
};

export default contactPersonService;
