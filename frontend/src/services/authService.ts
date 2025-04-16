import api, { callWithRetry } from './api';
import { User } from '../shared-types';

/**
 * 認証サービス
 */
interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
}

/**
 * ユーザーログイン
 * @param credentials ログイン認証情報
 * @returns ログイン結果
 */
const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // return await callWithRetry(() => api.post<LoginResponse>('/auth/login', credentials));

    // デモ用のモックレスポンス
    if (credentials.username === 'admin' && credentials.password === 'password') {
      return {
        user: {
          id: 'user-1',
          username: 'admin',
          fullName: '管理者ユーザー',
          email: 'admin@example.com',
          role: 'admin',
          isActive: true,
        },
        accessToken: 'mock-jwt-token',
      };
    } else {
      throw new Error('認証に失敗しました。ユーザー名またはパスワードが正しくありません。');
    }
  } catch (error) {
    console.error('ログインに失敗しました', error);
    throw error;
  }
};

/**
 * ユーザーログアウト
 */
const logout = (): void => {
  // ローカルストレージからトークンを削除
  localStorage.removeItem('pms_auth_token');
  localStorage.removeItem('pms_user_data');
};

/**
 * 認証サービスのエクスポート
 */
const authService = {
  login,
  logout,
};

export default authService;
