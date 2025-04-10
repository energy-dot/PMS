import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, NavLink } from 'react-router-dom';
import Sidebar from '../../../../components/layout/Sidebar';

// React Router のモック
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  NavLink: ({ children, to, className }) => {
    // isActiveがtrueの場合のクラス名を生成
    const activeClass = typeof className === 'function' 
      ? className({ isActive: to === '/' }) 
      : className;
    
    return (
      <a 
        href={to} 
        className={activeClass}
        data-testid={`navlink-${to.replace('/', '')}`}
      >
        {children}
      </a>
    );
  }
}));

describe('Sidebar Component', () => {
  // 基本的なレンダリングテスト
  test('renders sidebar with navigation menu', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    // サイドバーが表示されていることを確認
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveClass('bg-white');
    expect(sidebar).toHaveClass('shadow-sm');
  });

  // メニュー項目のテスト
  test('renders all menu items', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    // すべてのメニュー項目が表示されていることを確認
    const menuItems = [
      'ダッシュボード',
      'パートナー会社',
      '案件管理',
      '応募管理',
      '要員管理',
      '契約管理',
      '依頼・連絡',
      '要員評価',
      'レポート',
      'マスターデータ'
    ];
    
    menuItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  // メニュー項目のリンクテスト
  test('menu items have correct links', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    // 各メニュー項目が正しいリンク先を持っていることを確認
    const menuItemPaths = {
      'ダッシュボード': '/',
      'パートナー会社': '/partners',
      '案件管理': '/projects',
      '応募管理': '/applications',
      '要員管理': '/staff',
      '契約管理': '/contracts',
      '依頼・連絡': '/requests',
      '要員評価': '/evaluations',
      'レポート': '/reports',
      'マスターデータ': '/master'
    };
    
    Object.entries(menuItemPaths).forEach(([label, path]) => {
      const linkElement = screen.getByText(label);
      expect(linkElement.closest('a')).toHaveAttribute('href', path);
    });
  });

  // アクティブ状態のスタイルテスト
  test('active menu item has correct styling', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    // ダッシュボードがアクティブな状態（モックで設定）であることを確認
    const dashboardLink = screen.getByTestId('navlink-');
    expect(dashboardLink).toHaveClass('bg-primary-color');
    expect(dashboardLink).toHaveClass('text-white');
  });

  // 非アクティブ状態のスタイルテスト
  test('inactive menu items have correct styling', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    // パートナー会社が非アクティブな状態であることを確認
    const partnersLink = screen.getByTestId('navlink-partners');
    expect(partnersLink).toHaveClass('hover:bg-gray-100');
    expect(partnersLink).not.toHaveClass('bg-primary-color');
    expect(partnersLink).not.toHaveClass('text-white');
  });

  // メニュー項目の数のテスト
  test('renders correct number of menu items', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    // メニュー項目の数が正しいことを確認
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(10);
  });

  // ナビゲーションのアクセシビリティテスト
  test('navigation is accessible', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    // ナビゲーション要素が存在することを確認
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });
});
