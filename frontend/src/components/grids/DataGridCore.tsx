// components/grids/DataGridCore.tsx

import React from 'react';

// DataGridCoreのプロパティ型を定義
interface DataGridCoreProps {
  data: any[];
  columns: {
    field: string;
    headerName: string;
    width?: number;
    renderCell?: (params: any) => React.ReactNode;
  }[];
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number;
  onRowClick?: (row: any) => void;
  selectedRows?: any[];
  onSelectionChange?: (selectedRows: any[]) => void;
  checkboxSelection?: boolean;
  emptyMessage?: string;
}

// DataGridCoreコンポーネント
const DataGridCore: React.FC<DataGridCoreProps> = ({
  data,
  columns,
  loading = false,
  pagination = true,
  pageSize = 10,
  onPageChange,
  totalCount,
  onRowClick,
  selectedRows = [],
  onSelectionChange,
  checkboxSelection = false,
  emptyMessage = 'データがありません',
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selected, setSelected] = React.useState<any[]>(selectedRows);

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // 行選択ハンドラー
  const handleRowSelect = (row: any) => {
    const isSelected = selected.some(item => item.id === row.id);
    let newSelected: any[];

    if (isSelected) {
      newSelected = selected.filter(item => item.id !== row.id);
    } else {
      newSelected = [...selected, row];
    }

    setSelected(newSelected);
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    }
  };

  // 行クリックハンドラー
  const handleRowClick = (row: any) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  // ページネーションの計算
  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const currentData = pagination ? data.slice(startIndex, endIndex) : data;

  return (
    <div className="data-grid-core">
      {loading ? (
        <div className="data-grid-loading">読み込み中...</div>
      ) : currentData.length === 0 ? (
        <div className="data-grid-empty">{emptyMessage}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  {checkboxSelection && (
                    <th className="selection-column">
                      <input
                        type="checkbox"
                        checked={selected.length === currentData.length}
                        onChange={() => {
                          const newSelected =
                            selected.length === currentData.length ? [] : [...currentData];
                          setSelected(newSelected);
                          if (onSelectionChange) {
                            onSelectionChange(newSelected);
                          }
                        }}
                      />
                    </th>
                  )}
                  {columns.map((column, index) => (
                    <th key={index} style={{ width: column.width ? `${column.width}px` : 'auto' }}>
                      {column.headerName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    onClick={() => handleRowClick(row)}
                    className={onRowClick ? 'clickable' : ''}
                  >
                    {checkboxSelection && (
                      <td className="selection-column">
                        <input
                          type="checkbox"
                          checked={selected.some(item => item.id === row.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelect(row);
                          }}
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td key={colIndex}>
                        {column.renderCell ? column.renderCell(row) : row[column.field]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && totalPages > 1 && (
            <div className="data-grid-pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                前へ
              </button>
              <span className="pagination-info">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataGridCore;
