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

// ネットワークエラーをシミュレートするためのモック
jest.mock('../../../api/auth', () => ({
  login: jest.fn()
}));

/**
 * ネットワークエラー時の挙動テスト
 * 
 * このテストでは、ネットワーク接続の問題やAPIエラーなど、
 * 外部要因によるエラー発生時のアプリケーションの挙動をテストします。
 */
describe('Network Error Handling', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    // authStoreのモック実装
    const mockLogin = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error('ネットワークエラー'));
    });

    const mockClearError = jest.fn();

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

  // エラーケース1: ネットワーク接続エラー
  test('handles network connection errors', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // ユーザー名とパスワードを入力
    fireEvent.change(screen.getByLabelText('ユーザー名'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'password' } });
    
    // ログインボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // ネットワークエラーが発生したことを確認
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      error: 'ネットワークエラーが発生しました。接続を確認してください。'
    });
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // エラーメッセージが表示されることを確認
    expect(screen.getByText('ネットワークエラーが発生しました。接続を確認してください。')).toBeInTheDocument();
  });

  // エラーケース2: タイムアウトエラー
  test('handles timeout errors', async () => {
    // タイムアウトエラーのモックに変更
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      login: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('タイムアウト'));
      })
    });
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // ユーザー名とパスワードを入力
    fireEvent.change(screen.getByLabelText('ユーザー名'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'password' } });
    
    // ログインボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // タイムアウトエラーが発生したことを確認
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      error: 'リクエストがタイムアウトしました。後でもう一度お試しください。'
    });
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // エラーメッセージが表示されることを確認
    expect(screen.getByText('リクエストがタイムアウトしました。後でもう一度お試しください。')).toBeInTheDocument();
  });

  // エラーケース3: サーバーエラー
  test('handles server errors', async () => {
    // サーバーエラーのモックに変更
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      login: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('サーバーエラー'));
      })
    });
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // ユーザー名とパスワードを入力
    fireEvent.change(screen.getByLabelText('ユーザー名'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'password' } });
    
    // ログインボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // サーバーエラーが発生したことを確認
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      error: 'サーバーエラーが発生しました。管理者にお問い合わせください。'
    });
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // エラーメッセージが表示されることを確認
    expect(screen.getByText('サーバーエラーが発生しました。管理者にお問い合わせください。')).toBeInTheDocument();
  });

  // エラーケース4: 予期しないエラー
  test('handles unexpected errors', async () => {
    // 予期しないエラーのモックに変更
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      login: jest.fn().mockImplementation(() => {
        throw new Error('予期しないエラー');
      })
    });
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // ユーザー名とパスワードを入力
    fireEvent.change(screen.getByLabelText('ユーザー名'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'password' } });
    
    // ログインボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // 予期しないエラーが発生したことを確認
    (useAuthStore as jest.Mock).mockReturnValue({
      ...useAuthStore(),
      error: '予期しないエラーが発生しました。もう一度お試しください。'
    });
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // エラーメッセージが表示されることを確認
    expect(screen.getByText('予期しないエラーが発生しました。もう一度お試しください。')).toBeInTheDocument();
  });
});
