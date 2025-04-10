import { render, screen } from '@testing-library/react';
import App from '../App';

// モックの作成
jest.mock('../components/layout/Header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('../components/layout/Sidebar', () => () => <div data-testid="mock-sidebar">Sidebar</div>);
jest.mock('../pages/Dashboard', () => () => <div data-testid="mock-dashboard">Dashboard</div>);

describe('App', () => {
  test('renders main application components', () => {
    render(<App />);
    
    // ヘッダー、サイドバー、ダッシュボードコンポーネントがレンダリングされていることを確認
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument();
  });
});
