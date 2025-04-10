import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../../pages/Login';
import { useAuthStore } from '../../../store/authStore';

// モックの作成
jest.mock('../../../store/authStore', () => ({
  useAuthStore: jest.fn()
}));

describe('Login Integration Test', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    // authStoreのモック実装
    const mockLogin = jest.fn().mockImplementation((username, password) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (username === 'admin' && password === 'password') {
            resolve();
          } else {
            mockAuthStore.error = 'ユーザー名またはパスワードが正しくありません';
          }
        }, 100);
      });
    });

    const mockClearError = jest.fn().mockImplementation(() => {
      mockAuthStore.error = null;
    });

    const mockAuthStore = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: mockLogin,
      logout: jest.fn(),
      clearError: mockClearError
    };

    (useAuthStore as jest.Mock).mockReturnValue(mockAuthStore);
  });

  test('renders login form correctly', () => {
    render(<Login />);
    
    // ページタイトルの確認
    expect(screen.getByText('パートナー要員管理システム')).toBeInTheDocument();
    expect(screen.getByText('アカウント情報でログインしてください')).toBeInTheDocument();
    
    // フォーム要素の確認 - h2要素を明示的に指定
    expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument();
    expect(screen.getByLabelText('ユーザー名')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(<Login />);
    
    // 空のフォームを送信
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // バリデーションエラーの確認
    await waitFor(() => {
      expect(screen.getByText('ユーザー名は必須です')).toBeInTheDocument();
      expect(screen.getByText('パスワードは必須です')).toBeInTheDocument();
    });
  });

  test('calls login function with form data', async () => {
    render(<Login />);
    
    // フォームに入力
    fireEvent.change(screen.getByLabelText('ユーザー名'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'password' } });
    
    // フォームを送信
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // ログイン関数が呼ばれたことを確認
    await waitFor(() => {
      expect(useAuthStore().login).toHaveBeenCalledWith('admin', 'password');
    });
  });

  test('shows error message on login failure', async () => {
    // エラーメッセージを持つモックに変更
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      error: 'ユーザー名またはパスワードが正しくありません',
      clearError: jest.fn()
    });
    
    render(<Login />);
    
    // エラーメッセージの確認
    expect(screen.getByText('ユーザー名またはパスワードが正しくありません')).toBeInTheDocument();
    
    // エラーメッセージの閉じるボタンをクリック
    fireEvent.click(screen.getByText('×'));
    
    // clearError関数が呼ばれたことを確認
    expect(useAuthStore().clearError).toHaveBeenCalled();
  });

  test('shows loading state during login', async () => {
    // ローディング状態のモックに変更
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      isLoading: true
    });
    
    render(<Login />);
    
    // ローディングメッセージの確認
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });
});
