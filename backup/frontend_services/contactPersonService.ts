// services/contactPersonService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { ContactPerson } from '../shared-types';
import { mockContactPersons } from '../mocks/contactPersonMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * パートナー会社の連絡先担当者一覧を取得する
 * @param partnerId パートナー会社ID
 * @returns 連絡先担当者の配列
 */
export const getContactPersonsByPartner = async (partnerId: string): Promise<ContactPerson[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockContactPersons.filter(contact => contact.partnerId === partnerId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/partners/${partnerId}/contacts`));
  } catch (error) {
    logError(error, `getContactPersonsByPartner(${partnerId})`);
    throw handleApiError(error, `パートナーID ${partnerId} の連絡先担当者情報の取得に失敗しました`);
  }
};

/**
 * すべての連絡先担当者情報を取得する
 * @returns 連絡先担当者の配列
 */
export const getAllContactPersons = async (): Promise<ContactPerson[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockContactPersons;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/contacts'));
  } catch (error) {
    logError(error, 'getAllContactPersons');
    throw handleApiError(error, '連絡先担当者情報の取得に失敗しました');
  }
};

/**
 * 主要連絡先担当者のみを取得する
 * @returns 主要連絡先担当者の配列
 */
export const getPrimaryContactPersons = async (): Promise<ContactPerson[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockContactPersons.filter(contact => contact.isPrimary);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/contacts/primary'));
  } catch (error) {
    logError(error, 'getPrimaryContactPersons');
    throw handleApiError(error, '主要連絡先担当者情報の取得に失敗しました');
  }
};

/**
 * 特定の連絡先担当者情報を取得する
 * @param id 連絡先担当者ID
 * @returns 連絡先担当者情報
 */
export const getContactPersonById = async (id: string): Promise<ContactPerson> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const contact = mockContactPersons.find(c => c.id === id);
      if (!contact) {
        throw new Error(`連絡先担当者ID ${id} が見つかりません`);
      }
      return contact;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/contacts/${id}`));
  } catch (error) {
    logError(error, `getContactPersonById(${id})`);
    throw handleApiError(error, `連絡先担当者ID ${id} の情報取得に失敗しました`);
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
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return {
        id: `contact-${Date.now()}`,
        ...data,
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/contacts', data));
  } catch (error) {
    logError(error, 'createContactPerson');
    throw handleApiError(error, '連絡先担当者の作成に失敗しました');
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
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const contactIndex = mockContactPersons.findIndex(c => c.id === id);
      if (contactIndex === -1) {
        throw new Error(`連絡先担当者ID ${id} が見つかりません`);
      }
      
      const updatedContact = {
        ...mockContactPersons[contactIndex],
        ...data,
      };
      
      return updatedContact;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.put(`/contacts/${id}`, data));
  } catch (error) {
    logError(error, `updateContactPerson(${id})`);
    throw handleApiError(error, `連絡先担当者ID ${id} の更新に失敗しました`);
  }
};

/**
 * 連絡先担当者情報の一部を更新する
 * @param id 連絡先担当者ID
 * @param data 更新データ
 * @returns 更新された連絡先担当者情報
 */
export const patchContactPerson = async (
  id: string,
  data: Partial<ContactPerson>
): Promise<ContactPerson> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const contactIndex = mockContactPersons.findIndex(c => c.id === id);
      if (contactIndex === -1) {
        throw new Error(`連絡先担当者ID ${id} が見つかりません`);
      }
      
      const updatedContact = {
        ...mockContactPersons[contactIndex],
        ...data,
      };
      
      return updatedContact;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.patch(`/contacts/${id}`, data));
  } catch (error) {
    logError(error, `patchContactPerson(${id})`);
    throw handleApiError(error, `連絡先担当者ID ${id} の部分更新に失敗しました`);
  }
};

/**
 * 連絡先担当者を削除する
 * @param id 連絡先担当者ID
 */
export const deleteContactPerson = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: ContactPerson with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/contacts/${id}`));
  } catch (error) {
    logError(error, `deleteContactPerson(${id})`);
    throw handleApiError(error, `連絡先担当者ID ${id} の削除に失敗しました`);
  }
};

// デフォルトエクスポート
const contactPersonService = {
  getContactPersonsByPartner,
  getAllContactPersons,
  getPrimaryContactPersons,
  getContactPersonById,
  createContactPerson,
  updateContactPerson,
  patchContactPerson,
  deleteContactPerson,
};

export default contactPersonService;
