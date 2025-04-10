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
  PasteStartEvent,
  PasteEndEvent,
  KeyboardEvent,
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  RowNode
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Button from '../common/Button';
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
}) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
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
  const onGridReady = useCallback((params: GridReadyEvent) => {
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
  }, [rowData, defaultSortField, defaultSortDirection]);
  
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
      
      const selectedRanges = gridApi.getCellRanges();
      if (selectedRanges && selectedRanges.length > 0) {
        const range = selectedRanges[0];
        const startRow = range.startRow?.rowIndex || 0;
        const endRow = range.endRow?.rowIndex || 0;
        const columns = range.columns;
        
        const copiedData: any[] = [];
        
        for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
          const rowNode = gridApi.getDisplayedRowAtIndex(rowIndex);
          if (!rowNode) continue;
          
          const rowData: any = {};
          columns.forEach(column => {
            const field = column.getColId();
            rowData[field] = rowNode.data[field];
          });
          
          copiedData.push(rowData);
        }
        
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
      
      const selectedRanges = gridApi.getCellRanges();
      if (selectedRanges && selectedRanges.length > 0) {
        const range = selectedRanges[0];
        const startRow = range.startRow?.rowIndex || 0;
        const endRow = range.endRow?.rowIndex || 0;
        const columns = range.columns;
        
        for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
          const rowNode = gridApi.getDisplayedRowAtIndex(rowIndex);
          if (!rowNode) continue;
          
          const updatedData = { ...rowNode.data };
          let changed = false;
          
          columns.forEach(column => {
            const field = column.getColId();
            // 編集可能なセルのみクリア
            if (column.getColDef().editable !== false) {
              updatedData[field] = null;
              changed = true;
            }
          });
          
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
        }
        
        return true; // イベントを消費
      }
    }
    
    return false;
  }, [gridApi, columnDefs, copiedCells, editable]);

  // 行削除処理
  const handleDeleteRow = useCallback(async (data: any) => {
    if (!window.confirm('この行を削除してもよろしいですか？')) return;
    
    if (onRowDeleted) {
      const success = await onRowDeleted(data);
      if (success && gridApi) {
        gridApi.applyTransaction({ remove: [data] });
        
        // 修正データから削除
        if (modifiedData.has(data)) {
          const newModifiedData = new Set(modifiedData);
          newModifiedData.delete(data);
          setModifiedData(newModifiedData);
          
          // 修正データが空になった場合は未保存フラグをクリア
          if (newModifiedData.size === 0) {
            setHasUnsavedChanges(false);
          }
        }
      }
    }
  }, [gridApi, modifiedData, onRowDeleted]);
  
  // 選択行削除処理
  const handleDeleteSelectedRows = useCallback(() => {
    if (selectedRows.length === 0) {
      alert('削除する行を選択してください');
      return;
    }
    
    if (!window.confirm(`選択された ${selectedRows.length} 行を削除してもよろしいですか？`)) return;
    
    // 削除処理
    const executeDelete = async () => {
      if (!gridApi || !onRowDeleted) return;
      
      try {
        // 各行を削除
        const results = await Promise.all(
          selectedRows.map(data => onRowDeleted(data))
        );
        
        // 成功した行だけをグリッドから削除
        const successRows = selectedRows.filter((_, index) => results[index]);
        
        if (successRows.length > 0) {
          gridApi.applyTransaction({ remove: successRows });
          
          // 修正データから削除
          const newModifiedData = new Set(modifiedData);
          successRows.forEach(data => {
            if (newModifiedData.has(data)) {
              newModifiedData.delete(data);
            }
          });
          
          setModifiedData(newModifiedData);
          
          // 修正データが空になった場合は未保存フラグをクリア
          if (newModifiedData.size === 0) {
            setHasUnsavedChanges(false);
          }
          
          // 成功メッセージ
          if (successRows.length === selectedRows.length) {
            alert(`${successRows.length} 行を削除しました`);
          } else {
            alert(`${successRows.length}/${selectedRows.length} 行を削除しました`);
          }
        } else {
          alert('削除に失敗しました');
        }
      } catch (error) {
        console.error('Delete rows error:', error);
        alert('削除処理中にエラーが発生しました');
      }
    };
    
    executeDelete();
  }, [gridApi, selectedRows, modifiedData, onRowDeleted]);
  
  // 新規行追加処理
  const handleAddRow = useCallback(() => {
    if (!gridApi) return;
    
    // 新規行用のIDを生成
    const newId = `new-${Date.now()}`;
    
    // 空のオブジェクトに各カラムのフィールドを追加
    const emptyRow = columnDefs.reduce((acc, col) => {
      if (col.field) {
        acc[col.field] = null;
      }
      return acc;
    }, { id: newId, isNew: true });
    
    // グリッドに行を追加
    gridApi.applyTransaction({ add: [emptyRow] });
    
    // 修正データに追加
    setModifiedData(prev => {
      const newSet = new Set(prev);
      newSet.add(emptyRow);
      return newSet;
    });
    
    // 未保存フラグをセット
    setHasUnsavedChanges(true);
    
    // 新しい行にフォーカスを移動
    setTimeout(() => {
      // 最後の行を取得
      const lastRowIndex = gridApi.getDisplayedRowCount() - 1;
      if (lastRowIndex >= 0) {
        // 最初のセルにフォーカスを当てる
        const firstCol = gridApi.getDisplayedColAtIndex(0);
        if (firstCol) {
          gridApi.setFocusedCell(lastRowIndex, firstCol);
          // 編集モードを開始
          gridApi.startEditingCell({
            rowIndex: lastRowIndex,
            colKey: firstCol.getColId()
          });
        }
      }
    }, 100);
  }, [gridApi, columnDefs]);

  // コピー行追加処理
  const handleDuplicateSelectedRow = useCallback(() => {
    if (!gridApi || selectedRows.length === 0) {
      alert('複製する行を選択してください');
      return;
    }
    
    // 最初の選択行を複製
    const sourceRow = selectedRows[0];
    
    // 新規行用のIDを生成
    const newId = `new-${Date.now()}`;
    
    // 選択行のデータをコピーして新しいIDを設定
    const newRow = { ...sourceRow, id: newId, isNew: true };
    
    // ID以外のプライマリキー的なフィールドもクリアする必要がある場合は
    // ここでクリア処理を追加
    
    // グリッドに行を追加
    gridApi.applyTransaction({ add: [newRow] });
    
    // 修正データに追加
    setModifiedData(prev => {
      const newSet = new Set(prev);
      newSet.add(newRow);
      return newSet;
    });
    
    // 未保存フラグをセット
    setHasUnsavedChanges(true);
    
    // 新しい行にフォーカスを移動
    setTimeout(() => {
      // 最後の行を取得
      const lastRowIndex = gridApi.getDisplayedRowCount() - 1;
      if (lastRowIndex >= 0) {
        // 最初のセルにフォーカスを当てる
        gridApi.setFocusedCell(lastRowIndex, gridApi.getDisplayedColAtIndex(0));
      }
    }, 100);
  }, [gridApi, selectedRows]);

  // 変更内容の保存処理
  const handleSaveChanges = useCallback(async () => {
    if (modifiedData.size === 0) return;
    
    try {
      // 編集中のセルがある場合は、編集を完了させる
      if (editingCell && gridApi) {
        gridApi.stopEditing();
        setEditingCell(null);
      }
      
      // 保存処理（パフォーマンスの観点から親コンポーネントで実施）
      if (onCellValueChanged) {
        await onCellValueChanged({
          type: 'saveAll',
          modifiedRows: Array.from(modifiedData)
        });
      }
      
      // 変更済みデータをクリア
      setModifiedData(new Set());
      setHasUnsavedChanges(false);
      
      // 変更された行から_modifiedフラグをクリア
      if (gridApi) {
        gridApi.forEachNode((node: RowNode) => {
          if (node.data && node.data._modified) {
            delete node.data._modified;
            if (node.data.isNew) {
              delete node.data.isNew;
            }
          }
        });
        
        // グリッドの表示を更新
        gridApi.refreshCells({ force: true });
      }
    } catch (error) {
      console.error('Save changes error:', error);
      alert('変更の保存に失敗しました。');
    }
  }, [modifiedData, onCellValueChanged, editingCell, gridApi]);
  
  // 変更内容の破棄処理
  const handleDiscardChanges = useCallback(() => {
    if (modifiedData.size === 0) return;
    
    if (window.confirm('未保存の変更があります。変更を破棄しますか？')) {
      // 編集中のセルがある場合は、編集をキャンセル
      if (editingCell && gridApi) {
        gridApi.stopEditing(true); // true = キャンセル
        setEditingCell(null);
      }
      
      // 新規行を削除、既存行は元の状態に戻す
      if (gridApi) {
        // 変更された行をフィルタリング
        const modifiedRows = Array.from(modifiedData);
        const newRows = modifiedRows.filter(row => row.isNew);
        const updatedRows = modifiedRows.filter(row => !row.isNew);
        
        // 新規行を削除
        if (newRows.length > 0) {
          gridApi.applyTransaction({ remove: newRows });
        }
        
        // 既存行の状態を元に戻す
        gridApi.refreshCells({ force: true });
        
        // _modifiedフラグをクリア
        gridApi.forEachNode((node: RowNode) => {
          if (node.data && node.data._modified) {
            delete node.data._modified;
          }
        });
      }
      
      // 変更済みデータをクリア
      setModifiedData(new Set());
      setHasUnsavedChanges(false);
    }
  }, [modifiedData, gridApi, editingCell]);
  
  // エクスポート処理
  const handleExport = (type: 'csv' | 'excel') => {
    if (!gridApi) return;
    
    const exportParams: any = {
      fileName: exportOptions?.fileName || 'export',
    };
    
    if (exportOptions?.onlySelected && selectedRows.length > 0) {
      exportParams.onlySelected = true;
    }
    
    if (type === 'csv') {
      gridApi.exportDataAsCsv(exportParams);
    } else if (type === 'excel') {
      // ExcelのエクスポートはEnterpriseのみの機能
      // ここではCSVエクスポートを代替として使用
      alert('Excel形式でのエクスポートは現在実装中です。CSVでエクスポートします。');
      gridApi.exportDataAsCsv(exportParams);
    }
    
    setShowExportMenu(false);
  };
  
  // フィルターのトグル
  const toggleFilters = () => {
    setExpandedFilters(prev => !prev);
  };
  
  // データのリフレッシュ
  const refreshData = () => {
    if (gridApi) {
      gridApi.refreshCells({ force: true });
    }
  };

  // 貼り付け開始時の処理
  const handlePasteStart = useCallback((event: PasteStartEvent) => {
    // 編集モード時のみ有効
    if (!editable) return;
    
    console.log('Paste start:', event);
  }, [editable]);

  // 貼り付け終了時の処理
  const handlePasteEnd = useCallback((event: PasteEndEvent) => {
    // 編集モード時のみ有効
    if (!editable) return;
    
    console.log('Paste end:', event);
    
    // 貼り付けられたセルを変更済みとしてマーク
    if (event.source === 'clipboard' && gridApi) {
      gridApi.forEachNode((node: RowNode) => {
        // 貼り付けられたセルがある行
        if (node.data && node.data._modified) {
          setModifiedData(prev => {
            const newSet = new Set(prev);
            newSet.add(node.data);
            return newSet;
          });
          
          setHasUnsavedChanges(true);
        }
      });
    }
  }, [editable, gridApi]);

  // ヘッダーアクション
  const headerActions = (
    <div className="flex flex-wrap gap-2 items-center">
      {/* 編集モード関連ボタン */}
      {editable && (
        <div className="flex gap-2 mr-2">
          <Button
            variant="success"
            onClick={handleSaveChanges}
            size="sm"
            disabled={modifiedData.size === 0}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            }
            data-testid="save-changes-button"
          >
            変更を保存 {modifiedData.size > 0 && `(${modifiedData.size})`}
          </Button>
          
          <Button
            variant="danger"
            onClick={handleDiscardChanges}
            size="sm"
            disabled={modifiedData.size === 0}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            }
            data-testid="discard-changes-button"
          >
            変更を破棄
          </Button>
          
          <Button
            variant="primary"
            onClick={handleAddRow}
            size="sm"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            }
            data-testid="add-row-button"
          >
            行追加
          </Button>
          
          {rowSelection === 'multiple' && (
            <>
              <Button
                variant="primary"
                onClick={handleDuplicateSelectedRow}
                size="sm"
                disabled={selectedRows.length !== 1}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                  </svg>
                }
                data-testid="duplicate-row-button"
              >
                選択行を複製
              </Button>
              
              <Button
                variant="danger"
                onClick={handleDeleteSelectedRows}
                size="sm"
                disabled={selectedRows.length === 0}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                }
                data-testid="delete-selected-rows-button"
              >
                選択行を削除
              </Button>
            </>
          )}
        </div>
      )}
      
      {/* アクションボタン */}
      {actionButtons.filter(btn => btn.show !== false).map((button, index) => (
        <Button
          key={index}
          variant={button.variant || 'primary'}
          onClick={button.onClick}
          disabled={button.disabled || (hasUnsavedChanges && (button.label === '編集モード' || button.label === '編集モード終了'))}
          icon={button.icon}
          size="sm"
          data-testid={`grid-action-button-${index}`}
        >
          {button.label}
        </Button>
      ))}
      
      {/* ユーティリティボタン */}
      <Button
        variant="secondary"
        onClick={toggleFilters}
        size="sm"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
        }
        data-testid="toggle-filters-button"
      >
        {expandedFilters ? 'フィルタを隠す' : 'フィルタを表示'}
      </Button>
      
      <Button
        variant="secondary"
        onClick={refreshData}
        size="sm"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        }
        data-testid="refresh-button"
      >
        更新
      </Button>
      
      {/* エクスポートボタン */}
      {exportOptions && (
        <div className="relative inline-block">
          <Button
            variant="secondary"
            onClick={() => setShowExportMenu(!showExportMenu)}
            size="sm"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            }
            data-testid="export-button"
          >
            エクスポート
          </Button>
          
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
              <button
                onClick={() => handleExport('csv')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                data-testid="export-csv-button"
              >
                CSV形式でエクスポート
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                data-testid="export-excel-button"
              >
                Excel形式でエクスポート
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 編集モード用のCSSクラス
  const editableGridClass = editable ? 'ag-theme-alpine-edit-mode' : 'ag-theme-alpine';

  return (
    <Card
      title={title}
      headerAction={headerActions}
      className={`overflow-hidden ${className}`}
    >
      {/* 未保存変更の警告 */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded mb-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                未保存の変更があります。「変更を保存」をクリックして保存するか、「変更を破棄」をクリックして変更を破棄してください。
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 選択行情報 */}
      {rowSelection === 'multiple' && selectedRows.length > 0 && (
        <div className="mb-3 text-sm text-gray-600 flex items-center">
          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
            {selectedRows.length}
          </span>
          <span>行選択中</span>
        </div>
      )}
      
      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 編集モード情報 */}
      {editable && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 rounded mb-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <span className="font-medium">編集モード</span>：
                <span className="block mt-1">
                  <span className="font-medium">操作方法</span>：
                  <ul className="list-disc list-inside pl-2 mt-1">
                    <li>ダブルクリックでセル編集開始</li>
                    <li>Tab/Enterキーで次のセルに移動</li>
                    <li>Esc キーで編集キャンセル</li>
                    <li>Ctrl+C, Ctrl+V でコピー＆ペースト</li>
                    <li>複数セル選択は、マウスドラッグまたはShiftキー+矢印キー</li>
                    <li>Delete/Backspaceキーで選択セルのクリア</li>
                  </ul>
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* ローディング状態 */}
      {loading ? (
        <div className="flex items-center justify-center" style={{ height: 400 }}>
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-3 text-gray-600 text-sm">データを読み込み中...</p>
          </div>
        </div>
      ) : (
        <div 
          className={`${editableGridClass} w-full ${editable ? 'excel-like-grid' : ''}`} 
          style={{ height, width: '100%' }}
        >
          <style jsx global>{`
            .ag-row-modified {
              background-color: rgba(255, 255, 224, 0.3) !important;
            }
            
            .ag-row-new {
              background-color: rgba(240, 255, 240, 0.3) !important;
            }
            
            /* 編集モード時のスタイル */
            .excel-like-grid .ag-header {
              background-color: #f1f8ff;
              font-weight: bold;
            }
            
            .excel-like-grid .ag-cell-focus {
              border: 1px solid #4299e1 !important;
              outline: none;
            }
            
            .excel-like-grid .ag-cell-edit-input {
              height: 100%;
              width: 100%;
              padding: 0 4px;
            }
            
            /* 選択セルのスタイル */
            .excel-like-grid .ag-cell-range-selected:not(.ag-cell-range-single-cell) {
              background-color: rgba(66, 153, 225, 0.2) !important;
            }
            
            /* 数値セルの右寄せ */
            .ag-cell-wrap-text {
              white-space: normal;
            }
            
            /* 編集中セルのスタイル */
            .ag-cell-inline-editing {
              padding: 0 !important;
              height: 100% !important;
            }
            
            /* エディタスタイル */
            .ag-cell-edit-input, select.ag-cell-edit-input {
              border: 1px solid #4299e1;
              border-radius: 0;
              background-color: white;
              padding: 1px 3px;
              height: 100%;
              width: 100%;
            }
          `}</style>
          
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            onGridReady={onGridReady}
            onCellClicked={handleCellClicked}
            onRowClicked={handleRowClicked}
            onRowDoubleClicked={handleRowDoubleClicked}
            rowSelection={rowSelection}
            onSelectionChanged={handleSelectionChanged}
            overlayNoRowsTemplate="表示するデータがありません"
            overlayLoadingTemplate="<span class='loading'>データを読み込み中...</span>"
            suppressCellFocus={false} // 編集を有効にするためfalse
            animateRows={true}
            suppressRowClickSelection={editable} // 編集モード時は行クリックでの選択を抑制
            rowStyle={{ cursor: onRowClick && !editable ? 'pointer' : 'default' }}
            onCellValueChanged={handleCellValueChanged}
            onCellEditingStarted={handleCellEditingStarted}
            onCellEditingStoppped={handleCellEditingStoppted}
            stopEditingWhenCellsLoseFocus={true}
            enterMovesDown={true}
            enterNavigatesVertically={true}
            tabToNextCell={true}
            singleClickEdit={false}
            undoRedoCellEditing={true}
            undoRedoCellEditingLimit={20}
            onKeyDown={handleKeyDown}
            enableRangeSelection={true}  // 範囲選択を有効化
            enableFillHandle={editable}  // 編集モード時にフィルハンドルを有効化
            enableCellTextSelection={true}
            clipboardDeliminator={"\t"}
            onPasteStart={handlePasteStart}
            onPasteEnd={handlePasteEnd}
            sideBar={sideBar}
            getRowClass={(params) => {
              // 変更されたデータの行に特別なクラスを適用
              if (modifiedData.has(params.data)) {
                return 'ag-row-modified';
              }
              // 新規行には別のクラスを適用
              if (params.data && params.data.isNew) {
                return 'ag-row-new';
              }
              return '';
            }}
            // EXCELライクな動作をするための追加設定
            enableRangeHandle={true}  // 範囲のハンドルを表示
            rowDragManaged={editable} // 編集モード時に行ドラッグを有効化
          />
        </div>
      )}
    </Card>
  );
};

export default DataGrid;