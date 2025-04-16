// components/grids/DataGridToolbar.tsxの修正

import React from 'react';
import Button from '../common/Button';
import { ActionButton } from './DataGrid';

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
      <div className="data-grid-toolbar-left">
        {title && <h2 className="data-grid-title">{title}</h2>}
      </div>
      <div className="data-grid-toolbar-right">
        {onSearch && (
          <div className="data-grid-search">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
              className="form-control"
            />
          </div>
        )}
        {filters && <div className="data-grid-filters">{filters}</div>}
        {actionButtons && actionButtons.length > 0 && (
          <div className="data-grid-actions">
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
                  {button.icon && <span className="button-icon">{button.icon}</span>}
                  {button.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataGridToolbar;
