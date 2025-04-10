import api, { safeStorage } from './api';
import { User } from '../store/authStore';

// ログイン情報の型定義
interface LoginCredentials {
  username: string;
  password: string;
}

// ログインレスポンスの型定義
interface LoginResponse {
  accessToken: string;
  user: User;
}

const authService = {
  /**
   * ログイン処理
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // 入力値の検証
      if (!credentials.username || !credentials.password) {
        throw new Error('ユーザー名とパスワードは必須です');
      }
      
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      // レスポンスの検証
      if (!response.data || !response.data.accessToken || !response.data.user) {
        throw new Error('サーバーからの応答が無効です');
      }
      
      // トークンとユーザー情報をストレージに保存
      safeStorage.setItem('token', response.data.accessToken);
      safeStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      // エラーメッセージの整形
      let errorMessage = 'ログイン処理中にエラーが発生しました';
      
      if (error.isNetworkError) {
        errorMessage = error.friendlyMessage || 'ネットワークエラー: サーバーに接続できません。';
      } else if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'ユーザー名またはパスワードが正しくありません';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `サーバーエラー: ${error.response.status}`;
        }
      } else if (error.message && error.message.includes('timeout')) {
        errorMessage = 'サーバーへの接続がタイムアウトしました。再度お試しください。';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // カスタムエラーオブジェクトを作成
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).isAuthError = true;
      (enhancedError as any).isNetworkError = error.isNetworkError || false;
      
      throw enhancedError;
    }
  },

  /**
   * ログアウト処理
   */
  logout(): void {
    safeStorage.removeItem('token');
    safeStorage.removeItem('user');
  },

  /**
   * ユーザープロフィール取得
   */
  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * 認証状態の取得
   */
  isAuthenticated(): boolean {
    return !!safeStorage.getItem('token');
  },
  
  /**
   * ユーザー情報の取得
   */
  getUser(): User | null {
    const userData = safeStorage.getItem('user');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      return null;
    }
  }
};

export default authService;