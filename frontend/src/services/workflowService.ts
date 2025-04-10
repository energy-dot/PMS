import api from './api';

// 申請履歴の型定義
export interface RequestHistory {
  id: string;
  projectId: string;
  requesterId: string;
  requestType: string;
  requestStatus: string;
  requestDate: Date;
  approverId?: string;
  approvalDate?: Date;
  rejectionReason?: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
  // 関連エンティティ
  project?: any;
  requester?: any;
  approver?: any;
}

// 申請履歴作成用DTO
export interface CreateRequestHistoryDto {
  projectId: string;
  requesterId: string;
  requestType: string;
  requestStatus?: string;
  requestDate: Date;
  approverId?: string;
  approvalDate?: Date;
  rejectionReason?: string;
  remarks?: string;
}

// 申請履歴更新用DTO
export interface UpdateRequestHistoryDto extends Partial<CreateRequestHistoryDto> {}

/**
 * ワークフロー関連のAPI操作を行うサービス
 */
const workflowService = {
  /**
   * 申請履歴一覧を取得
   * @returns 申請履歴一覧
   */
  async getRequestHistories(): Promise<RequestHistory[]> {
    try {
      const response = await api.get<RequestHistory[]>('/workflows/request-histories');
      return response.data;
    } catch (error) {
      console.error('Get request histories error:', error);
      throw error;
    }
  },

  /**
   * 申請履歴詳細を取得
   * @param id 申請履歴ID
   * @returns 申請履歴詳細
   */
  async getRequestHistory(id: string): Promise<RequestHistory> {
    try {
      const response = await api.get<RequestHistory>(`/workflows/request-histories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get request history ${id} error:`, error);
      throw error;
    }
  },

  /**
   * プロジェクトIDを指定して申請履歴一覧を取得
   * @param projectId プロジェクトID
   * @returns 申請履歴一覧
   */
  async getRequestHistoriesByProject(projectId: string): Promise<RequestHistory[]> {
    try {
      const response = await api.get<RequestHistory[]>(`/workflows/request-histories/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Get request histories by project ${projectId} error:`, error);
      throw error;
    }
  },

  /**
   * 申請者IDを指定して申請履歴一覧を取得
   * @param requesterId 申請者ID
   * @returns 申請履歴一覧
   */
  async getRequestHistoriesByRequester(requesterId: string): Promise<RequestHistory[]> {
    try {
      const response = await api.get<RequestHistory[]>(`/workflows/request-histories/requester/${requesterId}`);
      return response.data;
    } catch (error) {
      console.error(`Get request histories by requester ${requesterId} error:`, error);
      throw error;
    }
  },

  /**
   * ステータスを指定して申請履歴一覧を取得
   * @param status ステータス
   * @returns 申請履歴一覧
   */
  async getRequestHistoriesByStatus(status: string): Promise<RequestHistory[]> {
    try {
      const response = await api.get<RequestHistory[]>(`/workflows/request-histories/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Get request histories by status ${status} error:`, error);
      throw error;
    }
  },

  /**
   * 申請履歴を作成
   * @param requestHistoryData 申請履歴データ
   * @returns 作成された申請履歴
   */
  async createRequestHistory(requestHistoryData: CreateRequestHistoryDto): Promise<RequestHistory> {
    try {
      const response = await api.post<RequestHistory>('/workflows/request-histories', requestHistoryData);
      return response.data;
    } catch (error) {
      console.error('Create request history error:', error);
      throw error;
    }
  },

  /**
   * 申請履歴を更新
   * @param id 申請履歴ID
   * @param requestHistoryData 更新データ
   * @returns 更新された申請履歴
   */
  async updateRequestHistory(id: string, requestHistoryData: UpdateRequestHistoryDto): Promise<RequestHistory> {
    try {
      const response = await api.patch<RequestHistory>(`/workflows/request-histories/${id}`, requestHistoryData);
      return response.data;
    } catch (error) {
      console.error(`Update request history ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 申請履歴を削除
   * @param id 申請履歴ID
   * @returns 削除結果
   */
  async deleteRequestHistory(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/workflows/request-histories/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error(`Delete request history ${id} error:`, error);
      throw error;
    }
  },

  /**
   * プロジェクト承認を申請
   * @param projectId プロジェクトID
   * @param requesterId 申請者ID
   * @param remarks 備考
   * @returns 作成された申請履歴
   */
  async requestProjectApproval(projectId: string, requesterId: string, remarks?: string): Promise<RequestHistory> {
    try {
      const response = await api.post<RequestHistory>(`/workflows/projects/${projectId}/request-approval`, {
        requesterId,
        remarks
      });
      return response.data;
    } catch (error) {
      console.error(`Request project approval error:`, error);
      throw error;
    }
  },

  /**
   * プロジェクト承認を承認
   * @param requestHistoryId 申請履歴ID
   * @param approverId 承認者ID
   * @param remarks 備考
   * @returns 更新された申請履歴
   */
  async approveProject(requestHistoryId: string, approverId: string, remarks?: string): Promise<RequestHistory> {
    try {
      const response = await api.post<RequestHistory>(`/workflows/request-histories/${requestHistoryId}/approve`, {
        approverId,
        remarks
      });
      return response.data;
    } catch (error) {
      console.error(`Approve project error:`, error);
      throw error;
    }
  },

  /**
   * プロジェクト承認を差し戻し
   * @param requestHistoryId 申請履歴ID
   * @param approverId 承認者ID
   * @param rejectionReason 差戻し理由
   * @returns 更新された申請履歴
   */
  async rejectProject(requestHistoryId: string, approverId: string, rejectionReason: string): Promise<RequestHistory> {
    try {
      const response = await api.post<RequestHistory>(`/workflows/request-histories/${requestHistoryId}/reject`, {
        approverId,
        rejectionReason
      });
      return response.data;
    } catch (error) {
      console.error(`Reject project error:`, error);
      throw error;
    }
  },

  /**
   * 承認待ちの申請一覧を取得
   * @returns 承認待ちの申請一覧
   */
  async getPendingApprovals(): Promise<RequestHistory[]> {
    try {
      const response = await api.get<RequestHistory[]>('/workflows/pending-approvals');
      return response.data;
    } catch (error) {
      console.error('Get pending approvals error:', error);
      throw error;
    }
  }
};

export default workflowService;
