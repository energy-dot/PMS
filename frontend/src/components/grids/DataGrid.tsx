// components/grids/DataGrid.tsxの修正

import React from 'react';
import DataGridCore from './DataGridCore';
import DataGridToolbar from './DataGridToolbar';
import { ButtonVariant } from '../common/Button';
import { ReactNode } from 'react';

// アクションボタンの型定義
export interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  icon?: ReactNode;
  disabled?: boolean;
  show?: boolean;
}

// DataGridのプロパティ型を定義
export interface DataGridProps {
  data: any[];
  columns: {
    field: string;
    headerName: string;
    width?: number;
    renderCell?: (params: any) => React.ReactNode;
  }[];
  title?: string;
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number;
  actionButtons?: ActionButton[];
  onRowClick?: (row: any) => void;
  selectedRows?: any[];
  onSelectionChange?: (selectedRows: any[]) => void;
  checkboxSelection?: boolean;
  filters?: React.ReactNode;
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

// DataGridコンポーネント
const DataGrid: React.FC<DataGridProps> = ({
  data,
  columns,
  title,
  loading = false,
  pagination = true,
  pageSize = 10,
  onPageChange,
  totalCount,
  actionButtons,
  onRowClick,
  selectedRows,
  onSelectionChange,
  checkboxSelection = false,
  filters,
  onSearch,
  searchPlaceholder = '検索...',
  emptyMessage = 'データがありません',
}) => {
  return (
    <div className="data-grid">
      {(title || actionButtons || onSearch || filters) && (
        <DataGridToolbar
          title={title}
          actionButtons={actionButtons}
          onSearch={onSearch}
          searchPlaceholder={searchPlaceholder}
          filters={filters}
        />
      )}
      <DataGridCore
        data={data}
        columns={columns}
        loading={loading}
        pagination={pagination}
        pageSize={pageSize}
        onPageChange={onPageChange}
        totalCount={totalCount}
        onRowClick={onRowClick}
        selectedRows={selectedRows}
        onSelectionChange={onSelectionChange}
        checkboxSelection={checkboxSelection}
        emptyMessage={emptyMessage}
      />
    </div>
  );
};

export default DataGrid;
