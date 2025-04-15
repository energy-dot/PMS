import React from 'react';
import { ColDef, GridReadyEvent, CellValueChangedEvent, CellClickedEvent, RowClickedEvent } from 'ag-grid-community';
import { DataGridCore } from './DataGridCore';
import { DataGridToolbar } from './DataGridToolbar';
import { DataGridFooter } from './DataGridFooter';
import Card from '../common/Card';
import Alert from '../common/Alert';

interface DataGridProps {
  rowData: any[] | null;
  columnDefs: ColDef[];
  title?: string;
  pagination?: boolean;
  paginationPageSize?: number;
  height?: string | number;
  onRowClick?: (data: any) => void;
  onRowDoubleClick?: (data: any) => void;
  actionButtons?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    icon?: React.ReactNode;
    disabled?: boolean;
    show?: boolean;
  }[];
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc';
  rowSelection?: 'single' | 'multiple';
  onSelectionChanged?: (selectedRows: any[]) => void;
  loading?: boolean;
  error?: string | null;
  exportOptions?: {
    fileName?: string;
    sheetName?: string;
    onlySelected?: boolean;
  };
  className?: string;
  editable?: boolean;
  onCellValueChanged?: (params: any) => void;
  departmentFilter?: boolean;
  sideBar?: boolean | { toolPanels: any[] };
  onRowDeleted?: (data: any) => Promise<boolean>;
  domLayout?: string;
}

/**
 * 再利用可能なデータグリッドコンポーネント
 * ag-Gridをラップして使いやすくしたもの
 */
const DataGrid: React.FC<DataGridProps> = ({
  rowData,
  columnDefs,
  title,
  pagination = true,
  paginationPageSize = 10,
  height = 600,
  onRowClick,
  onRowDoubleClick,
  actionButtons = [],
  defaultSortField,
  defaultSortDirection = 'asc',
  rowSelection,
  onSelectionChanged,
  loading = false,
  error = null,
  exportOptions,
  className = '',
  editable = false,
  onCellValueChanged,
  sideBar = false,
  onRowDeleted,
  domLayout,
}) => {
  // エラー表示
  const renderError = () => {
    if (!error) return null;
    return <Alert variant="error" message={error} className="mb-4" />;
  };

  // ローディング表示
  const renderLoading = () => {
    if (!loading) return null;
    return (
      <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
        <div className="loader"></div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {renderError()}
      
      <Card className="overflow-hidden">
        {title && (
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
        )}
        
        <DataGridToolbar 
          actionButtons={actionButtons}
          editable={editable}
          rowSelection={rowSelection}
          selectedRows={[]} // DataGridCoreから受け取る
          onAddRow={() => {}} // DataGridCoreから受け取る
          onDuplicateRow={() => {}} // DataGridCoreから受け取る
          onDeleteRows={() => {}} // DataGridCoreから受け取る
          onSaveChanges={() => {}} // DataGridCoreから受け取る
          onDiscardChanges={() => {}} // DataGridCoreから受け取る
          hasUnsavedChanges={false} // DataGridCoreから受け取る
          exportOptions={exportOptions}
        />
        
        <div style={{ height: typeof height === 'number' ? `${height}px` : height }}>
          <DataGridCore
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            defaultSortField={defaultSortField}
            defaultSortDirection={defaultSortDirection}
            rowSelection={rowSelection}
            onSelectionChanged={onSelectionChanged}
            editable={editable}
            onCellValueChanged={onCellValueChanged}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
            sideBar={sideBar}
            onRowDeleted={onRowDeleted}
            domLayout={domLayout}
          />
        </div>
        
        <DataGridFooter 
          totalRows={rowData?.length || 0}
          selectedRows={[]} // DataGridCoreから受け取る
        />
      </Card>
      
      {renderLoading()}
    </div>
  );
};

export default DataGrid;
