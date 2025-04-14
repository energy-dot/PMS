import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../../frontend/src/store/authStore';

// モックコンポーネント
const TestAuthComponent = () => {
  const { login, logout, isAuthenticated, user } = useAuth();
  
  const handleLogin = () => {
    login({ username: 'admin', password: 'admin123' });
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'ログイン済み' : '未ログイン'}
      </div>
      {user && <div data-testid="user-info">{user.username}</div>}
      <button data-testid="login-button" onClick={handleLogin}>ログイン</button>
      <button data-testid="logout-button" onClick={handleLogout}>ログアウト</button>
    </div>
  );
};

// モックAPI
global.fetch = jest.fn((url) => {
  if (url.includes('/api/auth/login')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        user: { id: '1', username: 'admin', role: 'admin' },
        token: 'mock-token'
      })
    });
  }
  return Promise.reject(new Error('API not mocked'));
});

describe('認証機能のテスト', () => {
  beforeEach(() => {
    // localStorageのモックをクリア
    window.localStorage.clear();
    jest.clearAllMocks();
  });
  
  test('AUTH-001: 初期状態では未ログイン状態であること', () => {
    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('未ログイン');
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
  });
  
  test('AUTH-002: ログイン処理が正常に動作すること', async () => {
    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );
    
    // ログインボタンをクリック
    fireEvent.click(screen.getByTestId('login-button'));
    
    // 非同期処理の完了を待つ
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('ログイン済み');
    });
    
    // ユーザー情報が表示されていることを確認
    expect(screen.getByTestId('user-info')).toHaveTextContent('admin');
    
    // localStorageにトークンが保存されていることを確認
    expect(window.localStorage.setItem).toHaveBeenCalledWith('pms_auth_token', 'mock-token');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('pms_user_data', JSON.stringify({ id: '1', username: 'admin', role: 'admin' }));
  });
  
  test('AUTH-003: ログアウト処理が正常に動作すること', async () => {
    // 初期状態でログイン済みにする
    window.localStorage.setItem('pms_auth_token', 'mock-token');
    window.localStorage.setItem('pms_user_data', JSON.stringify({ id: '1', username: 'admin', role: 'admin' }));
    
    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );
    
    // 初期状態がログイン済みであることを確認
    expect(screen.getByTestId('auth-status')).toHaveTextContent('ログイン済み');
    expect(screen.getByTestId('user-info')).toHaveTextContent('admin');
    
    // ログアウトボタンをクリック
    fireEvent.click(screen.getByTestId('logout-button'));
    
    // 非同期処理の完了を待つ
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('未ログイン');
    });
    
    // ユーザー情報が表示されていないことを確認
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    
    // localStorageからトークンが削除されていることを確認
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('pms_auth_token');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('pms_user_data');
  });
  
  test('AUTH-004: ストレージアクセスエラーが適切に処理されること', async () => {
    // localStorageのgetItemメソッドでエラーをスローするようにモック
    window.localStorage.getItem.mockImplementationOnce(() => {
      throw new Error('Storage access denied');
    });
    
    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );
    
    // エラーが発生してもコンポーネントがレンダリングされること
    expect(screen.getByTestId('auth-status')).toBeInTheDocument();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('未ログイン');
    
    // コンソールエラーが出力されていることを確認
    expect(console.error).toHaveBeenCalled();
  });
});
