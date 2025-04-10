import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PartnerDetail from '../../../../components/partners/PartnerDetail';

// 依存コンポーネントのモック
jest.mock('../../../../components/partners/AntisocialCheckList', () => () => <div data-testid="mock-antisocial-check-list">AntisocialCheckList Component</div>);
jest.mock('../../../../components/partners/BaseContractList', () => () => <div data-testid="mock-base-contract-list">BaseContractList Component</div>);
jest.mock('../../../../components/partners/ContactPersonList', () => () => <div data-testid="mock-contact-person-list">ContactPersonList Component</div>);

// Material-UIのモック
jest.mock('@mui/material', () => ({
  Button: ({ children, component, to, variant, color, onClick }) => (
    <button 
      data-testid={`mui-button-${children.toString().toLowerCase().replace(/\s+/g, '-')}`}
      data-to={to}
      data-variant={variant}
      data-color={color}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  Box: ({ children, sx }) => (
    <div data-testid="mui-box" data-sx={JSON.stringify(sx)}>
      {children}
    </div>
  )
}));

// React Routerのモック
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => (
    <a href={to} data-testid={`router-link-${to}`}>
      {children}
    </a>
  ),
  Routes: ({ children }) => <div data-testid="router-routes">{children}</div>,
  Route: ({ path, element }) => <div data-testid={`router-route-${path}`}>{element}</div>
}));

describe('PartnerDetail Component', () => {
  // テスト用のパートナーデータ
  const mockPartner = {
    id: '123',
    name: 'テスト株式会社',
    status: '取引中'
  };

  // 基本的なレンダリングテスト
  test('renders partner detail component', () => {
    render(
      <BrowserRouter>
        <PartnerDetail partner={mockPartner} onUpdate={() => {}} />
      </BrowserRouter>
    );
    
    // コンポーネントが表示されていることを確認
    expect(screen.getByTestId('mui-box')).toBeInTheDocument();
  });

  // ナビゲーションボタンのテスト
  test('renders navigation buttons', () => {
    render(
      <BrowserRouter>
        <PartnerDetail partner={mockPartner} onUpdate={() => {}} />
      </BrowserRouter>
    );
    
    // 各ナビゲーションボタンが表示されていることを確認
    expect(screen.getByTestId('mui-button-反社チェック管理')).toBeInTheDocument();
    expect(screen.getByTestId('mui-button-基本契約管理')).toBeInTheDocument();
    expect(screen.getByTestId('mui-button-営業窓口管理')).toBeInTheDocument();
  });

  // ボタンのリンク先テスト
  test('buttons have correct link paths', () => {
    render(
      <BrowserRouter>
        <PartnerDetail partner={mockPartner} onUpdate={() => {}} />
      </BrowserRouter>
    );
    
    // 各ボタンが正しいリンク先を持っていることを確認
    expect(screen.getByTestId('mui-button-反社チェック管理')).toHaveAttribute('data-to', '/partners/123/antisocial-checks');
    expect(screen.getByTestId('mui-button-基本契約管理')).toHaveAttribute('data-to', '/partners/123/base-contracts');
    expect(screen.getByTestId('mui-button-営業窓口管理')).toHaveAttribute('data-to', '/partners/123/contact-persons');
  });

  // ボタンのスタイルテスト
  test('buttons have correct styling', () => {
    render(
      <BrowserRouter>
        <PartnerDetail partner={mockPartner} onUpdate={() => {}} />
      </BrowserRouter>
    );
    
    // 各ボタンが正しいスタイルを持っていることを確認
    const buttons = [
      screen.getByTestId('mui-button-反社チェック管理'),
      screen.getByTestId('mui-button-基本契約管理'),
      screen.getByTestId('mui-button-営業窓口管理')
    ];
    
    buttons.forEach(button => {
      expect(button).toHaveAttribute('data-variant', 'contained');
      expect(button).toHaveAttribute('data-color', 'primary');
    });
  });

  // ルーティング設定のテスト
  test('renders routes for sub-components', () => {
    render(
      <BrowserRouter>
        <PartnerDetail partner={mockPartner} onUpdate={() => {}} />
      </BrowserRouter>
    );
    
    // Routesコンポーネントが表示されていることを確認
    expect(screen.getByTestId('router-routes')).toBeInTheDocument();
    
    // 各サブコンポーネントへのルートが設定されていることを確認
    expect(screen.getByTestId('router-route-antisocial-checks')).toBeInTheDocument();
    expect(screen.getByTestId('router-route-base-contracts')).toBeInTheDocument();
    expect(screen.getByTestId('router-route-contact-persons')).toBeInTheDocument();
  });

  // レイアウトのテスト
  test('has correct layout structure', () => {
    render(
      <BrowserRouter>
        <PartnerDetail partner={mockPartner} onUpdate={() => {}} />
      </BrowserRouter>
    );
    
    // 外側のBoxが正しいマージンを持っていることを確認
    const outerBox = screen.getAllByTestId('mui-box')[0];
    expect(outerBox).toHaveAttribute('data-sx', JSON.stringify({ mt: 2 }));
    
    // ボタンコンテナが正しいスタイルを持っていることを確認
    const buttonContainer = screen.getAllByTestId('mui-box')[1];
    expect(buttonContainer).toHaveAttribute('data-sx', JSON.stringify({ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      gap: 2, 
      mb: 2 
    }));
  });
});
