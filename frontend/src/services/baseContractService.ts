import api from './api';

// 基本契約の型定義
export interface BaseContract {
  id: string;
  partner: {
    id: string;
    name: string;
  };
  name: string;
  startDate: Date;
  endDate: Date;
  status: '有効' | '更新待ち' | '終了';
  contractType?: string;
  contractFile?: string;
  terms?: string;
  isAutoRenew: boolean;
  renewalNoticeDate?: Date;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 基本契約作成用DTO
export interface BaseContractDto {
  partnerId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: '有効' | '更新待ち' | '終了';
  contractType?: string;
  contractFile?: string;
  terms?: string;
  isAutoRenew?: boolean;
  renewalNoticeDate?: Date;
  remarks?: string;
}

// 基本契約更新用DTO
export interface UpdateBaseContractDto extends Partial<Omit<BaseContractDto, 'partnerId'>> {}

/**
 * 基本契約関連のAPI操作を行うサービス
 */
const baseContractService = {
  /**
   * 基本契約一覧を取得
   * @returns 基本契約一覧
   */
  async getBaseContracts(): Promise<BaseContract[]> {
    try {
      const response = await api.get<BaseContract[]>('/base-contracts');
      return response.data;
    } catch (error) {
      console.error('Get base contracts error:', error);
      throw error;
    }
  },

  /**
   * 特定のパートナー会社の基本契約一覧を取得
   * @param partnerId パートナー会社ID
   * @returns 基本契約一覧
   */
  async getBaseContractsByPartnerId(partnerId: string): Promise<BaseContract[]> {
    try {
      const response = await api.get<BaseContract[]>(`/base-contracts/partner/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error(`Get base contracts for partner ${partnerId} error:`, error);
      throw error;
    }
  },

  /**
   * 期限が近づいている基本契約を取得
   * @param days 日数（今日からこの日数以内に期限が来る契約を取得）
   * @returns 基本契約一覧
   */
  async getUpcomingRenewals(days: number = 90): Promise<BaseContract[]> {
    try {
      const response = await api.get<BaseContract[]>(`/base-contracts/upcoming-renewals?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Get upcoming renewals error:', error);
      throw error;
    }
  },

  /**
   * 期限切れの基本契約を取得
   * @returns 基本契約一覧
   */
  async getExpiredContracts(): Promise<BaseContract[]> {
    try {
      const response = await api.get<BaseContract[]>('/base-contracts/expired');
      return response.data;
    } catch (error) {
      console.error('Get expired contracts error:', error);
      throw error;
    }
  },

  /**
   * 基本契約詳細を取得
   * @param id 基本契約ID
   * @returns 基本契約詳細
   */
  async getBaseContract(id: string): Promise<BaseContract> {
    try {
      const response = await api.get<BaseContract>(`/base-contracts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get base contract ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 基本契約を作成
   * @param baseContractData 基本契約データ
   * @returns 作成された基本契約
   */
  async createBaseContract(baseContractData: BaseContractDto): Promise<BaseContract> {
    try {
      const response = await api.post<BaseContract>('/base-contracts', baseContractData);
      return response.data;
    } catch (error) {
      console.error('Create base contract error:', error);
      throw error;
    }
  },

  /**
   * 基本契約を更新
   * @param id 基本契約ID
   * @param baseContractData 更新データ
   * @returns 更新された基本契約
   */
  async updateBaseContract(id: string, baseContractData: UpdateBaseContractDto): Promise<BaseContract> {
    try {
      const response = await api.patch<BaseContract>(`/base-contracts/${id}`, baseContractData);
      return response.data;
    } catch (error) {
      console.error(`Update base contract ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 基本契約を削除
   * @param id 基本契約ID
   * @returns 削除結果
   */
  async deleteBaseContract(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/base-contracts/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error(`Delete base contract ${id} error:`, error);
      throw error;
    }
  }
};

export default baseContractService;
