import api from './api';

// 契約の型定義
export interface Contract {
  id: string;
  staff: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
  startDate: Date;
  endDate: Date;
  price: number;
  paymentTerms?: string;
  status: '契約中' | '更新待ち' | '契約終了';
  contractFile?: string;
  remarks?: string;
  isAutoRenew?: boolean;
  renewalNoticeDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// 契約作成用DTO
export interface CreateContractDto {
  staff: { id: string };
  project: { id: string };
  startDate: Date;
  endDate: Date;
  price: number;
  paymentTerms?: string;
  status?: '契約中' | '更新待ち' | '契約終了';
  contractFile?: string;
  remarks?: string;
  isAutoRenew?: boolean;
  renewalNoticeDate?: Date;
}

// 契約更新用DTO
export interface UpdateContractDto extends Partial<CreateContractDto> {}

/**
 * 契約関連のAPI操作を行うサービス
 */
const contractService = {
  /**
   * 契約一覧を取得
   * @returns 契約一覧
   */
  async getContracts(): Promise<Contract[]> {
    try {
      const response = await api.get<Contract[]>('/contracts');
      return response.data;
    } catch (error) {
      console.error('Get contracts error:', error);
      throw error;
    }
  },

  /**
   * 契約詳細を取得
   * @param id 契約ID
   * @returns 契約詳細
   */
  async getContract(id: string): Promise<Contract> {
    try {
      const response = await api.get<Contract>(`/contracts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get contract ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 特定の要員の契約一覧を取得
   * @param staffId 要員ID
   * @returns 契約一覧
   */
  async getContractsByStaffId(staffId: string): Promise<Contract[]> {
    try {
      // バックエンドにエンドポイントがなければ、全契約を取得してフィルタリングする
      const response = await api.get<Contract[]>('/contracts');
      return response.data.filter(contract => contract.staff.id === staffId);
    } catch (error) {
      console.error(`Get contracts for staff ${staffId} error:`, error);
      throw error;
    }
  },

  /**
   * 特定のプロジェクトの契約一覧を取得
   * @param projectId プロジェクトID
   * @returns 契約一覧
   */
  async getContractsByProjectId(projectId: string): Promise<Contract[]> {
    try {
      // バックエンドにエンドポイントがなければ、全契約を取得してフィルタリングする
      const response = await api.get<Contract[]>('/contracts');
      return response.data.filter(contract => contract.project.id === projectId);
    } catch (error) {
      console.error(`Get contracts for project ${projectId} error:`, error);
      throw error;
    }
  },

  /**
   * 契約を作成
   * @param contractData 契約データ
   * @returns 作成された契約
   */
  async createContract(contractData: CreateContractDto): Promise<Contract> {
    try {
      const response = await api.post<Contract>('/contracts', contractData);
      return response.data;
    } catch (error) {
      console.error('Create contract error:', error);
      throw error;
    }
  },

  /**
   * 契約を更新
   * @param id 契約ID
   * @param contractData 更新データ
   * @returns 更新された契約
   */
  async updateContract(id: string, contractData: UpdateContractDto): Promise<Contract> {
    try {
      const response = await api.patch<Contract>(`/contracts/${id}`, contractData);
      return response.data;
    } catch (error) {
      console.error(`Update contract ${id} error:`, error);
      throw error;
    }
  },

  /**
   * 契約を削除
   * @param id 契約ID
   * @returns 削除結果
   */
  async deleteContract(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/contracts/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error(`Delete contract ${id} error:`, error);
      throw error;
    }
  }
};

export default contractService;
