import axios from 'axios';
import { API_BASE_URL } from '../config';

// マスターデータの型定義
export interface MasterData {
  id: string;
  type: string;
  name: string;
  displayName: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// マスターデータサービスクラス
class MasterDataService {
  // マスターデータタイプの一覧を取得
  async getMasterDataTypes(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/master-data/types`);
      return response.data;
    } catch (error) {
      console.error('マスターデータタイプの取得に失敗しました', error);
      throw error;
    }
  }

  // 特定のタイプのマスターデータを取得
  async getMasterDataByType(type: string): Promise<MasterData[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/master-data/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`タイプ: ${type} のマスターデータの取得に失敗しました`, error);
      throw error;
    }
  }

  // 特定のマスターデータを取得
  async getMasterDataById(id: string): Promise<MasterData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/master-data/${id}`);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のマスターデータの取得に失敗しました`, error);
      throw error;
    }
  }

  // マスターデータを作成
  async createMasterData(
    type: string,
    data: Omit<MasterData, 'id' | 'type' | 'createdAt' | 'updatedAt'>
  ): Promise<MasterData> {
    try {
      const response = await axios.post(`${API_BASE_URL}/master-data`, {
        ...data,
        type,
      });
      return response.data;
    } catch (error) {
      console.error('マスターデータの作成に失敗しました', error);
      throw error;
    }
  }

  // マスターデータを更新
  async updateMasterData(id: string, data: Partial<MasterData>): Promise<MasterData> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/master-data/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のマスターデータの更新に失敗しました`, error);
      throw error;
    }
  }

  // マスターデータを削除
  async deleteMasterData(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/master-data/${id}`);
    } catch (error) {
      console.error(`ID: ${id} のマスターデータの削除に失敗しました`, error);
      throw error;
    }
  }

  // 新しいマスターデータタイプを作成
  async createMasterDataType(type: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/master-data/types`, { type });
    } catch (error) {
      console.error(`タイプ: ${type} の作成に失敗しました`, error);
      throw error;
    }
  }
}

export default new MasterDataService();
