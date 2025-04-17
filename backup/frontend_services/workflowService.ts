// services/workflowService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { Workflow, RequestHistory } from '../shared-types';
import { mockWorkflows, mockRequestHistories } from '../mocks/workflowMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * ワークフロー情報を取得する
 * @returns ワークフロー情報の配列
 */
export const getWorkflows = async (): Promise<Workflow[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockWorkflows;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/workflows'));
  } catch (error) {
    logError(error, 'getWorkflows');
    throw handleApiError(error, 'ワークフロー情報の取得に失敗しました');
  }
};

/**
 * 特定のワークフロー情報を取得する
 * @param id ワークフローID
 * @returns ワークフロー情報
 */
export const getWorkflowById = async (id: string): Promise<Workflow> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const workflow = mockWorkflows.find(w => w.id === id);
      if (!workflow) {
        throw new Error(`ワークフローID ${id} が見つかりません`);
      }
      return workflow;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/workflows/${id}`));
  } catch (error) {
    logError(error, `getWorkflowById(${id})`);
    throw handleApiError(error, `ワークフローID ${id} の情報取得に失敗しました`);
  }
};

/**
 * リクエスト履歴を取得する
 * @returns リクエスト履歴の配列
 */
export const getRequestHistories = async (): Promise<RequestHistory[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockRequestHistories;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/workflows/request-histories'));
  } catch (error) {
    logError(error, 'getRequestHistories');
    throw handleApiError(error, 'リクエスト履歴の取得に失敗しました');
  }
};

/**
 * 特定のリクエスト履歴を取得する
 * @param id リクエスト履歴ID
 * @returns リクエスト履歴
 */
export const getRequestHistoryById = async (id: string): Promise<RequestHistory> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const requestHistory = mockRequestHistories.find(r => r.id === id);
      if (!requestHistory) {
        throw new Error(`リクエスト履歴ID ${id} が見つかりません`);
      }
      return requestHistory;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/workflows/request-histories/${id}`));
  } catch (error) {
    logError(error, `getRequestHistoryById(${id})`);
    throw handleApiError(error, `リクエスト履歴ID ${id} の情報取得に失敗しました`);
  }
};

/**
 * プロジェクトIDに基づいてリクエスト履歴を取得する
 * @param projectId プロジェクトID
 * @returns リクエスト履歴の配列
 */
export const getRequestHistoriesByProjectId = async (projectId: string): Promise<RequestHistory[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockRequestHistories.filter(r => r.targetId === projectId && r.targetType === 'project');
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/workflows/request-histories/project/${projectId}`));
  } catch (error) {
    logError(error, `getRequestHistoriesByProjectId(${projectId})`);
    throw handleApiError(error, `プロジェクトID ${projectId} のリクエスト履歴取得に失敗しました`);
  }
};

/**
 * 申請者IDに基づいてリクエスト履歴を取得する
 * @param requesterId 申請者ID
 * @returns リクエスト履歴の配列
 */
export const getRequestHistoriesByRequesterId = async (requesterId: string): Promise<RequestHistory[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockRequestHistories.filter(r => r.requesterId === requesterId);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/workflows/request-histories/requester/${requesterId}`));
  } catch (error) {
    logError(error, `getRequestHistoriesByRequesterId(${requesterId})`);
    throw handleApiError(error, `申請者ID ${requesterId} のリクエスト履歴取得に失敗しました`);
  }
};

/**
 * ステータスに基づいてリクエスト履歴を取得する
 * @param status ステータス
 * @returns リクエスト履歴の配列
 */
export const getRequestHistoriesByStatus = async (status: string): Promise<RequestHistory[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockRequestHistories.filter(r => r.status === status);
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/workflows/request-histories/status/${status}`));
  } catch (error) {
    logError(error, `getRequestHistoriesByStatus(${status})`);
    throw handleApiError(error, `ステータス ${status} のリクエスト履歴取得に失敗しました`);
  }
};

/**
 * 新しいリクエスト履歴を作成する
 * @param data リクエスト履歴データ
 * @returns 作成されたリクエスト履歴
 */
export const createRequestHistory = async (data: Omit<RequestHistory, 'id' | 'createdAt' | 'updatedAt'>): Promise<RequestHistory> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const now = new Date().toISOString();
      return {
        id: `request-${Date.now()}`,
        ...data,
        createdAt: now,
        updatedAt: now
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/workflows/request-histories', data));
  } catch (error) {
    logError(error, 'createRequestHistory');
    throw handleApiError(error, 'リクエスト履歴の作成に失敗しました');
  }
};

/**
 * リクエスト履歴を更新する
 * @param id リクエスト履歴ID
 * @param data 更新データ
 * @returns 更新されたリクエスト履歴
 */
export const updateRequestHistory = async (
  id: string,
  data: Partial<RequestHistory>
): Promise<RequestHistory> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const requestHistoryIndex = mockRequestHistories.findIndex(r => r.id === id);
      if (requestHistoryIndex === -1) {
        throw new Error(`リクエスト履歴ID ${id} が見つかりません`);
      }
      
      const updatedRequestHistory = {
        ...mockRequestHistories[requestHistoryIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return updatedRequestHistory;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.patch(`/workflows/request-histories/${id}`, data));
  } catch (error) {
    logError(error, `updateRequestHistory(${id})`);
    throw handleApiError(error, `リクエスト履歴ID ${id} の更新に失敗しました`);
  }
};

/**
 * リクエスト履歴を削除する
 * @param id リクエスト履歴ID
 */
export const removeRequestHistory = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: RequestHistory with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/workflows/request-histories/${id}`));
  } catch (error) {
    logError(error, `removeRequestHistory(${id})`);
    throw handleApiError(error, `リクエスト履歴ID ${id} の削除に失敗しました`);
  }
};

