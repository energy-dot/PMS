import api from './api';

// 評価の型定義
export interface Evaluation {
  id: string;
  staffId: string;
  evaluatorId: string;
  projectId?: string;
  evaluationDate: Date;
  technicalSkill: number;
  communicationSkill: number;
  problemSolving: number;
  teamwork: number;
  leadership: number;
  overallRating: number;
  strengths?: string;
  areasToImprove?: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
  // 関連エンティティ
  staff?: any;
  evaluator?: any;
  project?: any;
  skills?: EvaluationSkill[];
}

// 評価スキルの型定義
export interface EvaluationSkill {
  id: string;
  evaluationId: string;
  skillName: string;
  skillLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

// 評価作成用DTO
export interface CreateEvaluationDto {
  staffId: string;
  evaluatorId: string;
  projectId?: string;
  evaluationDate: Date;
  technicalSkill: number;
  communicationSkill: number;
  problemSolving: number;
  teamwork: number;
  leadership: number;
  overallRating: number;
  strengths?: string;
  areasToImprove?: string;
  comments?: string;
  skills?: CreateEvaluationSkillDto[];
}

// 評価スキル作成用DTO
export interface CreateEvaluationSkillDto {
  skillName: string;
  skillLevel: number;
}

// 評価更新用DTO
export interface UpdateEvaluationDto extends Partial<CreateEvaluationDto> {}

// 評価スキル更新用DTO
export interface UpdateEvaluationSkillDto extends Partial<CreateEvaluationSkillDto> {}

/**
 * 評価関連のAPI操作を行うサービス
 */
const evaluationService = {
  /**
   * 評価一覧を取得
   * @returns 評価一覧
   */
  async getEvaluations(): Promise<Evaluation[]> {
    try {
      const response = await api.get<Evaluation[]>('/evaluations');
      return response.data;
    } catch (error) {
      console.error('Get evaluations error:', error);
      throw error;
    }
  },

  /**
   * 評価詳細を取得
   * @param id 評価ID
   * @returns 評価詳細
   */
  async getEvaluation(id: string): Promise<Evaluation> {
    try {
      const response = await api.get<Evaluation>(`/evaluations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get evaluation ${id} error:`, error);
      throw error;
    }
  },

  /**
   * スタッフIDを指定して評価一覧を取得
   * @param staffId スタッフID
   * @returns 評価一覧
   */
  async getEvaluationsByStaff(staffId: string): Promise<Evaluation[]> {
    try {
      const response = await api.get<Evaluation[]>(`/evaluations/staff/${staffId}`);
      return response.data;
    } catch (error) {
      console.error(`Get evaluations by staff ${staffId} error:`, error);
      throw error;
    }
  },

  /**
   * 評価者IDを指定して評価一覧を取得
   * @param evaluatorId 評価者ID
   * @returns 評価一覧
   */
  async getEvaluationsByEvaluator(evaluatorId: string): Promise<Evaluation[]> {
    try {
      const response = await api.get<Evaluation[]>(`/evaluations/evaluator/${evaluatorId}`);
      return response.data;
    } catch (error) {
      console.error(`Get evaluations by evaluator ${evaluatorId} error:`, error);
      throw error;
    }
  },

  /**
   * プロジェクトIDを指定して評価一覧を取得
   * @param projectId プロジェクトID
   * @returns 評価一覧
   */
  async getEvaluationsByProject(projectId: string): Promise<Evaluation[]> {
    try {
      const response = await api.get<Evaluation[]>(`/evaluations/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Get evaluations by project ${projectId} error:`, error);
      throw error;
    }
  },

  /**
   * 評価を作成
   * @param evaluationData 評価データ
   * @returns 作成された評価
   */
  async createEvaluation(evaluationData: CreateEvaluationDto): Promise<Evaluation> {
    try {
      const response = await api.post<Evaluation>('/evaluations', evaluationData);
      return response.data;
    } catch (error) {
      console.error('Create evaluation error:', error);
      throw error;
    }
  },

  /**
   * 評価を更新
   * @param id 評価ID
   * @param evaluationData 更新データ
   * @returns 更新された評価
   */
  async updateEvaluation(id: string, evaluationData: UpdateEvaluationDto): Promise<Evaluation> {
    try {
      const response = await api.patch<Evaluation>(`/evaluations/${id}`, evaluationData);
      return response.data;
    } catch (error) {
      console.error(`Update evaluation ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 評価を削除
   * @param id 評価ID
   * @returns 削除結果
   */
  async deleteEvaluation(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/evaluations/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error(`Delete evaluation ${id} error:`, error);
      throw error;
    }
  },

  /**
   * スタッフの平均評価を取得
   * @param staffId スタッフID
   * @returns 平均評価データ
   */
  async getStaffAverageRatings(staffId: string): Promise<any> {
    try {
      const response = await api.get<any>(`/evaluations/staff/${staffId}/average-ratings`);
      return response.data;
    } catch (error) {
      console.error(`Get staff average ratings error:`, error);
      throw error;
    }
  },

  /**
   * スタッフのスキル評価を取得
   * @param staffId スタッフID
   * @returns スキル評価データ
   */
  async getStaffSkillRatings(staffId: string): Promise<any> {
    try {
      const response = await api.get<any>(`/evaluations/staff/${staffId}/skill-ratings`);
      return response.data;
    } catch (error) {
      console.error(`Get staff skill ratings error:`, error);
      throw error;
    }
  }
};

export default evaluationService;
