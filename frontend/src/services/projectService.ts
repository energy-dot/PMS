import api from './api';
import { API_BASE_URL } from '../config';

// 案件の型定義
export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  departmentId: string;
  sectionId: string;
  department?: {
    id: string;
    name: string;
  };
  section?: {
    id: string;
    name: string;
  };
  budget: number;
  requiredHeadcount: number;
  currentHeadcount: number;
  requiredSkills: string;
  contractType: string;
  rateMin: number;
  rateMax: number;
  isApproved: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

// 案件検索用のパラメータ
export interface SearchProjectsParams {
  name?: string;
  status?: string;
  departmentId?: string;
  sectionId?: string;
  contractType?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  rateMin?: number;
  rateMax?: number;
  requiredSkills?: string;
}

// プロジェクトサービスクラス
class ProjectService {
  // 全ての案件を取得
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await api.get(`/projects`);
      return response.data;
    } catch (error) {
      console.error('案件の取得に失敗しました', error);
      throw error;
    }
  }

  // 特定の案件を取得
  async getProjectById(id: string): Promise<Project> {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} の案件の取得に失敗しました`, error);
      throw error;
    }
  }

  // 案件を検索
  async searchProjects(params: SearchProjectsParams): Promise<Project[]> {
    try {
      // URLクエリパラメータを構築
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
      
      const response = await api.get(`/projects/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('案件の検索に失敗しました', error);
      throw error;
    }
  }

  // 案件を作成
  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'isApproved' | 'approvedBy' | 'approvedAt' | 'rejectionReason'>): Promise<Project> {
    try {
      const response = await api.post(`/projects`, data);
      return response.data;
    } catch (error) {
      console.error('案件の作成に失敗しました', error);
      throw error;
    }
  }

  // 案件を更新
  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    try {
      const response = await api.patch(`/projects/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} の案件の更新に失敗しました`, error);
      throw error;
    }
  }

  // 案件を削除
  async deleteProject(id: string): Promise<void> {
    try {
      await api.delete(`/projects/${id}`);
    } catch (error) {
      console.error(`ID: ${id} の案件の削除に失敗しました`, error);
      throw error;
    }
  }

  // 案件を承認
  async approveProject(id: string): Promise<Project> {
    try {
      const response = await api.post(`/projects/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} の案件の承認に失敗しました`, error);
      throw error;
    }
  }

  // 案件を差し戻し
  async rejectProject(id: string, reason: string): Promise<Project> {
    try {
      const response = await api.post(`/projects/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} の案件の差し戻しに失敗しました`, error);
      throw error;
    }
  }

  // 案件のステータスを更新
  async updateProjectStatus(id: string, status: string): Promise<Project> {
    try {
      const response = await api.patch(`/projects/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} の案件のステータス更新に失敗しました`, error);
      throw error;
    }
  }

  // 部署によるプロジェクト検索
  async getProjectsByDepartment(departmentId: string): Promise<Project[]> {
    return this.searchProjects({ departmentId });
  }

  // セクションによるプロジェクト検索
  async getProjectsBySection(sectionId: string): Promise<Project[]> {
    return this.searchProjects({ sectionId });
  }

  // 下位互換性のため
  async getProjects(): Promise<Project[]> {
    return this.getAllProjects();
  }

  // 下位互換性のため
  async getProject(id: string): Promise<Project> {
    return this.getProjectById(id);
  }
}

export default new ProjectService();