// services/evaluationService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { Evaluation } from '../shared-types';
import { mockEvaluations } from '../mocks/evaluationMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * 評価データの取得
 * @returns 評価情報の配列
 */
export const getEvaluations = async (): Promise<Evaluation[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockEvaluations;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/evaluations'));
  } catch (error) {
    logError(error, 'getEvaluations');
    throw handleApiError(error, '評価情報の取得に失敗しました');
  }
};

/**
 * スタッフIDに基づいて評価データを取得する
 * @param staffId スタッフID
 * @returns 評価情報の配列
 */
export const getEvaluationsByStaffId = async (staffId: string): Promise<Evaluation[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockEvaluations.filter(evaluation => evaluation.staffId === staffId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/evaluations/staff/${staffId}`));
  } catch (error) {
    logError(error, `getEvaluationsByStaffId(${staffId})`);
    throw handleApiError(error, `スタッフ(ID: ${staffId})の評価情報の取得に失敗しました`);
  }
};

/**
 * プロジェクトIDに基づいて評価データを取得する
 * @param projectId プロジェクトID
 * @returns 評価情報の配列
 */
export const getEvaluationsByProjectId = async (projectId: string): Promise<Evaluation[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockEvaluations.filter(evaluation => evaluation.projectId === projectId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/evaluations/project/${projectId}`));
  } catch (error) {
    logError(error, `getEvaluationsByProjectId(${projectId})`);
    throw handleApiError(error, `プロジェクト(ID: ${projectId})の評価情報の取得に失敗しました`);
  }
};

/**
 * 評価者IDに基づいて評価データを取得する
 * @param evaluatorId 評価者ID
 * @returns 評価情報の配列
 */
export const getEvaluationsByEvaluatorId = async (evaluatorId: string): Promise<Evaluation[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockEvaluations.filter(evaluation => evaluation.evaluatorId === evaluatorId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/evaluations/evaluator/${evaluatorId}`));
  } catch (error) {
    logError(error, `getEvaluationsByEvaluatorId(${evaluatorId})`);
    throw handleApiError(error, `評価者(ID: ${evaluatorId})の評価情報の取得に失敗しました`);
  }
};

/**
 * 特定の評価データを取得する
 * @param id 評価ID
 * @returns 評価情報
 */
export const getEvaluationById = async (id: string): Promise<Evaluation> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const evaluation = mockEvaluations.find(e => e.id === id);
      if (!evaluation) {
        throw new Error(`評価ID ${id} が見つかりません`);
      }
      return evaluation;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/evaluations/${id}`));
  } catch (error) {
    logError(error, `getEvaluationById(${id})`);
    throw handleApiError(error, `評価ID ${id} の情報取得に失敗しました`);
  }
};

/**
 * 新しい評価データを作成する
 * @param data 評価データ
 * @returns 作成された評価情報
 */
export const createEvaluation = async (data: Omit<Evaluation, 'id'>): Promise<Evaluation> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const newId = Math.floor(Math.random() * 1000).toString();
      const newEvaluation: Evaluation = {
        id: newId,
        ...data,
      };
      return newEvaluation;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/evaluations', data));
  } catch (error) {
    logError(error, 'createEvaluation');
    throw handleApiError(error, '評価の作成に失敗しました');
  }
};

/**
 * 評価データを更新する
 * @param id 評価ID
 * @param data 更新データ
 * @returns 更新された評価情報
 */
export const updateEvaluation = async (
  id: string,
  data: Partial<Evaluation>
): Promise<Evaluation> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const evaluationIndex = mockEvaluations.findIndex(e => e.id === id);
      if (evaluationIndex === -1) {
        throw new Error(`評価ID ${id} が見つかりません`);
      }
      
      const updatedEvaluation = {
        ...mockEvaluations[evaluationIndex],
        ...data,
      };
      
      return updatedEvaluation;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.put(`/evaluations/${id}`, data));
  } catch (error) {
    logError(error, `updateEvaluation(${id})`);
    throw handleApiError(error, `評価ID ${id} の更新に失敗しました`);
  }
};

/**
 * 評価データの一部を更新する
 * @param id 評価ID
 * @param data 更新データ
 * @returns 更新された評価情報
 */
export const patchEvaluation = async (
  id: string,
  data: Partial<Evaluation>
): Promise<Evaluation> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const evaluationIndex = mockEvaluations.findIndex(e => e.id === id);
      if (evaluationIndex === -1) {
        throw new Error(`評価ID ${id} が見つかりません`);
      }
      
      const updatedEvaluation = {
        ...mockEvaluations[evaluationIndex],
        ...data,
      };
      
      return updatedEvaluation;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.patch(`/evaluations/${id}`, data));
  } catch (error) {
    logError(error, `patchEvaluation(${id})`);
    throw handleApiError(error, `評価ID ${id} の部分更新に失敗しました`);
  }
};

/**
 * 評価データを削除する
 * @param id 評価ID
 */
export const deleteEvaluation = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: Evaluation with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/evaluations/${id}`));
  } catch (error) {
    logError(error, `deleteEvaluation(${id})`);
    throw handleApiError(error, `評価ID ${id} の削除に失敗しました`);
  }
};

// デフォルトエクスポート
const evaluationService = {
  getEvaluations,
  getEvaluationsByStaffId,
  getEvaluationsByProjectId,
  getEvaluationsByEvaluatorId,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  patchEvaluation,
  deleteEvaluation,
};

export default evaluationService;
