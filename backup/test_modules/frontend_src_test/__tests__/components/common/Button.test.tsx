import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../../../components/common/Button';

describe('Button Component', () => {
  // 基本的なレンダリングテスト
  test('renders button with children', () => {
    render(<Button>テストボタン</Button>);
    expect(screen.getByText('テストボタン')).toBeInTheDocument();
  });

  // バリアントのテスト
  test('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">プライマリ</Button>);
    expect(screen.getByText('プライマリ')).toHaveClass('btn-primary');

    rerender(<Button variant="secondary">セカンダリ</Button>);
    expect(screen.getByText('セカンダリ')).toHaveClass('btn-secondary');

    rerender(<Button variant="success">成功</Button>);
    expect(screen.getByText('成功')).toHaveClass('btn-success');

    rerender(<Button variant="warning">警告</Button>);
    expect(screen.getByText('警告')).toHaveClass('btn-warning');

    rerender(<Button variant="error">エラー</Button>);
    expect(screen.getByText('エラー')).toHaveClass('btn-error');
  });

  // サイズのテスト
  test('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">小</Button>);
    expect(screen.getByText('小')).toHaveClass('text-sm');

    rerender(<Button size="md">中</Button>);
    expect(screen.getByText('中')).toHaveClass('py-2');

    rerender(<Button size="lg">大</Button>);
    expect(screen.getByText('大')).toHaveClass('text-lg');
  });

  // 全幅表示のテスト
  test('renders with full width', () => {
    render(<Button fullWidth>全幅ボタン</Button>);
    expect(screen.getByText('全幅ボタン')).toHaveClass('w-full');
  });

  // ローディング状態のテスト
  test('renders in loading state', () => {
    render(<Button isLoading>ボタン</Button>);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    expect(screen.queryByText('ボタン')).not.toBeInTheDocument();
  });

  // 無効状態のテスト
  test('renders in disabled state', () => {
    render(<Button disabled>無効ボタン</Button>);
    const button = screen.getByText('無効ボタン');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-70');
  });

  // クリックイベントのテスト
  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>クリックボタン</Button>);
    
    fireEvent.click(screen.getByText('クリックボタン'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // 無効状態でクリックイベントが発火しないことのテスト
  test('does not call onClick handler when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>無効クリックボタン</Button>);
    
    fireEvent.click(screen.getByText('無効クリックボタン'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // ローディング状態でクリックイベントが発火しないことのテスト
  test('does not call onClick handler when loading', () => {
    const handleClick = jest.fn();
    render(<Button isLoading onClick={handleClick}>ローディングボタン</Button>);
    
    fireEvent.click(screen.getByText('読み込み中...'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
