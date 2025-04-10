import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/common/Button';

describe('Button Component', () => {
  test('renders button with correct text', () => {
    render(<Button>テストボタン</Button>);
    expect(screen.getByText('テストボタン')).toBeInTheDocument();
  });

  test('applies primary variant styles correctly', () => {
    render(<Button variant="primary">プライマリーボタン</Button>);
    const button = screen.getByText('プライマリーボタン');
    expect(button).toHaveClass('btn-primary');
  });

  test('applies secondary variant styles correctly', () => {
    render(<Button variant="secondary">セカンダリーボタン</Button>);
    const button = screen.getByText('セカンダリーボタン');
    expect(button).toHaveClass('btn-secondary');
  });

  test('applies success variant styles correctly', () => {
    render(<Button variant="success">成功ボタン</Button>);
    const button = screen.getByText('成功ボタン');
    expect(button).toHaveClass('btn-success');
  });

  test('applies warning variant styles correctly', () => {
    render(<Button variant="warning">警告ボタン</Button>);
    const button = screen.getByText('警告ボタン');
    expect(button).toHaveClass('btn-warning');
  });

  test('applies error variant styles correctly', () => {
    render(<Button variant="error">エラーボタン</Button>);
    const button = screen.getByText('エラーボタン');
    expect(button).toHaveClass('btn-error');
  });

  test('applies small size styles correctly', () => {
    render(<Button size="sm">小さいボタン</Button>);
    const button = screen.getByText('小さいボタン');
    expect(button).toHaveClass('text-sm');
    expect(button).toHaveClass('py-1');
    expect(button).toHaveClass('px-2');
  });

  test('applies medium size styles correctly', () => {
    render(<Button size="md">中サイズボタン</Button>);
    const button = screen.getByText('中サイズボタン');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('px-4');
  });

  test('applies large size styles correctly', () => {
    render(<Button size="lg">大きいボタン</Button>);
    const button = screen.getByText('大きいボタン');
    expect(button).toHaveClass('text-lg');
    expect(button).toHaveClass('py-3');
    expect(button).toHaveClass('px-6');
  });

  test('applies full width style correctly', () => {
    render(<Button fullWidth>全幅ボタン</Button>);
    const button = screen.getByText('全幅ボタン');
    expect(button).toHaveClass('w-full');
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">カスタムクラスボタン</Button>);
    const button = screen.getByText('カスタムクラスボタン');
    expect(button).toHaveClass('custom-class');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>クリックボタン</Button>);
    
    const button = screen.getByText('クリックボタン');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders disabled button correctly', () => {
    render(<Button disabled>無効ボタン</Button>);
    
    const button = screen.getByText('無効ボタン');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-70');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  test('disabled button does not trigger click handler', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>無効クリックボタン</Button>);
    
    const button = screen.getByText('無効クリックボタン');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('renders loading state correctly', () => {
    render(<Button isLoading>ロード中ボタン</Button>);
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    expect(screen.queryByText('ロード中ボタン')).not.toBeInTheDocument();
    
    const button = screen.getByText('読み込み中...').closest('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-70');
    expect(button).toHaveClass('cursor-not-allowed');
  });
});
