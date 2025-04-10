/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContractList from '../../pages/ContractList';

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
              <td>{row.staffName}</td>
              <td>{row.company}</td>
              <td>{row.project}</td>
              <td>{row.period}</td>
              <td>{row.price}</td>
              <td>{row.status}</td>
              <td>
                <button>詳細</button>
                <button>更新</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))
}));

describe('ContractList Page', () => {
  beforeEach(() => {
    render(<ContractList />);
  });

  test('renders contract list title', () => {
    expect(screen.getByText('契約一覧')).toBeInTheDocument();
  });

  test('renders new contract registration button', () => {
    expect(screen.getByText('新規契約登録')).toBeInTheDocument();
  });

  test('renders ag-grid with contract data', () => {
    // AgGridがレンダリングされていることを確認
    expect(screen.getByTestId('mock-ag-grid')).toBeInTheDocument();
    
    // 正しい行数のデータが渡されていることを確認
    expect(screen.getByTestId('grid-row-count')).toHaveAttribute('data-count', '5');
    
    // 各契約の情報が表示されていることを確認
    expect(screen.getByText('山田 太郎')).toBeInTheDocument();
    expect(screen.getByText('佐藤 次郎')).toBeInTheDocument();
    expect(screen.getByText('鈴木 三郎')).toBeInTheDocument();
    expect(screen.getByText('田中 四郎')).toBeInTheDocument();
    expect(screen.getByText('高橋 五郎')).toBeInTheDocument();
  });

  test('displays contracts with different projects', () => {
    expect(screen.getByText('Javaエンジニア募集')).toBeInTheDocument();
    expect(screen.getByText('インフラエンジニア')).toBeInTheDocument();
    expect(screen.getByText('フロントエンドエンジニア')).toBeInTheDocument();
    expect(screen.getByText('PMO支援')).toBeInTheDocument();
    expect(screen.getByText('テスト自動化エンジニア')).toBeInTheDocument();
  });

  test('displays contracts with different periods', () => {
    expect(screen.getByText('2025/05/01 - 2025/10/31')).toBeInTheDocument();
    expect(screen.getByText('2025/05/15 - 2025/11/30')).toBeInTheDocument();
    expect(screen.getByText('2025/01/01 - 2025/03/31')).toBeInTheDocument();
    expect(screen.getByText('2025/05/01 - 2026/03/31')).toBeInTheDocument();
    expect(screen.getByText('2025/04/01 - 2025/04/30')).toBeInTheDocument();
  });

  test('displays contracts with different prices', () => {
    expect(screen.getByText('800,000円')).toBeInTheDocument();
    expect(screen.getByText('750,000円')).toBeInTheDocument();
    expect(screen.getByText('700,000円')).toBeInTheDocument();
    expect(screen.getByText('850,000円')).toBeInTheDocument();
    expect(screen.getByText('720,000円')).toBeInTheDocument();
  });

  test('displays contracts with different statuses', () => {
    // 「契約中」ステータスの契約が存在することを確認
    expect(screen.getAllByText('契約中').length).toBeGreaterThan(0);
    
    // 「更新待ち」ステータスの契約が存在することを確認
    expect(screen.getByText('更新待ち')).toBeInTheDocument();
    
    // 「契約終了」ステータスの契約が存在することを確認
    expect(screen.getByText('契約終了')).toBeInTheDocument();
  });

  test('handles new contract registration button click', () => {
    // 新規契約登録ボタンをクリック
    const newButton = screen.getByText('新規契約登録');
    fireEvent.click(newButton);
    
    // 注: 実際の新規契約登録機能はコンポーネント内で実装されていないため、
    // ここではボタンクリックのシミュレーションのみを行います
  });
});