/**
 * プロジェクト承認をリクエストする
 * @param projectId プロジェクトID
 * @param data リクエストデータ
 * @returns 作成されたリクエスト履歴
 */
export const requestProjectApproval = async (
  projectId: string,
  data: { requesterId: string; remarks?: string }
): Promise<RequestHistory> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const now = new Date().toISOString();
      return {
        id: `request-${Date.now()}`,
        workflowId: 'workflow-1',
        requesterId: data.requesterId,
        targetId: projectId,
        targetType: 'project',
        status: 'pending',
        currentStep: 1,
        steps: [
          {
            stepId: 'step-1',
            status: 'completed',
            actorId: data.requesterId,
            actionDate: now,
            remarks: data.remarks || 'プロジェクト承認申請'
          },
          {
            stepId: 'step-2',
            status: 'pending',
            actorId: null,
            actionDate: null,
            remarks: null
          }
        ],
        createdAt: now,
        updatedAt: now
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post(`/workflows/projects/${projectId}/request-approval`, data));
  } catch (error) {
    logError(error, `requestProjectApproval(${projectId})`);
    throw handleApiError(error, `プロジェクトID ${projectId} の承認リクエストに失敗しました`);
  }
};

/**
 * プロジェクトを承認する
 * @param requestHistoryId リクエスト履歴ID
 * @param data 承認データ
 * @returns 更新されたリクエスト履歴
 */
export const approveProject = async (
  requestHistoryId: string,
  data: { approverId: string; remarks?: string }
): Promise<RequestHistory> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const requestHistory = await getRequestHistoryById(requestHistoryId);
      if (requestHistory.status !== 'pending') {
        throw new Error('保留中のリクエストのみ承認できます');
      }
      
      const now = new Date().toISOString();
      const currentStepIndex = requestHistory.currentStep - 1;
      const steps = [...requestHistory.steps];
      
      // 現在のステップを完了としてマーク
      steps[currentStepIndex] = {
        ...steps[currentStepIndex],
        status: 'completed',
        actorId: data.approverId,
        actionDate: now,
        remarks: data.remarks || '承認済み'
      };
      
      // 次のステップがあれば保留中としてマーク、なければ承認完了
      let newStatus = 'approved';
      let newCurrentStep = requestHistory.currentStep;
      
      if (currentStepIndex + 1 < steps.length) {
        steps[currentStepIndex + 1] = {
          ...steps[currentStepIndex + 1],
          status: 'pending'
        };
        newStatus = 'pending';
        newCurrentStep = requestHistory.currentStep + 1;
      }
      
      return {
        ...requestHistory,
        status: newStatus,
        currentStep: newCurrentStep,
        steps,
        updatedAt: now
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post(`/workflows/request-histories/${requestHistoryId}/approve`, data));
  } catch (error) {
    logError(error, `approveProject(${requestHistoryId})`);
    throw handleApiError(error, `リクエスト履歴ID ${requestHistoryId} の承認に失敗しました`);
  }
};

/**
 * プロジェクトを却下する
 * @param requestHistoryId リクエスト履歴ID
 * @param data 却下データ
 * @returns 更新されたリクエスト履歴
 */
export const rejectProject = async (
  requestHistoryId: string,
  data: { approverId: string; rejectionReason: string }
): Promise<RequestHistory> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const requestHistory = await getRequestHistoryById(requestHistoryId);
      if (requestHistory.status !== 'pending') {
        throw new Error('保留中のリクエストのみ却下できます');
      }
      
      const now = new Date().toISOString();
      const currentStepIndex = requestHistory.currentStep - 1;
      const steps = [...requestHistory.steps];
      
      // 現在のステップを却下としてマーク
      steps[currentStepIndex] = {
        ...steps[currentStepIndex],
        status: 'rejected',
        actorId: data.approverId,
        actionDate: now,
        remarks: data.rejectionReason
      };
      
      return {
        ...requestHistory,
        status: 'rejected',
        steps,
        updatedAt: now
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post(`/workflows/request-histories/${requestHistoryId}/reject`, data));
  } catch (error) {
    logError(error, `rejectProject(${requestHistoryId})`);
    throw handleApiError(error, `リクエスト履歴ID ${requestHistoryId} の却下に失敗しました`);
  }
};

/**
 * 保留中の承認リクエストを取得する
 * @returns 保留中のリクエスト履歴の配列
 */
export const getPendingApprovals = async (): Promise<RequestHistory[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockRequestHistories.filter(r => r.status === 'pending');
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/workflows/pending-approvals'));
  } catch (error) {
    logError(error, 'getPendingApprovals');
    throw handleApiError(error, '保留中の承認リクエスト取得に失敗しました');
  }
};

// デフォルトエクスポート
const workflowService = {
  getWorkflows,
  getWorkflowById,
  getRequestHistories,
  getRequestHistoryById,
  getRequestHistoriesByProjectId,
  getRequestHistoriesByRequesterId,
  getRequestHistoriesByStatus,
  createRequestHistory,
  updateRequestHistory,
  removeRequestHistory,
  requestProjectApproval,
  approveProject,
  rejectProject,
  getPendingApprovals
};

export default workflowService;
