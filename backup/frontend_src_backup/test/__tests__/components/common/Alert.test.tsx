import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Alert from '../../../../../components/common/Alert';

describe('Alert Component', () => {
  // 基本的なレンダリングテスト
  test('renders alert with message', () => {
    render(<Alert variant="success" message="テストメッセージ" />);
    expect(screen.getByText('テストメッセージ')).toBeInTheDocument();
  });

  // バリアントのテスト
  test('renders with different variants', () => {
    const { rerender } = render(<Alert variant="success" message="成功メッセージ" />);
    expect(screen.getByText('成功メッセージ').parentElement).toHaveClass('alert-success');

    rerender(<Alert variant="warning" message="警告メッセージ" />);
    expect(screen.getByText('警告メッセージ').parentElement).toHaveClass('alert-warning');

    rerender(<Alert variant="error" message="エラーメッセージ" />);
    expect(screen.getByText('エラーメッセージ').parentElement).toHaveClass('alert-error');
  });

  // タイトル付きのテスト
  test('renders with title', () => {
    render(<Alert variant="success" title="テストタイトル" message="テストメッセージ" />);
    expect(screen.getByText('テストタイトル')).toBeInTheDocument();
    expect(screen.getByText('テストメッセージ')).toBeInTheDocument();
  });

  // タイトルなしのテスト
  test('renders without title', () => {
    render(<Alert variant="success" message="タイトルなしメッセージ" />);
    expect(screen.getByText('タイトルなしメッセージ')).toBeInTheDocument();
    expect(screen.queryByText(/タイトル/)).not.toBeInTheDocument();
  });

  // 閉じるボタン付きのテスト
  test('renders with close button when onClose is provided', () => {
    render(<Alert variant="success" message="閉じるボタン付きメッセージ" onClose={() => {}} />);
    expect(screen.getByText('×')).toBeInTheDocument();
  });

  // 閉じるボタンなしのテスト
  test('renders without close button when onClose is not provided', () => {
    render(<Alert variant="success" message="閉じるボタンなしメッセージ" />);
    expect(screen.queryByText('×')).not.toBeInTheDocument();
  });

  // 閉じるボタンのクリックイベントのテスト
  test('calls onClose handler when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Alert variant="success" message="閉じるテスト" onClose={handleClose} />);
    
    fireEvent.click(screen.getByText('×'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
