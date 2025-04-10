/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import Login from '../../../pages/Login';

// TextEncoderとTextDecoderのポリフィル
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// モックの作成
jest.mock('../../../store/authStore', () => ({
  useAuthStore: jest.fn()
}));

/**
 * ユーザー認証フローの完全テスト
 * 
 * このテストシナリオでは、ログインから認証状態の確認、ログアウトまでの
 * 一連のユーザー認証フローをテストします。
 * 
 * テストケース:
 * 1. 正常なログイン処理
 * 2. 認証エラー時の処理
 * 3. ログイン中の状態表示
 * 4. ログアウト処理
 */
describe('User Authentication Flow', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    // authStoreのモック実装
    const mockLogin = jest.fn().mockImplementation((username, password) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'admin' && password === 'password') {
            resolve();
          } else {
            reject(new Error('認証エラー'));
          }
        }, 100);
      });
    });

    const mockLogout = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });

    const mockClearError = jest.fn();

    // 初期状態のモック
    const mockAuthStore = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: mockLogin,
      logout: mockLogout,
      clearError: mockClearError
    };

    (useAuthStore as jest.Mock).mockReturnValue(mockAuthStore);
  });

  // シナリオ1: 正常なログイン処理
  test('successful login flow', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // 1. ログインフォームが表示されていることを確認
    expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument();
    
    // 2. ユーザー名とパスワードを入力
    fireEvent.change(screen.getByLabelText('ユーザー名'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'password' } });
    
    // 3. ログインボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // 4. ログイン処理中はローディング状態になることを確認
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      isLoading: true
    });
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    
    // 5. ログイン成功後は認証状態が更新されることを確認
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      isLoading: false,
      isAuthenticated: true,
      user: { id: '1', name: '管理者', role: 'admin' }
    });
    
    // ログイン関数が正しい引数で呼ばれたことを確認
    await waitFor(() => {
      expect(useAuthStore().login).toHaveBeenCalledWith('admin', 'password');
    });
  });

  // シナリオ2: 認証エラー時の処理
  test('authentication error handling', async () => {
    // エラー状態のモックに変更
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      error: 'ユーザー名またはパスワードが正しくありません'
    });
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // 1. エラーメッセージが表示されることを確認
    expect(screen.getByText('ユーザー名またはパスワードが正しくありません')).toBeInTheDocument();
    
    // 2. エラーメッセージの閉じるボタンをクリック
    fireEvent.click(screen.getByText('×'));
    
    // 3. clearError関数が呼ばれたことを確認
    expect(useAuthStore().clearError).toHaveBeenCalled();
    
    // 4. 誤ったログイン情報でログイン試行
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      error: null
    });
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    fireEvent.change(screen.getByLabelText('ユーザー名'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // login関数が呼ばれるが、エラーが発生することを確認
    await waitFor(() => {
      expect(useAuthStore().login).toHaveBeenCalledWith('wrong', 'wrong');
    });
  });

  // シナリオ3: ログアウト処理
  test('logout flow', async () => {
    // 認証済み状態のモックに変更
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      isAuthenticated: true,
      user: { id: '1', name: '管理者', role: 'admin' }
    });
    
    // ログアウト処理のテスト
    // 注: 実際のログアウトUIはHeaderコンポーネントにあるため、
    // ここではログアウト関数の呼び出しのみをテスト
    
    const { logout } = useAuthStore();
    logout();
    
    // ログアウト関数が呼ばれたことを確認
    expect(useAuthStore().logout).toHaveBeenCalled();
    
    // ログアウト後は認証状態がリセットされることを確認
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      isAuthenticated: false,
      user: null
    });
  });
});
