/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StaffList from '../../pages/StaffList';

// TextEncoderとTextDecoderのポリフィル
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// AgGridReactのモック
jest.mock('ag-grid-react', () => ({
  AgGridReact: jest.fn().mockImplementation(({ rowData }) => (
    <div data-testid="mock-ag-grid">
      <div data-testid="grid-row-count" data-count={rowData?.length || 0}></div>
      <table>
        <tbody>
          {rowData?.map((row, index) => (
            <tr key={index} data-testid={`grid-row-${index}`}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.company}</td>
              <td>{row.skills}</td>
              <td>{row.status}</td>
              <td>
                <button>詳細</button>
                <button>評価</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))
}));

describe('StaffList Page', () => {
  beforeEach(() => {
    render(<StaffList />);
  });

  test('renders staff list title', () => {
    expect(screen.getByText('要員一覧')).toBeInTheDocument();
  });

  test('renders new staff registration button', () => {
    expect(screen.getByText('新規要員登録')).toBeInTheDocument();
  });

  test('renders ag-grid with staff data', () => {
    // AgGridがレンダリングされていることを確認
    expect(screen.getByTestId('mock-ag-grid')).toBeInTheDocument();
    
    // 正しい行数のデータが渡されていることを確認
    expect(screen.getByTestId('grid-row-count')).toHaveAttribute('data-count', '5');
    
    // 各要員の情報が表示されていることを確認
    expect(screen.getByText('山田 太郎')).toBeInTheDocument();
    expect(screen.getByText('佐藤 次郎')).toBeInTheDocument();
    expect(screen.getByText('鈴木 三郎')).toBeInTheDocument();
    expect(screen.getByText('田中 四郎')).toBeInTheDocument();
    expect(screen.getByText('高橋 五郎')).toBeInTheDocument();
  });

  test('displays staff with different companies', () => {
    expect(screen.getByText('株式会社テクノソリューション')).toBeInTheDocument();
    expect(screen.getByText('デジタルイノベーション株式会社')).toBeInTheDocument();
    expect(screen.getByText('株式会社ITプロフェッショナル')).toBeInTheDocument();
    expect(screen.getByText('サイバーテック株式会社')).toBeInTheDocument();
    expect(screen.getByText('株式会社システムクリエイト')).toBeInTheDocument();
  });

  test('displays staff with different skills', () => {
    expect(screen.getByText('Java, Spring, AWS')).toBeInTheDocument();
    expect(screen.getByText('Python, Django, Docker')).toBeInTheDocument();
    expect(screen.getByText('JavaScript, React, TypeScript')).toBeInTheDocument();
    expect(screen.getByText('C#, .NET, Azure')).toBeInTheDocument();
    expect(screen.getByText('PHP, Laravel, MySQL')).toBeInTheDocument();
  });

  test('displays staff with different statuses', () => {
    // 「稼働中」ステータスの要員が存在することを確認
    expect(screen.getAllByText('稼働中').length).toBeGreaterThan(0);
    
    // 「待機中」ステータスの要員が存在することを確認
    expect(screen.getByText('待機中')).toBeInTheDocument();
    
    // 「契約終了」ステータスの要員が存在することを確認
    expect(screen.getByText('契約終了')).toBeInTheDocument();
  });

  test('handles new staff registration button click', () => {
    // 新規要員登録ボタンをクリック
    const newButton = screen.getByText('新規要員登録');
    fireEvent.click(newButton);
    
    // 注: 実際の新規要員登録機能はコンポーネント内で実装されていないため、
    // ここではボタンクリックのシミュレーションのみを行います
  });
});
