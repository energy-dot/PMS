/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PartnerList from '../../pages/PartnerList';

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
              <td>{row.address}</td>
              <td>{row.phone}</td>
              <td>{row.status}</td>
              <td>
                <button>詳細</button>
                <button>編集</button>
                <button>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))
}));

describe('PartnerList Page', () => {
  beforeEach(() => {
    render(<PartnerList />);
  });

  test('renders partner list title', () => {
    expect(screen.getByText('パートナー会社一覧')).toBeInTheDocument();
  });

  test('renders new registration button', () => {
    expect(screen.getByText('新規登録')).toBeInTheDocument();
  });

  test('renders search input and button', () => {
    expect(screen.getByPlaceholderText('会社名で検索')).toBeInTheDocument();
    expect(screen.getByText('検索')).toBeInTheDocument();
  });

  test('renders ag-grid with partner data', () => {
    // AgGridがレンダリングされていることを確認
    expect(screen.getByTestId('mock-ag-grid')).toBeInTheDocument();
    
    // 正しい行数のデータが渡されていることを確認
    expect(screen.getByTestId('grid-row-count')).toHaveAttribute('data-count', '5');
    
    // 各パートナー会社の情報が表示されていることを確認
    expect(screen.getByText('株式会社テクノソリューション')).toBeInTheDocument();
    expect(screen.getByText('デジタルイノベーション株式会社')).toBeInTheDocument();
    expect(screen.getByText('株式会社ITプロフェッショナル')).toBeInTheDocument();
    expect(screen.getByText('サイバーテック株式会社')).toBeInTheDocument();
    expect(screen.getByText('株式会社システムクリエイト')).toBeInTheDocument();
  });

  test('handles search functionality', () => {
    // 検索入力フィールドに値を入力
    const searchInput = screen.getByPlaceholderText('会社名で検索');
    fireEvent.change(searchInput, { target: { value: 'テクノ' } });
    
    // 検索ボタンをクリック
    const searchButton = screen.getByText('検索');
    fireEvent.click(searchButton);
    
    // 注: 実際の検索機能はコンポーネント内で実装されていないため、
    // ここではユーザー操作のシミュレーションのみを行います
    expect(searchInput).toHaveValue('テクノ');
  });

  test('handles new registration button click', () => {
    // 新規登録ボタンをクリック
    const newButton = screen.getByText('新規登録');
    fireEvent.click(newButton);
    
    // 注: 実際の新規登録機能はコンポーネント内で実装されていないため、
    // ここではボタンクリックのシミュレーションのみを行います
  });

  test('displays correct number of partners', () => {
    // パートナー会社の数が5社であることを確認
    expect(screen.getByTestId('grid-row-count')).toHaveAttribute('data-count', '5');
  });

  test('displays partners with different statuses', () => {
    // 「取引中」ステータスのパートナーが存在することを確認
    expect(screen.getAllByText('取引中').length).toBeGreaterThan(0);
    
    // 「取引停止」ステータスのパートナーが存在することを確認
    expect(screen.getByText('取引停止')).toBeInTheDocument();
    
    // 「候補」ステータスのパートナーが存在することを確認
    expect(screen.getByText('候補')).toBeInTheDocument();
  });
});
