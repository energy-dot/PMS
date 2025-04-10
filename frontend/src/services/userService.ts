import axios from 'axios';
import { API_BASE_URL } from '../config';

// ユーザーの型定義
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'developer' | 'partner_manager' | 'admin' | 'viewer';
  department: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

// ユーザー作成用のDTO
export interface CreateUserDto {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: 'developer' | 'partner_manager' | 'admin' | 'viewer';
  department?: string;
  isActive?: boolean;
}

// ユーザー更新用のDTO
export interface UpdateUserDto {
  username?: string;
  fullName?: string;
  email?: string;
  password?: string;
  role?: 'developer' | 'partner_manager' | 'admin' | 'viewer';
  department?: string;
  isActive?: boolean;
}

// ユーザーサービスクラス
class UserService {
  // 全てのユーザーを取得
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('ユーザーの取得に失敗しました', error);
      throw error;
    }
  }

  // 特定のユーザーを取得
  async getUserById(id: string): Promise<User> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のユーザーの取得に失敗しました`, error);
      throw error;
    }
  }

  // ユーザーを作成
  async createUser(data: CreateUserDto): Promise<User> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, data);
      return response.data;
    } catch (error) {
      console.error('ユーザーの作成に失敗しました', error);
      throw error;
    }
  }

  // ユーザーを更新
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のユーザーの更新に失敗しました`, error);
      throw error;
    }
  }

  // ユーザーを削除
  async deleteUser(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
    } catch (error) {
      console.error(`ID: ${id} のユーザーの削除に失敗しました`, error);
      throw error;
    }
  }

  // ユーザーのステータスを変更（有効/無効）
  async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/users/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のユーザーのステータス変更に失敗しました`, error);
      throw error;
    }
  }

  // 自分のプロフィールを取得
  async getMyProfile(): Promise<User> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/me`);
      return response.data;
    } catch (error) {
      console.error('プロフィールの取得に失敗しました', error);
      throw error;
    }
  }

  // 自分のパスワードを変更
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/users/change-password`, {
        oldPassword,
        newPassword
      });
    } catch (error) {
      console.error('パスワードの変更に失敗しました', error);
      throw error;
    }
  }
}

export default new UserService();
