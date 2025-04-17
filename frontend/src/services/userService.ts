// services/userService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { User } from '../shared-types';
import { mockUsers } from '../mocks/userMock';
import { handleApiError, logError } from '../utils/errorHandler';

// ユーザーデータの取得
export const getUsers = async (): Promise<User[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockUsers;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/users'));
  } catch (error) {
    logError(error, 'getUsers');
    throw handleApiError(error, 'ユーザー情報の取得に失敗しました');
  }
};

// ユーザーデータの取得（ID指定）
export const getUserById = async (id: string): Promise<User> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get(`/users/${id}`));
  } catch (error) {
    logError(error, `getUserById(${id})`);
    throw handleApiError(error, `ユーザー情報(ID: ${id})の取得に失敗しました`);
  }
};

// ユーザーデータの作成
export const createUser = async (data: Omit<User, 'id'>): Promise<User> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const newId = Math.floor(Math.random() * 1000).toString();
      const newUser: User = {
        id: newId,
        ...data,
      };
      return newUser;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/users', data));
  } catch (error) {
    logError(error, 'createUser');
    throw handleApiError(error, 'ユーザーの作成に失敗しました');
  }
};

// ユーザーデータの更新
export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      const updatedUser: User = {
        ...user,
        ...data,
      };
      return updatedUser;
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.patch(`/users/${id}`, data));
  } catch (error) {
    logError(error, `updateUser(${id})`);
    throw handleApiError(error, `ユーザー情報(ID: ${id})の更新に失敗しました`);
  }
};

// ユーザーデータの削除
export const deleteUser = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      console.log(`Mock: User with ID ${id} deleted`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.delete(`/users/${id}`));
  } catch (error) {
    logError(error, `deleteUser(${id})`);
    throw handleApiError(error, `ユーザー(ID: ${id})の削除に失敗しました`);
  }
};

// ユーザー検索
export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      return mockUsers.filter(user => 
        user.name.includes(query) || 
        user.username.includes(query) || 
        user.email.includes(query) ||
        user.department.includes(query)
      );
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.get('/users/search', { params: { query } }));
  } catch (error) {
    logError(error, `searchUsers(${query})`);
    throw handleApiError(error, 'ユーザー検索に失敗しました');
  }
};

// ユーザー認証
export const authenticateUser = async (username: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      const user = mockUsers.find(u => u.username === username);
      if (!user || password !== 'password') { // モック環境では全てのユーザーのパスワードは 'password'
        throw new Error('Invalid credentials');
      }
      
      return {
        user,
        token: 'mock-jwt-token'
      };
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/auth/login', { username, password }));
  } catch (error) {
    logError(error, 'authenticateUser');
    throw handleApiError(error, '認証に失敗しました。ユーザー名とパスワードを確認してください');
  }
};

// デフォルトエクスポート
const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  authenticateUser
};

export default userService;
