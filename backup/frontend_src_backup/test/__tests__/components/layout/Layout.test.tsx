import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Outlet } from 'react-router-dom';
import Layout from '../../../../components/layout/Layout';

// 依存コンポーネントのモック
jest.mock('../../../../components/layout/Header', () => () => <div data-testid="mock-header">Header Component</div>);
jest.mock('../../../../components/layout/Sidebar', () => () => <div data-testid="mock-sidebar">Sidebar Component</div>);

// React Router のモック
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="mock-outlet">Main Content</div>
}));

describe('Layout Component', () => {
  // 基本的なレンダリングテスト
  test('renders layout with header, sidebar and main content', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    
    // レイアウトコンテナが表示されていることを確認
    const layoutContainer = screen.getByText('Header Component').closest('div');
    expect(layoutContainer).toHaveClass('app-container');
    
    // ヘッダーが表示されていることを確認
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    
    // サイドバーが表示されていることを確認
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    
    // メインコンテンツ領域が表示されていることを確認
    expect(screen.getByTestId('mock-outlet')).toBeInTheDocument();
  });

  // 構造のテスト
  test('has correct structure with flex layout', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    
    // サイドバーとメインコンテンツが flex コンテナ内にあることを確認
    const flexContainer = screen.getByTestId('mock-sidebar').closest('div');
    expect(flexContainer).toHaveClass('flex');
    
    // メインコンテンツが正しいクラスを持っていることを確認
    const mainContent = screen.getByTestId('mock-outlet').closest('main');
    expect(mainContent).toHaveClass('main-content');
  });

  // コンポーネントの階層構造テスト
  test('renders components in correct hierarchy', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    
    // アプリコンテナ > ヘッダー + フレックスコンテナ > サイドバー + メインコンテンツ の階層構造を確認
    const appContainer = screen.getByText('Header Component').closest('div');
    
    // ヘッダーがアプリコンテナの直接の子であることを確認
    expect(appContainer.children[0]).toBe(screen.getByTestId('mock-header'));
    
    // フレックスコンテナがアプリコンテナの子であることを確認
    const flexContainer = screen.getByTestId('mock-sidebar').closest('div');
    expect(appContainer.children[1]).toBe(flexContainer);
    
    // サイドバーがフレックスコンテナの子であることを確認
    expect(flexContainer.children[0]).toBe(screen.getByTestId('mock-sidebar'));
    
    // メインコンテンツがフレックスコンテナの子であることを確認
    const mainContent = screen.getByTestId('mock-outlet').closest('main');
    expect(flexContainer.children[1]).toBe(mainContent);
  });

  // メインコンテンツ領域のテスト
  test('main content area contains outlet', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    
    // メインコンテンツ領域にOutletが含まれていることを確認
    const mainContent = screen.getByTestId('mock-outlet').closest('main');
    expect(mainContent).toContainElement(screen.getByTestId('mock-outlet'));
  });
});
