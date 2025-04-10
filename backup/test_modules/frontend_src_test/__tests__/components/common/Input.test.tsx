import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../../../../components/common/Input';

describe('Input Component', () => {
  // 基本的なレンダリングテスト
  test('renders input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  // ラベル付きのテスト
  test('renders with label', () => {
    render(<Input label="テストラベル" />);
    expect(screen.getByLabelText('テストラベル')).toBeInTheDocument();
  });

  // ラベルなしのテスト
  test('renders without label', () => {
    render(<Input placeholder="ラベルなし入力" />);
    expect(screen.getByPlaceholderText('ラベルなし入力')).toBeInTheDocument();
  });

  // エラーメッセージのテスト
  test('renders with error message', () => {
    render(<Input error="エラーメッセージ" />);
    expect(screen.getByText('エラーメッセージ')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-error-color');
  });

  // ヘルパーテキストのテスト
  test('renders with helper text', () => {
    render(<Input helperText="ヘルパーテキスト" />);
    expect(screen.getByText('ヘルパーテキスト')).toBeInTheDocument();
  });

  // エラーがある場合はヘルパーテキストが表示されないことのテスト
  test('does not render helper text when error is present', () => {
    render(<Input error="エラーメッセージ" helperText="ヘルパーテキスト" />);
    expect(screen.getByText('エラーメッセージ')).toBeInTheDocument();
    expect(screen.queryByText('ヘルパーテキスト')).not.toBeInTheDocument();
  });

  // 全幅表示のテスト
  test('renders with full width', () => {
    render(<Input fullWidth />);
    expect(screen.getByRole('textbox').parentElement).toHaveClass('w-full');
  });

  // 入力値の変更テスト
  test('handles input value change', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'テスト入力' } });
    expect(input).toHaveValue('テスト入力');
  });

  // 無効状態のテスト
  test('renders in disabled state', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  // プレースホルダーのテスト
  test('renders with placeholder', () => {
    render(<Input placeholder="プレースホルダー" />);
    expect(screen.getByPlaceholderText('プレースホルダー')).toBeInTheDocument();
  });

  // IDの自動生成テスト
  test('generates unique id when not provided', () => {
    render(<Input label="自動ID" />);
    const input = screen.getByLabelText('自動ID');
    expect(input.id).toMatch(/input-[a-z0-9]{9}/);
  });

  // 指定されたIDの使用テスト
  test('uses provided id', () => {
    render(<Input id="custom-id" label="カスタムID" />);
    expect(screen.getByLabelText('カスタムID').id).toBe('custom-id');
  });
});
