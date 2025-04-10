import api from './api';

// パートナー会社の型定義
export interface Partner {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  status: '取引中' | '取引停止' | '候補';
  businessCategory?: string;
  establishedYear?: number;
  employeeCount?: number;
  annualRevenue?: string;
  antisocialCheckCompleted?: boolean;
  antisocialCheckDate?: Date;
  creditCheckCompleted?: boolean;
  creditCheckDate?: Date;
  remarks?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// パートナー会社作成用DTO
export interface CreatePartnerDto {
  name: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  status?: '取引中' | '取引停止' | '候補';
  businessCategory?: string;
  establishedYear?: number;
  employeeCount?: number;
  annualRevenue?: string;
  antisocialCheckCompleted?: boolean;
  antisocialCheckDate?: Date;
  creditCheckCompleted?: boolean;
  creditCheckDate?: Date;
  remarks?: string;
}

// パートナー会社更新用DTO
export interface UpdatePartnerDto extends Partial<CreatePartnerDto> {}

/**
 * パートナー会社関連のAPI操作を行うサービス
 */
const partnerService = {
  /**
   * パートナー会社一覧を取得
   * @returns パートナー会社一覧
   */
  async getPartners(): Promise<Partner[]> {
    try {
      const response = await api.get<Partner[]>('/partners');
      return response.data;
    } catch (error) {
      console.error('Get partners error:', error);
      throw error;
    }
  },

  /**
   * パートナー会社詳細を取得
   * @param id パートナー会社ID
   * @returns パートナー会社詳細
   */
  async getPartner(id: string): Promise<Partner> {
    try {
      const response = await api.get<Partner>(`/partners/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get partner ${id} error:`, error);
      throw error;
    }
  },

  /**
   * パートナー会社を作成
   * @param partnerData パートナー会社データ
   * @returns 作成されたパートナー会社
   */
  async createPartner(partnerData: CreatePartnerDto): Promise<Partner> {
    try {
      const response = await api.post<Partner>('/partners', partnerData);
      return response.data;
    } catch (error) {
      console.error('Create partner error:', error);
      throw error;
    }
  },

  /**
   * パートナー会社を更新
   * @param id パートナー会社ID
   * @param partnerData 更新データ
   * @returns 更新されたパートナー会社
   */
  async updatePartner(id: string, partnerData: UpdatePartnerDto): Promise<Partner> {
    try {
      const response = await api.patch<Partner>(`/partners/${id}`, partnerData);
      return response.data;
    } catch (error) {
      console.error(`Update partner ${id} error:`, error);
      throw error;
    }
  },

  /**
   * パートナー会社を削除
   * @param id パートナー会社ID
   * @returns 削除結果
   */
  async deletePartner(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/partners/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error(`Delete partner ${id} error:`, error);
      throw error;
    }
  }
};

export default partnerService;
