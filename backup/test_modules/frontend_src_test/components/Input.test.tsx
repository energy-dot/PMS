import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../components/common/Input';

describe('Input Component', () => {
  test('renders input with correct label', () => {
    render(<Input label="ユーザー名" />);
    expect(screen.getByLabelText('ユーザー名')).toBeInTheDocument();
  });

  test('applies default type as text', () => {
    render(<Input label="テキスト入力" />);
    expect(screen.getByLabelText('テキスト入力')).toHaveAttribute('type', 'text');
  });

  test('applies password type correctly', () => {
    render(<Input label="パスワード" type="password" />);
    expect(screen.getByLabelText('パスワード')).toHaveAttribute('type', 'password');
  });

  test('applies email type correctly', () => {
    render(<Input label="メールアドレス" type="email" />);
    expect(screen.getByLabelText('メールアドレス')).toHaveAttribute('type', 'email');
  });

  test('handles value change', () => {
    const handleChange = jest.fn();
    render(<Input label="テスト入力" onChange={handleChange} />);
    
    const input = screen.getByLabelText('テスト入力');
    fireEvent.change(input, { target: { value: 'テスト値' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  test('displays error message when provided', () => {
    render(<Input label="エラー入力" error="このフィールドは必須です" />);
    
    expect(screen.getByText('このフィールドは必須です')).toBeInTheDocument();
    expect(screen.getByLabelText('エラー入力')).toHaveClass('border-error-color');
  });

  test('displays helper text when provided', () => {
    render(<Input label="ヘルパーテキスト入力" helperText="8文字以上入力してください" />);
    
    expect(screen.getByText('8文字以上入力してください')).toBeInTheDocument();
  });

  test('does not display helper text when error is present', () => {
    render(
      <Input 
        label="エラーとヘルパー" 
        error="エラーメッセージ" 
        helperText="表示されないヘルパーテキスト" 
      />
    );
    
    expect(screen.getByText('エラーメッセージ')).toBeInTheDocument();
    expect(screen.queryByText('表示されないヘルパーテキスト')).not.toBeInTheDocument();
  });

  test('applies disabled state correctly', () => {
    render(<Input label="無効入力" disabled />);
    
    expect(screen.getByLabelText('無効入力')).toBeDisabled();
  });

  test('applies placeholder text correctly', () => {
    render(<Input label="プレースホルダー入力" placeholder="ここに入力してください" />);
    
    expect(screen.getByPlaceholderText('ここに入力してください')).toBeInTheDocument();
  });

  test('applies full width style correctly', () => {
    render(<Input label="全幅入力" fullWidth />);
    
    const formGroup = screen.getByLabelText('全幅入力').closest('div');
    expect(formGroup).toHaveClass('w-full');
  });

  test('applies custom className to input', () => {
    render(<Input label="カスタムクラス" className="custom-input-class" />);
    
    expect(screen.getByLabelText('カスタムクラス')).toHaveClass('custom-input-class');
  });

  test('generates random id when not provided', () => {
    render(<Input label="ランダムID" />);
    
    const input = screen.getByLabelText('ランダムID');
    expect(input.id).toMatch(/input-[a-z0-9]{9}/);
  });

  test('uses provided id when available', () => {
    render(<Input label="指定ID" id="custom-id" />);
    
    const input = screen.getByLabelText('指定ID');
    expect(input.id).toBe('custom-id');
  });
});
