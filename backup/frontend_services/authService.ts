// services/authService.ts - モックデータから本番環境APIへの移行

import api, { callWithRetry, USE_MOCK_DATA } from './api';
import { User } from '../shared-types';
import { mockUsers, LoginCredentials, LoginResponse } from '../mocks/authMock';
import { handleApiError, logError } from '../utils/errorHandler';

/**
 * ユーザーログイン
 * @param credentials ログイン認証情報
 * @returns ログイン結果
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用
      // 管理者ユーザーの認証
      if (credentials.username === 'admin' && credentials.password === 'password') {
        const user = mockUsers.find(u => u.username === 'admin');
        return {
          user,
          accessToken: 'mock-jwt-token-admin'
        };
      }
      
      // 一般ユーザーの認証
      const user = mockUsers.find(u => 
        u.username === credentials.username && 
        u.isActive === true
      );
      
      if (user && credentials.password === 'password') {
        return {
          user,
          accessToken: `mock-jwt-token-${user.id}`
        };
      }
      
      throw new Error('認証に失敗しました。ユーザー名またはパスワードが正しくありません。');
    }
    
    // 本番環境APIを使用
    return await callWithRetry(() => api.post('/auth/login', credentials));
  } catch (error) {
    logError(error, 'login');
    throw handleApiError(error, 'ログインに失敗しました');
  }
};

/**
 * ユーザーログアウト
 */
export const logout = (): void => {
  try {
    // ローカルストレージからトークンを削除
    localStorage.removeItem('pms_auth_token');
    localStorage.removeItem('pms_user_data');
    
    if (!USE_MOCK_DATA) {
      // 本番環境では、サーバーサイドのセッションも無効化
      api.post('/auth/logout').catch(error => {
        console.warn('ログアウトAPI呼び出しに失敗しました', error);
      });
    }
  } catch (error) {
    logError(error, 'logout');
    console.error('ログアウト処理中にエラーが発生しました', error);
  }
};

/**
 * 現在のユーザー情報を取得する
 * @returns ユーザー情報
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // ローカルストレージからユーザーデータを取得
    const userData = localStorage.getItem('pms_user_data');
    if (userData) {
      return JSON.parse(userData);
    }
    
    if (USE_MOCK_DATA) {
      // モックデータを使用（デモ用に管理者ユーザーを返す）
      return mockUsers.find(u => u.username === 'admin') || null;
    }
    
    // 本番環境APIを使用
    const response = await callWithRetry(() => api.get('/auth/me'));
    return response;
  } catch (error) {
    logError(error, 'getCurrentUser');
    return null;
  }
};

/**
 * パスワードリセットリクエスト
 * @param email ユーザーのメールアドレス
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        throw new Error('指定されたメールアドレスのユーザーが見つかりません');
      }
      console.log(`Mock: Password reset requested for ${email}`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.post('/auth/password-reset-request', { email }));
  } catch (error) {
    logError(error, `requestPasswordReset(${email})`);
    throw handleApiError(error, 'パスワードリセットリクエストに失敗しました');
  }
};

/**
 * パスワードリセットの実行
 * @param token リセットトークン
 * @param newPassword 新しいパスワード
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
      // モックデータを使用（実際には何もしない）
      if (!token || token.length < 10) {
        throw new Error('無効なトークンです');
      }
      console.log(`Mock: Password reset with token ${token}`);
      return;
    }
    
    // 本番環境APIを使用
    await callWithRetry(() => api.post('/auth/password-reset', { token, newPassword }));
  } catch (error) {
    logError(error, 'resetPassword');
    throw handleApiError(error, 'パスワードリセットに失敗しました');
  }
};

// デフォルトエクスポート
const authService = {
  login,
  logout,
  getCurrentUser,
  requestPasswordReset,
  resetPassword
};

export default authService;
