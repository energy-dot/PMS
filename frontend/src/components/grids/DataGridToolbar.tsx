// components/grids/DataGridToolbar.tsxの修正

import React from 'react';
import Button from '../common/Button';
import { ActionButton } from './DataGrid';
import './DataGridToolbar.css';

// DataGridToolbarのプロパティ型を定義
interface DataGridToolbarProps {
  title?: string;
  actionButtons?: ActionButton[];
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
}

// DataGridToolbarコンポーネント
const DataGridToolbar: React.FC<DataGridToolbarProps> = ({
  title,
  actionButtons,
  onSearch,
  searchPlaceholder = '検索...',
  filters,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // 検索ハンドラー
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="data-grid-toolbar">
      <div className="data-grid-toolbar-title">
        {title && <h2>{title}</h2>}
      </div>
      <div className="data-grid-toolbar-actions">
        {actionButtons && actionButtons.length > 0 && (
          <div className="flex space-x-2">
            {actionButtons.map((button, index) => {
              // showプロパティがfalseの場合は表示しない
              if (button.show === false) return null;

              return (
                <Button
                  key={index}
                  variant={button.variant}
                  onClick={button.onClick}
                  disabled={button.disabled}
                >
                  {button.icon && <span className="mr-1">{button.icon}</span>}
                  {button.label}
                </Button>
              );
            })}
          </div>
        )}
        {onSearch && (
          <div className="data-grid-toolbar-search">
            <div className="data-grid-toolbar-search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        )}
      </div>
      {filters && <div className="data-grid-toolbar-filters">{filters}</div>}
    </div>
  );
};

export default DataGridToolbar;
