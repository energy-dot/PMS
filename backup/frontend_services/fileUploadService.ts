// services/fileUploadService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { FileUpload } from '../shared-types';
import { mockFileUploads } from '../mocks/fileUploadMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * ファイルをアップロードする
 * @param formData フォームデータ（ファイル情報を含む）
 * @returns アップロード結果
 */
export const uploadFile = async (formData: FormData): Promise<FileUpload> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const now = new Date().toISOString();
      const fileData = formData.get('file') as File;
      const entityType = formData.get('entityType') as string;
      const entityId = formData.get('entityId') as string;
      const description = formData.get('description') as string;
      const uploadedBy = formData.get('uploadedBy') as string;
      
      return {
        id: `file-${Date.now()}`,
        fileName: `${Date.now()}_${fileData.name}`,
        originalName: fileData.name,
        mimeType: fileData.type,
        size: fileData.size,
        path: `/uploads/${entityType}/${Date.now()}_${fileData.name}`,
        entityType,
        entityId,
        uploadedBy,
        uploadedAt: now,
        description
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/file-upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }));
  } catch (error) {
    logError(error, 'uploadFile');
    throw handleApiError(error, 'ファイルのアップロードに失敗しました');
  }
};

/**
 * 複数のファイルをアップロードする
 * @param formData フォームデータ（複数のファイル情報を含む）
 * @returns アップロード結果の配列
 */
export const uploadMultipleFiles = async (formData: FormData): Promise<FileUpload[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const now = new Date().toISOString();
      const files = formData.getAll('files') as File[];
      const entityType = formData.get('entityType') as string;
      const entityId = formData.get('entityId') as string;
      const uploadedBy = formData.get('uploadedBy') as string;
      
      return files.map((file, index) => ({
        id: `file-${Date.now() + index}`,
        fileName: `${Date.now()}_${file.name}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: `/uploads/${entityType}/${Date.now()}_${file.name}`,
        entityType,
        entityId,
        uploadedBy,
        uploadedAt: now,
        description: formData.get(`description_${index}`) as string || ''
      }));
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/file-upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }));
  } catch (error) {
    logError(error, 'uploadMultipleFiles');
    throw handleApiError(error, '複数ファイルのアップロードに失敗しました');
  }
};

/**
 * エンティティに関連するファイル一覧を取得する
 * @param entityType エンティティタイプ
 * @param entityId エンティティID
 * @returns ファイル情報の配列
 */
export const getFilesByEntity = async (entityType: string, entityId: string): Promise<FileUpload[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockFileUploads.filter(file => file.entityType === entityType && file.entityId === entityId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/file-upload/entity/${entityType}/${entityId}`));
  } catch (error) {
    logError(error, `getFilesByEntity(${entityType}, ${entityId})`);
    throw handleApiError(error, `エンティティ(${entityType}/${entityId})のファイル一覧取得に失敗しました`);
  }
};

/**
 * 特定のファイル情報を取得する
 * @param id ファイルID
 * @returns ファイル情報
 */
export const getFileById = async (id: string): Promise<FileUpload> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const file = mockFileUploads.find(f => f.id === id);
      if (!file) {
        throw new Error(`ファイルID ${id} が見つかりません`);
      }
      return file;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/file-upload/${id}`));
  } catch (error) {
    logError(error, `getFileById(${id})`);
    throw handleApiError(error, `ファイルID ${id} の情報取得に失敗しました`);
  }
};

/**
 * ファイルをダウンロードする
 * @param id ファイルID
 */
export const downloadFile = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: Downloading file with ID ${id}`);
      window.open(`/mock-download/${id}`, '_blank');
      return;
    }
    
    // 本番環境APIを使用
    window.open(`/api/file-upload/download/${id}`, '_blank');
  } catch (error) {
    logError(error, `downloadFile(${id})`);
    throw handleApiError(error, `ファイルID ${id} のダウンロードに失敗しました`);
  }
};

/**
 * ファイルを削除する
 * @param id ファイルID
 */
export const deleteFile = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: File with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/file-upload/${id}`));
  } catch (error) {
    logError(error, `deleteFile(${id})`);
    throw handleApiError(error, `ファイルID ${id} の削除に失敗しました`);
  }
};

// デフォルトエクスポート
const fileUploadService = {
  uploadFile,
  uploadMultipleFiles,
  getFilesByEntity,
  getFileById,
  downloadFile,
  deleteFile
};

export default fileUploadService;
