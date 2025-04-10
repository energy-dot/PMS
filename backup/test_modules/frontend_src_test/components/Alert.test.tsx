import { render, screen, fireEvent } from '@testing-library/react';
import Alert from '../../components/common/Alert';

describe('Alert Component', () => {
  test('renders alert with correct message', () => {
    render(<Alert variant="success" message="成功メッセージ" />);
    expect(screen.getByText('成功メッセージ')).toBeInTheDocument();
  });

  test('applies success variant styles correctly', () => {
    render(<Alert variant="success" message="成功メッセージ" />);
    const alert = screen.getByText('成功メッセージ').closest('div');
    expect(alert).toHaveClass('alert-success');
  });

  test('applies error variant styles correctly', () => {
    render(<Alert variant="error" message="エラーメッセージ" />);
    const alert = screen.getByText('エラーメッセージ').closest('div');
    expect(alert).toHaveClass('alert-error');
  });

  test('applies warning variant styles correctly', () => {
    render(<Alert variant="warning" message="警告メッセージ" />);
    const alert = screen.getByText('警告メッセージ').closest('div');
    expect(alert).toHaveClass('alert-warning');
  });

  test('renders title when provided', () => {
    render(<Alert variant="success" title="成功" message="操作が成功しました" />);
    expect(screen.getByText('成功')).toBeInTheDocument();
    expect(screen.getByText('操作が成功しました')).toBeInTheDocument();
  });

  test('renders close button when onClose is provided', () => {
    render(<Alert variant="success" message="閉じれるアラート" onClose={() => {}} />);
    expect(screen.getByText('×')).toBeInTheDocument();
  });

  test('does not render close button when onClose is not provided', () => {
    render(<Alert variant="success" message="閉じれないアラート" />);
    expect(screen.queryByText('×')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Alert variant="success" message="閉じれるアラート" onClose={handleClose} />);
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
