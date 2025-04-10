/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/layout/Header';

// TextEncoderとTextDecoderのポリフィル
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// モックの作成
jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn().mockReturnValue({
    isAuthenticated: true,
    user: { name: 'テストユーザー', role: 'admin' },
    logout: jest.fn()
  })
}));

describe('Header Component', () => {
  test('renders logo and navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // ロゴが表示されていることを確認
    expect(screen.getByAltText('PMS Logo')).toBeInTheDocument();
    
    // ナビゲーションリンクが表示されていることを確認
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
    expect(screen.getByText('パートナー')).toBeInTheDocument();
    expect(screen.getByText('プロジェクト')).toBeInTheDocument();
  });

  test('displays user name when authenticated', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // ユーザー名が表示されていることを確認
    expect(screen.getByText('テストユーザー')).toBeInTheDocument();
  });

  test('handles logout when logout button is clicked', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // ログアウトボタンをクリック
    fireEvent.click(screen.getByText('ログアウト'));
    
    // ログアウト関数が呼ばれたことを確認
    const { logout } = require('../../store/authStore').useAuthStore();
    expect(logout).toHaveBeenCalled();
  });

  test('toggles mobile menu when hamburger button is clicked', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // ハンバーガーメニューボタンをクリック
    const menuButton = screen.getByLabelText('メニュー');
    fireEvent.click(menuButton);
    
    // モバイルメニューが表示されることを確認
    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(mobileMenu).toHaveClass('block');
    
    // もう一度クリックするとメニューが閉じることを確認
    fireEvent.click(menuButton);
    expect(mobileMenu).toHaveClass('hidden');
  });

  test('displays admin panel link for admin users', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // 管理者パネルリンクが表示されていることを確認
    expect(screen.getByText('管理者パネル')).toBeInTheDocument();
  });

  test('does not display admin panel link for non-admin users', () => {
    // 非管理者ユーザーのモックに変更
    jest.mock('../../store/authStore', () => ({
      useAuthStore: jest.fn().mockReturnValue({
        isAuthenticated: true,
        user: { name: 'テストユーザー', role: 'user' },
        logout: jest.fn()
      })
    }), { virtual: true });
    
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // 管理者パネルリンクが表示されていないことを確認
    expect(screen.queryByText('管理者パネル')).not.toBeInTheDocument();
  });
});
