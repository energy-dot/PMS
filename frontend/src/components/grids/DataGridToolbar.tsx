import React from 'react';
import Button from '../common/Button';

interface DataGridToolbarProps {
  actionButtons?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    icon?: React.ReactNode;
    disabled?: boolean;
    show?: boolean;
  }[];
  editable?: boolean;
  rowSelection?: 'single' | 'multiple';
  selectedRows: any[];
  onAddRow: () => void;
  onDuplicateRow: () => void;
  onDeleteRows: () => void;
  onSaveChanges: () => void;
  onDiscardChanges: () => void;
  hasUnsavedChanges: boolean;
  exportOptions?: {
    fileName?: string;
    sheetName?: string;
    onlySelected?: boolean;
  };
}

/**
 * データグリッドのツールバーコンポーネント
 */
export const DataGridToolbar: React.FC<DataGridToolbarProps> = ({
  actionButtons = [],
  editable = false,
  rowSelection,
  selectedRows = [],
  onAddRow,
  onDuplicateRow,
  onDeleteRows,
  onSaveChanges,
  onDiscardChanges,
  hasUnsavedChanges,
  exportOptions,
}) => {
  // 編集モードのボタン
  const renderEditButtons = () => {
    if (!editable) return null;
    
    return (
      <div className="flex space-x-2">
        <Button
          variant="primary"
          onClick={onAddRow}
          icon={<span className="material-icons text-sm">add</span>}
          label="追加"
        />
        
        <Button
          variant="secondary"
          onClick={onDuplicateRow}
          icon={<span className="material-icons text-sm">content_copy</span>}
          label="複製"
          disabled={selectedRows.length !== 1}
        />
        
        <Button
          variant="danger"
          onClick={onDeleteRows}
          icon={<span className="material-icons text-sm">delete</span>}
          label="削除"
          disabled={selectedRows.length === 0}
        />
        
        {hasUnsavedChanges && (
          <>
            <Button
              variant="success"
              onClick={onSaveChanges}
              icon={<span className="material-icons text-sm">save</span>}
              label="保存"
            />
            
            <Button
              variant="warning"
              onClick={onDiscardChanges}
              icon={<span className="material-icons text-sm">cancel</span>}
              label="破棄"
            />
          </>
        )}
      </div>
    );
  };
  
  // エクスポートボタン
  const renderExportButton = () => {
    if (!exportOptions) return null;
    
    return (
      <Button
        variant="info"
        onClick={() => {}}
        icon={<span className="material-icons text-sm">download</span>}
        label="エクスポート"
      />
    );
  };
  
  // カスタムアクションボタン
  const renderActionButtons = () => {
    if (actionButtons.length === 0) return null;
    
    return (
      <div className="flex space-x-2">
        {actionButtons.map((button, index) => {
          // showプロパティがfalseの場合は表示しない
          if (button.show === false) return null;
          
          return (
            <Button
              key={index}
              variant={button.variant || 'primary'}
              onClick={button.onClick}
              icon={button.icon}
              label={button.label}
              disabled={button.disabled}
            />
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="p-4 border-b flex flex-wrap justify-between items-center gap-2">
      <div className="flex space-x-2">
        {renderEditButtons()}
        {renderExportButton()}
      </div>
      
      {renderActionButtons()}
    </div>
  );
};
