import axios from 'axios';
import { API_BASE_URL } from '../config';

// 要員の型定義
export interface Staff {
  id: string;
  fullName: string;
  nameKana: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  partnerId: string;
  partner?: {
    id: string;
    name: string;
  };
  skills: string;
  skillLevel: number;
  yearsOfExperience: number;
  contractType: string;
  rate: number;
  availability: 'available' | 'unavailable' | 'partially_available';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// 要員検索用のパラメータ
export interface SearchStaffParams {
  fullName?: string;
  nameKana?: string;
  partnerId?: string;
  skills?: string;
  skillLevelMin?: number;
  skillLevelMax?: number;
  yearsOfExperienceMin?: number;
  yearsOfExperienceMax?: number;
  contractType?: string;
  rateMin?: number;
  rateMax?: number;
  availability?: 'available' | 'unavailable' | 'partially_available';
}

// 要員サービスクラス
class StaffService {
  // 全ての要員を取得
  async getAllStaff(): Promise<Staff[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff`);
      return response.data;
    } catch (error) {
      console.error('要員の取得に失敗しました', error);
      throw error;
    }
  }

  // 特定の要員を取得
  async getStaffById(id: string): Promise<Staff> {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/${id}`);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} の要員の取得に失敗しました`, error);
      throw error;
    }
  }

  // 要員を検索
  async searchStaff(params: SearchStaffParams): Promise<Staff[]> {
    try {
      // URLクエリパラメータを構築
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
      
      const response = await axios.get(`${API_BASE_URL}/staff/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('要員の検索に失敗しました', error);
      throw error;
    }
  }

  // 要員を作成
  async createStaff(data: Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>): Promise<Staff> {
    try {
      const response = await axios.post(`${API_BASE_URL}/staff`, data);
      return response.data;
    } catch (error) {
      console.error('要員の作成に失敗しました', error);
      throw error;
    }
  }

  // 要員を更新
  async updateStaff(id: string, data: Partial<Staff>): Promise<Staff> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/staff/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} の要員の更新に失敗しました`, error);
      throw error;
    }
  }

  // 要員を削除
  async deleteStaff(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/staff/${id}`);
    } catch (error) {
      console.error(`ID: ${id} の要員の削除に失敗しました`, error);
      throw error;
    }
  }

  // アベイラビリティの表示名を取得
  getAvailabilityText(availability: string): string {
    switch (availability) {
      case 'available': return '稼働可能';
      case 'unavailable': return '稼働不可';
      case 'partially_available': return '一部稼働可能';
      default: return availability;
    }
  }

  // スキルレベルの表示名を取得
  getSkillLevelText(level: number): string {
    switch (level) {
      case 1: return '初級';
      case 2: return '中級';
      case 3: return '上級';
      case 4: return 'エキスパート';
      case 5: return 'マスター';
      default: return `レベル ${level}`;
    }
  }
}

export default new StaffService();
