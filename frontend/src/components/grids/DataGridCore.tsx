import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef, 
  GridReadyEvent, 
  GridApi, 
  ColumnApi, 
  CellValueChangedEvent, 
  CellClickedEvent,
  RowClickedEvent,
  KeyboardEvent,
  CellEditingStartedEvent,
  CellEditingStoppedEvent
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface DataGridCoreProps {
  rowData: any[] | null;
  columnDefs: ColDef[];
  pagination?: boolean;
  paginationPageSize?: number;
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc';
  rowSelection?: 'single' | 'multiple';
  onSelectionChanged?: (selectedRows: any[]) => void;
  editable?: boolean;
  onCellValueChanged?: (params: any) => void;
  onRowClick?: (data: any) => void;
  onRowDoubleClick?: (data: any) => void;
  sideBar?: boolean | { toolPanels: any[] };
  onRowDeleted?: (data: any) => Promise<boolean>;
  domLayout?: string;
  onGridReady?: (params: { api: GridApi, columnApi: ColumnApi }) => void;
}

/**
 * データグリッドのコア機能を提供するコンポーネント
 */
export const DataGridCore: React.FC<DataGridCoreProps> = ({
  rowData,
  columnDefs,
  pagination = true,
  paginationPageSize = 10,
  defaultSortField,
  defaultSortDirection = 'asc',
  rowSelection,
  onSelectionChanged,
  editable = false,
  onCellValueChanged,
  onRowClick,
  onRowDoubleClick,
  sideBar = false,
  onRowDeleted,
  domLayout,
  onGridReady
}) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [modifiedData, setModifiedData] = useState<Set<any>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingCell, setEditingCell] = useState<{rowIndex: number, colId: string} | null>(null);
  const [copiedCells, setCopiedCells] = useState<any[]>([]);
  const gridRef = useRef<AgGridReact>(null);
  
  // 編集モード関連
  useEffect(() => {
    if (!editable) {
      // 編集モードが無効化されたとき、修正データをクリア
      setModifiedData(new Set());
      setHasUnsavedChanges(false);
      setEditingCell(null);
      setCopiedCells([]);
    }
  }, [editable]);

  // 未保存の変更がある場合のブラウザ離脱警告
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        // 標準のブラウザ確認メッセージ
        e.returnValue = '未保存の変更があります。このページを離れますか？';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  
  // デフォルトの列定義
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: expandedFilters,
    minWidth: 100,
    editable: editable, // 編集可能フラグをデフォルト列定義に追加
    cellStyle: (params: any) => {
      // 編集モード時、編集可能セルに視覚的なスタイルを適用
      if (editable && params.colDef.editable !== false) {
        const isModified = modifiedData.has(params.data) && 
          params.column.getColId() in (params.data._modified || {});
        
        return isModified 
          ? { backgroundColor: 'rgba(255, 255, 224, 0.5)', borderLeft: '2px solid #4299e1' } 
          : { backgroundColor: 'rgba(240, 248, 255, 0.3)' };
      }
      return null;
    }
  }), [expandedFilters, editable, modifiedData]);

  // グリッド準備完了時の処理
  const handleGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    
    // 自動サイズ調整
    params.api.sizeColumnsToFit();
    
    // デフォルトのソート設定
    if (defaultSortField && params.columnApi.getColumn(defaultSortField)) {
      params.columnApi.applyColumnState({
        state: [
          { colId: defaultSortField, sort: defaultSortDirection }
        ]
      });
    }
    
    // 行データが空の場合の処理
    if (!rowData || rowData.length === 0) {
      params.api.showNoRowsOverlay();
    }

    // 親コンポーネントのハンドラを呼び出し
    if (onGridReady) {
      onGridReady({ api: params.api, columnApi: params.columnApi });
    }
  }, [rowData, defaultSortField, defaultSortDirection, onGridReady]);
  
  // 選択変更時の処理
  const handleSelectionChanged = useCallback(() => {
    if (!gridApi) return;
    
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    
    setSelectedRows(selectedData);
    
    if (onSelectionChanged) {
      onSelectionChanged(selectedData);
    }
  }, [gridApi, onSelectionChanged]);
  
  // セル値変更時の処理
  const handleCellValueChanged = useCallback((params: CellValueChangedEvent) => {
    // 変更前後の値が同じ場合は処理しない
    if (params.oldValue === params.newValue) return;
    
    // 変更されたデータを記録
    setModifiedData(prev => {
      const newSet = new Set(prev);
      
      // 変更されたフィールドを追跡
      if (!params.data._modified) {
        params.data._modified = {};
      }
      params.data._modified[params.column.getColId()] = {
        oldValue: params.oldValue,
        newValue: params.newValue
      };
      
      newSet.add(params.data);
      return newSet;
    });
    
    // 未保存フラグをセット
    setHasUnsavedChanges(true);
    
    // 親コンポーネントのハンドラを呼び出し（即時保存する場合）
    if (onCellValueChanged) {
      onCellValueChanged(params);
    }
  }, [onCellValueChanged]);

  // セル編集開始時の処理
  const handleCellEditingStarted = useCallback((params: CellEditingStartedEvent) => {
    setEditingCell({
      rowIndex: params.rowIndex,
      colId: params.column.getColId()
    });
  }, []);

  // セル編集終了時の処理
  const handleCellEditingStoppted = useCallback((params: CellEditingStoppedEvent) => {
    setEditingCell(null);
  }, []);

  // セルクリック時の処理
  const handleCellClicked = useCallback((params: CellClickedEvent) => {
    // 操作列（リンクやボタンなど）のクリックは無視
    if (params.colDef.headerName === '操作') {
      return;
    }
    
    // 編集モードでなく、行クリックハンドラがある場合のみ実行
    if (!editable && onRowClick) {
      onRowClick(params.data);
    }
  }, [editable, onRowClick]);
  
  // 行クリック時の処理
  const handleRowClicked = useCallback((params: RowClickedEvent) => {
    // 編集モードでなく、行クリックハンドラがある場合のみ実行
    if (!editable && onRowClick) {
      onRowClick(params.data);
    }
  }, [editable, onRowClick]);
  
  // 行ダブルクリック時の処理
  const handleRowDoubleClicked = useCallback((params: any) => {
    // 編集モードでなく、行ダブルクリックハンドラがある場合のみ実行
    if (!editable && onRowDoubleClick) {
      onRowDoubleClick(params.data);
    }
  }, [editable, onRowDoubleClick]);

  // キーボードイベント処理
  const handleKeyDown = useCallback((params: KeyboardEvent) => {
    // Ctrl+C: セルコピー
    if (params.event.ctrlKey && params.event.key === 'c') {
      if (!gridApi) return;
      
      // Community版ではgetCellRanges()が使用できないため、選択行のみを処理
      const selectedNodes = gridApi.getSelectedNodes();
      if (selectedNodes && selectedNodes.length > 0) {
        const copiedData: any[] = [];
        
        selectedNodes.forEach(node => {
          if (!node) return;
          
          // 選択された行のデータをコピー
          const rowData = { ...node.data };
          copiedData.push(rowData);
        });
        
        setCopiedCells(copiedData);
        return true; // イベントを消費
      }
    }
    
    // Ctrl+V: セルペースト
    if (params.event.ctrlKey && params.event.key === 'v' && copiedCells.length > 0) {
      if (!gridApi || !editable) return;
      
      const focusedCell = gridApi.getFocusedCell();
      if (!focusedCell) return;
      
      const startRowIndex = focusedCell.rowIndex;
      const startColId = focusedCell.column.getColId();
      
      // 貼り付けのスタート位置を計算
      const startColIndex = columnDefs.findIndex(col => 
        (col as ColDef).field === startColId || (col as ColDef).colId === startColId
      );
      
      if (startColIndex === -1) return;
      
      // コピーしたデータを貼り付け
      copiedCells.forEach((rowData, rowOffset) => {
        const targetRowIndex = startRowIndex + rowOffset;
        const targetRowNode = gridApi.getDisplayedRowAtIndex(targetRowIndex);
        
        if (!targetRowNode) return;
        
        // 行データをディープコピー
        const updatedData = { ...targetRowNode.data };
        
        // 列データを更新
        Object.entries(rowData).forEach(([field, value], colOffset) => {
          const targetColIndex = startColIndex + colOffset;
          if (targetColIndex >= columnDefs.length) return;
          
          const targetCol = columnDefs[targetColIndex] as ColDef;
          const targetField = targetCol.field || targetCol.colId;
          
          if (!targetField || targetCol.editable === false) return;
          
          updatedData[targetField] = value;
        });
        
        // データの変更を適用
        gridApi.applyTransaction({
          update: [updatedData]
        });
        
        // 変更をモデルに反映
        setModifiedData(prev => {
          const newSet = new Set(prev);
          newSet.add(updatedData);
          return newSet;
        });
        
        setHasUnsavedChanges(true);
      });
      
      return true; // イベントを消費
    }
    
    // Delete/Backspace: セルクリア
    if ((params.event.key === 'Delete' || params.event.key === 'Backspace') && editable) {
      if (!gridApi) return;
      
      // Community版ではgetCellRanges()が使用できないため、選択行と現在フォーカスされているセルを処理
      const selectedNodes = gridApi.getSelectedNodes();
      const focusedCell = gridApi.getFocusedCell();
      
      if (selectedNodes && selectedNodes.length > 0 && focusedCell) {
        // フォーカスされている列
        const focusedColId = focusedCell.column.getColId();
        
        selectedNodes.forEach(node => {
          if (!node) return;
          
          const updatedData = { ...node.data };
          let changed = false;
          
          // フォーカスされているセルのみクリア
          if (focusedCell.column.getColDef().editable !== false) {
            updatedData[focusedColId] = null;
            changed = true;
          }
          
          if (changed) {
            // データ更新
            gridApi.applyTransaction({
              update: [updatedData]
            });
            
            // 変更をモデルに反映
            setModifiedData(prev => {
              const newSet = new Set(prev);
              newSet.add(updatedData);
              return newSet;
            });
            
            setHasUnsavedChanges(true);
          }
        });
        
        return true; // イベントを消費
      }
    }
    
    return false;
  }, [gridApi, columnDefs, copiedCells, editable]);

  return (
    <div className="ag-theme-alpine w-full h-full">
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        rowSelection={rowSelection}
        onGridReady={handleGridReady}
        onSelectionChanged={handleSelectionChanged}
        onCellValueChanged={handleCellValueChanged}
        onCellEditingStarted={handleCellEditingStarted}
        onCellEditingStopped={handleCellEditingStoppted}
        onCellClicked={handleCellClicked}
        onRowClicked={handleRowClicked}
        onRowDoubleClicked={handleRowDoubleClicked}
        suppressRowClickSelection={false}
        enableCellTextSelection={true}
        suppressCopyRowsToClipboard={true}
        suppressClipboardPaste={true}
        navigateToNextCell={undefined}
        tabToNextCell={undefined}
        sideBar={sideBar}
        domLayout={domLayout}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
