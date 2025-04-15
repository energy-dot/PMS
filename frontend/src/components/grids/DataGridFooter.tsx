import React from 'react';

interface DataGridFooterProps {
  totalRows: number;
  selectedRows: any[];
}

/**
 * データグリッドのフッターコンポーネント
 */
export const DataGridFooter: React.FC<DataGridFooterProps> = ({
  totalRows,
  selectedRows = [],
}) => {
  return (
    <div className="p-3 border-t flex justify-between items-center text-sm text-gray-600">
      <div>
        合計: <span className="font-medium">{totalRows}</span> 件
      </div>
      
      {selectedRows.length > 0 && (
        <div>
          選択: <span className="font-medium">{selectedRows.length}</span> 件
        </div>
      )}
    </div>
  );
};
