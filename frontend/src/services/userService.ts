// services/userService.tsの修正 - APIのインポート方法を修正

import api from './api';
import { User } from '../shared-types';

// ユーザーデータの取得
export const getUsers = async (): Promise<User[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.get('/users');
    // return response.data;

    // デモ用のモックデータ
    return [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        name: '管理者',
        role: 'admin',
        department: '管理部',
        position: 'マネージャー',
        isActive: true,
      },
      {
        id: '2',
        username: 'user1',
        email: 'user1@example.com',
        name: '一般ユーザー1',
        role: 'developer',
        department: '営業部',
        position: '担当者',
        isActive: true,
      },
      {
        id: '3',
        username: 'user2',
        email: 'user2@example.com',
        name: '一般ユーザー2',
        role: 'developer',
        department: '技術部',
        position: 'エンジニア',
        isActive: true,
      },
    ];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

// ユーザーデータの取得（ID指定）
export const getUserById = async (id: string): Promise<User> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.get(`/users/${id}`);
    // return response.data;

    // デモ用のモックデータ
    const users = await getUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    return user;
  } catch (error) {
    console.error(`Failed to fetch user with ID ${id}:`, error);
    throw error;
  }
};

// ユーザーデータの作成
export const createUser = async (data: Omit<User, 'id'>): Promise<User> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.post('/users', data);
    // return response.data;

    // デモ用のモックデータ
    const newId = Math.floor(Math.random() * 1000).toString();
    const newUser: User = {
      id: newId,
      ...data,
    };

    return newUser;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

// ユーザーデータの更新
export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.put(`/users/${id}`, data);
    // return response.data;

    // デモ用のモックデータ
    const user = await getUserById(id);
    const updatedUser: User = {
      ...user,
      ...data,
    };

    return updatedUser;
  } catch (error) {
    console.error(`Failed to update user with ID ${id}:`, error);
    throw error;
  }
};

// ユーザーデータの削除
export const deleteUser = async (id: string): Promise<void> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // await api.delete(`/users/${id}`);

    // デモ用のモックデータ
    // 実際には何もしない
    console.log(`User with ID ${id} deleted`);
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error);
    throw error;
  }
};

// デフォルトエクスポートを追加
const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

export default userService;
