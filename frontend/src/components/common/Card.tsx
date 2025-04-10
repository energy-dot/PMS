import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * 共通のカードコンポーネント
 * コンテンツの表示領域をグループ化するのに使用
 */
const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  headerAction,
  footer,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-card overflow-hidden ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
              {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}
      
      <div className="px-4 py-5 sm:p-6">{children}</div>
      
      {footer && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;