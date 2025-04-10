/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';

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
              <td>{row.type}</td>
              <td>{row.title}</td>
              <td>{row.status}</td>
              <td>{row.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))
}));

describe('Dashboard Page', () => {
  beforeEach(() => {
    render(<Dashboard />);
  });

  test('renders dashboard title', () => {
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
  });

  test('renders KPI section with correct data', () => {
    // KPIセクションのタイトルが表示されていることを確認
    expect(screen.getByText('主要KPI')).toBeInTheDocument();
    
    // 各KPIが表示されていることを確認
    expect(screen.getByText('総パートナー会社数')).toBeInTheDocument();
    expect(screen.getByText('募集中案件数')).toBeInTheDocument();
    expect(screen.getByText('稼働中要員総数')).toBeInTheDocument();
    expect(screen.getByText('今月の契約終了予定')).toBeInTheDocument();
    
    // KPIの値が表示されていることを確認
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('78')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    
    // 変化量が表示されていることを確認
    expect(screen.getByText('+3')).toBeInTheDocument();
    expect(screen.getByText('-2')).toBeInTheDocument();
    expect(screen.getByText('+5')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('renders task management section with ag-grid', () => {
    // タスク管理セクションのタイトルが表示されていることを確認
    expect(screen.getByText('タスク管理')).toBeInTheDocument();
    
    // AgGridがレンダリングされていることを確認
    expect(screen.getByTestId('mock-ag-grid')).toBeInTheDocument();
    
    // 正しい行数のデータが渡されていることを確認
    expect(screen.getByTestId('grid-row-count')).toHaveAttribute('data-count', '5');
    
    // 各タスクの内容が表示されていることを確認
    expect(screen.getByText('案件申請')).toBeInTheDocument();
    expect(screen.getByText('Javaエンジニア募集')).toBeInTheDocument();
    expect(screen.getByText('承認待ち')).toBeInTheDocument();
    expect(screen.getByText('2025/04/10')).toBeInTheDocument();
  });

  test('renders deadline management section with alerts', () => {
    // 期限管理セクションのタイトルが表示されていることを確認
    expect(screen.getByText('期限管理')).toBeInTheDocument();
    
    // 警告アラートが表示されていることを確認
    expect(screen.getByText('注意:')).toBeInTheDocument();
    expect(screen.getByText('5件の契約が30日以内に終了します。確認してください。')).toBeInTheDocument();
    
    // エラーアラートが表示されていることを確認
    expect(screen.getByText('警告:')).toBeInTheDocument();
    expect(screen.getByText('2社のパートナー会社の反社チェックが期限切れになります。')).toBeInTheDocument();
  });
});
