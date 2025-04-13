import axios from 'axios';
import { API_BASE_URL } from '../config';

// セクションの型定義
export interface Section {
  id: string;
  name: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
}

class SectionService {
  // 全てのセクションを取得
  async getAllSections(): Promise<Section[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/sections`);
      return response.data;
    } catch (error) {
      console.error('セクションの取得に失敗しました', error);
      throw error;
    }
  }

  // 特定の部署に属するセクションを取得
  async getSectionsByDepartment(departmentId: string): Promise<Section[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/sections?departmentId=${departmentId}`);
      return response.data;
    } catch (error) {
      console.error(`部署ID: ${departmentId} のセクション取得に失敗しました`, error);
      throw error;
    }
  }

  // 特定のセクションを取得
  async getSectionById(id: string): Promise<Section> {
    try {
      const response = await axios.get(`${API_BASE_URL}/sections/${id}`);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のセクション取得に失敗しました`, error);
      throw error;
    }
  }

  // セクションを作成
  async createSection(data: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>): Promise<Section> {
    try {
      const response = await axios.post(`${API_BASE_URL}/sections`, data);
      return response.data;
    } catch (error) {
      console.error('セクションの作成に失敗しました', error);
      throw error;
    }
  }

  // セクションを更新
  async updateSection(id: string, data: Partial<Section>): Promise<Section> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/sections/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のセクション更新に失敗しました`, error);
      throw error;
    }
  }

  // セクションを削除
  async deleteSection(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/sections/${id}`);
    } catch (error) {
      console.error(`ID: ${id} のセクション削除に失敗しました`, error);
      throw error;
    }
  }
}

export default new SectionService();
