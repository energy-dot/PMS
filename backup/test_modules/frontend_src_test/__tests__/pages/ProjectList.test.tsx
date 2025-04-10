/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectList from '../../pages/ProjectList';

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
              <td>{row.department}</td>
              <td>{row.period}</td>
              <td>{row.status}</td>
              <td>
                <button>詳細</button>
                <button>編集</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))
}));

describe('ProjectList Page', () => {
  beforeEach(() => {
    render(<ProjectList />);
  });

  test('renders project list title', () => {
    expect(screen.getByText('案件一覧')).toBeInTheDocument();
  });

  test('renders new project registration button', () => {
    expect(screen.getByText('新規案件登録')).toBeInTheDocument();
  });

  test('renders ag-grid with project data', () => {
    // AgGridがレンダリングされていることを確認
    expect(screen.getByTestId('mock-ag-grid')).toBeInTheDocument();
    
    // 正しい行数のデータが渡されていることを確認
    expect(screen.getByTestId('grid-row-count')).toHaveAttribute('data-count', '5');
    
    // 各案件の情報が表示されていることを確認
    expect(screen.getByText('Javaエンジニア募集')).toBeInTheDocument();
    expect(screen.getByText('インフラエンジニア')).toBeInTheDocument();
    expect(screen.getByText('フロントエンドエンジニア')).toBeInTheDocument();
    expect(screen.getByText('PMO支援')).toBeInTheDocument();
    expect(screen.getByText('テスト自動化エンジニア')).toBeInTheDocument();
  });

  test('displays projects with different departments', () => {
    expect(screen.getByText('開発1部')).toBeInTheDocument();
    expect(screen.getByText('基盤チーム')).toBeInTheDocument();
    expect(screen.getByText('開発2部')).toBeInTheDocument();
    expect(screen.getByText('PMO')).toBeInTheDocument();
    expect(screen.getByText('品質保証部')).toBeInTheDocument();
  });

  test('displays projects with different periods', () => {
    expect(screen.getByText('2025/05/01 - 2025/10/31')).toBeInTheDocument();
    expect(screen.getByText('2025/05/15 - 2025/11/30')).toBeInTheDocument();
    expect(screen.getByText('2025/06/01 - 2025/12/31')).toBeInTheDocument();
    expect(screen.getByText('2025/05/01 - 2026/03/31')).toBeInTheDocument();
    expect(screen.getByText('2025/06/15 - 2025/12/15')).toBeInTheDocument();
  });

  test('displays projects with different statuses', () => {
    expect(screen.getByText('募集中')).toBeInTheDocument();
    expect(screen.getByText('選考中')).toBeInTheDocument();
    expect(screen.getByText('承認待ち')).toBeInTheDocument();
    expect(screen.getByText('充足')).toBeInTheDocument();
    expect(screen.getByText('差し戻し')).toBeInTheDocument();
  });

  test('handles new project registration button click', () => {
    // 新規案件登録ボタンをクリック
    const newButton = screen.getByText('新規案件登録');
    fireEvent.click(newButton);
    
    // 注: 実際の新規案件登録機能はコンポーネント内で実装されていないため、
    // ここではボタンクリックのシミュレーションのみを行います
  });
});
