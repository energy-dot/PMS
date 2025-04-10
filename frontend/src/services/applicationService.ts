import api from './api';

// 応募者の型定義
export interface Application {
  id: string;
  projectId: string;
  partnerId: string;
  contactPersonId?: string;
  applicantName: string;
  age?: number;
  gender?: string;
  nearestStation?: string;
  desiredRate?: string;
  skillSummary?: string;
  skillSheetUrl?: string;
  applicationDate: Date;
  applicationSource?: string;
  status: string;
  documentScreenerId?: string;
  documentScreeningComment?: string;
  finalResultNotificationDate?: Date;
  remarks?: string;
  interviewRecords?: InterviewRecord[];
  createdAt: Date;
  updatedAt: Date;
  // 関連エンティティ
  project?: any;
  partner?: any;
  contactPerson?: any;
  documentScreener?: any;
}

// 面談記録の型定義
export interface InterviewRecord {
  id: string;
  applicationId: string;
  interviewDate: Date;
  interviewerId?: string;
  interviewFormat: string;
  evaluation?: string;
  evaluationComment?: string;
  createdAt: Date;
  updatedAt: Date;
  // 関連エンティティ
  application?: Application;
  interviewer?: any;
}

// 応募者作成用DTO
export interface CreateApplicationDto {
  projectId: string;
  partnerId: string;
  contactPersonId?: string;
  applicantName: string;
  age?: number;
  gender?: string;
  nearestStation?: string;
  desiredRate?: string;
  skillSummary?: string;
  skillSheetUrl?: string;
  applicationDate: Date;
  applicationSource?: string;
  status?: string;
  documentScreenerId?: string;
  documentScreeningComment?: string;
  finalResultNotificationDate?: Date;
  remarks?: string;
}

// 応募者更新用DTO
export interface UpdateApplicationDto extends Partial<CreateApplicationDto> {}

// 面談記録作成用DTO
export interface CreateInterviewRecordDto {
  applicationId: string;
  interviewDate: Date;
  interviewerId?: string;
  interviewFormat: string;
  evaluation?: string;
  evaluationComment?: string;
}

// 面談記録更新用DTO
export interface UpdateInterviewRecordDto extends Partial<CreateInterviewRecordDto> {}

/**
 * 応募者関連のAPI操作を行うサービス
 */
const applicationService = {
  /**
   * 応募者一覧を取得
   * @returns 応募者一覧
   */
  async getApplications(): Promise<Application[]> {
    try {
      const response = await api.get<Application[]>('/applications');
      return response.data;
    } catch (error) {
      console.error('Get applications error:', error);
      throw error;
    }
  },

  /**
   * 応募者詳細を取得
   * @param id 応募者ID
   * @returns 応募者詳細
   */
  async getApplication(id: string): Promise<Application> {
    try {
      const response = await api.get<Application>(`/applications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get application ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 案件IDを指定して応募者一覧を取得
   * @param projectId 案件ID
   * @returns 応募者一覧
   */
  async getApplicationsByProject(projectId: string): Promise<Application[]> {
    try {
      const response = await api.get<Application[]>(`/applications/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Get applications by project ${projectId} error:`, error);
      throw error;
    }
  },

  /**
   * パートナー会社IDを指定して応募者一覧を取得
   * @param partnerId パートナー会社ID
   * @returns 応募者一覧
   */
  async getApplicationsByPartner(partnerId: string): Promise<Application[]> {
    try {
      const response = await api.get<Application[]>(`/applications/partner/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error(`Get applications by partner ${partnerId} error:`, error);
      throw error;
    }
  },

  /**
   * ステータスを指定して応募者一覧を取得
   * @param status ステータス
   * @returns 応募者一覧
   */
  async getApplicationsByStatus(status: string): Promise<Application[]> {
    try {
      const response = await api.get<Application[]>(`/applications/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Get applications by status ${status} error:`, error);
      throw error;
    }
  },

  /**
   * 応募者を作成
   * @param applicationData 応募者データ
   * @returns 作成された応募者
   */
  async createApplication(applicationData: CreateApplicationDto): Promise<Application> {
    try {
      const response = await api.post<Application>('/applications', applicationData);
      return response.data;
    } catch (error) {
      console.error('Create application error:', error);
      throw error;
    }
  },

  /**
   * 応募者を更新
   * @param id 応募者ID
   * @param applicationData 更新データ
   * @returns 更新された応募者
   */
  async updateApplication(id: string, applicationData: UpdateApplicationDto): Promise<Application> {
    try {
      const response = await api.patch<Application>(`/applications/${id}`, applicationData);
      return response.data;
    } catch (error) {
      console.error(`Update application ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 応募者を削除
   * @param id 応募者ID
   * @returns 削除結果
   */
  async deleteApplication(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/applications/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error(`Delete application ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 面談記録一覧を取得
   * @returns 面談記録一覧
   */
  async getInterviewRecords(): Promise<InterviewRecord[]> {
    try {
      const response = await api.get<InterviewRecord[]>('/applications/interview-records');
      return response.data;
    } catch (error) {
      console.error('Get interview records error:', error);
      throw error;
    }
  },

  /**
   * 面談記録詳細を取得
   * @param id 面談記録ID
   * @returns 面談記録詳細
   */
  async getInterviewRecord(id: string): Promise<InterviewRecord> {
    try {
      const response = await api.get<InterviewRecord>(`/applications/interview-records/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get interview record ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 応募者IDを指定して面談記録一覧を取得
   * @param applicationId 応募者ID
   * @returns 面談記録一覧
   */
  async getInterviewRecordsByApplication(applicationId: string): Promise<InterviewRecord[]> {
    try {
      const response = await api.get<InterviewRecord[]>(`/applications/${applicationId}/interview-records`);
      return response.data;
    } catch (error) {
      console.error(`Get interview records by application ${applicationId} error:`, error);
      throw error;
    }
  },

  /**
   * 面談記録を作成
   * @param interviewRecordData 面談記録データ
   * @returns 作成された面談記録
   */
  async createInterviewRecord(interviewRecordData: CreateInterviewRecordDto): Promise<InterviewRecord> {
    try {
      const response = await api.post<InterviewRecord>('/applications/interview-records', interviewRecordData);
      return response.data;
    } catch (error) {
      console.error('Create interview record error:', error);
      throw error;
    }
  },

  /**
   * 面談記録を更新
   * @param id 面談記録ID
   * @param interviewRecordData 更新データ
   * @returns 更新された面談記録
   */
  async updateInterviewRecord(id: string, interviewRecordData: UpdateInterviewRecordDto): Promise<InterviewRecord> {
    try {
      const response = await api.patch<InterviewRecord>(`/applications/interview-records/${id}`, interviewRecordData);
      return response.data;
    } catch (error) {
      console.error(`Update interview record ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 面談記録を削除
   * @param id 面談記録ID
   * @returns 削除結果
   */
  async deleteInterviewRecord(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/applications/interview-records/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error(`Delete interview record ${id} error:`, error);
      throw error;
    }
  }
};

export default applicationService;
