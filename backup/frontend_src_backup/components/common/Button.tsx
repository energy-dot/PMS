import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'py-2 px-4',
    lg: 'text-lg py-3 px-6',
  };
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || isLoading ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <span className="mr-2">読み込み中...</span>
          {/* ローディングスピナーを追加することも可能 */}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
