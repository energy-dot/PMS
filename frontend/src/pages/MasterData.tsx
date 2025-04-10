import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import masterDataService from '../services/masterDataService';
import { useAuthStore } from '../store/authStore';

const MasterData: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [masterDataTypes, setMasterDataTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [masterData, setMasterData] = useState<any[]>([]);
  
  // モーダル関連の状態
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    sortOrder: 0,
    isActive: true
  });
  
  // 列定義
  const columnDefs: ColDef[] = [
    { 
      headerName: 'ID', 
      field: 'id', 
      sortable: true, 
      filter: true, 
      width: 100 
    },
    { 
      headerName: '名前', 
      field: 'name', 
      sortable: true, 
      filter: true, 
      flex: 1 
    },
    { 
      headerName: '表示名', 
      field: 'displayName', 
      sortable: true, 
      filter: true, 
      flex: 1 
    },
    { 
      headerName: '説明', 
      field: 'description', 
      sortable: true, 
      filter: true, 
      flex: 2 
    },
    { 
      headerName: '表示順', 
      field: 'sortOrder', 
      sortable: true, 
      filter: true, 
      width: 100 
    },
    { 
      headerName: '状態', 
      field: 'isActive', 
      sortable: true, 
      filter: true, 
      width: 100,
      cellRenderer: (params: any) => {
        return params.value 
          ? '<span class="px-2 py-1 rounded-full text-xs bg-green-200 text-green-800">有効</span>' 
          : '<span class="px-2 py-1 rounded-full text-xs bg-red-200 text-red-800">無効</span>';
      }
    },
    { 
      headerName: '操作', 
      field: 'id', 
      sortable: false, 
      filter: false, 
      width: 150,
      cellRenderer: (params: any) => {
        return `
          <div class="flex space-x-2">
            <button class="edit-btn px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">編集</button>
            <button class="delete-btn px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">削除</button>
          </div>
        `;
      },
      cellRendererParams: {
        clicked: function(field: string) {
          alert(`${field} was clicked`);
        }
      },
      onCellClicked: (params: any) => {
        const { event } = params;
        const target = event.target as HTMLElement;
        
        if (target.classList.contains('edit-btn')) {
          handleEdit(params.data);
        } else if (target.classList.contains('delete-btn')) {
          handleDelete(params.data.id);
        }
      }
    }
  ];
  
  // マスターデータタイプの取得
  useEffect(() => {
    const fetchMasterDataTypes = async () => {
      try {
        setLoading(true);
        const types = await masterDataService.getMasterDataTypes();
        setMasterDataTypes(types);
        
        if (types.length > 0) {
          setSelectedType(types[0]);
          fetchMasterDataByType(types[0]);
        } else {
          setLoading(false);
        }
      } catch (err: any) {
        setError('マスターデータタイプの取得に失敗しました: ' + (err.message || '不明なエラー'));
        setLoading(false);
      }
    };
    
    fetchMasterDataTypes();
  }, []);
  
  // 選択されたタイプのマスターデータを取得
  const fetchMasterDataByType = async (type: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await masterDataService.getMasterDataByType(type);
      setMasterData(data);
      
      setLoading(false);
    } catch (err: any) {
      setError('マスターデータの取得に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };
  
  // タイプ選択変更ハンドラー
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setSelectedType(type);
    fetchMasterDataByType(type);
  };
  
  // 新規作成ボタンハンドラー
  const handleCreate = () => {
    setModalMode('create');
    setCurrentItem(null);
    setFormData({
      name: '',
      displayName: '',
      description: '',
      sortOrder: 0,
      isActive: true
    });
    setShowModal(true);
  };
  
  // 編集ボタンハンドラー
  const handleEdit = (item: any) => {
    setModalMode('edit');
    setCurrentItem(item);
    setFormData({
      name: item.name,
      displayName: item.displayName,
      description: item.description,
      sortOrder: item.sortOrder,
      isActive: item.isActive
    });
    setShowModal(true);
  };
  
  // 削除ボタンハンドラー
  const handleDelete = async (id: string) => {
    if (!window.confirm('このマスターデータを削除してもよろしいですか？')) {
      return;
    }
    
    try {
      setLoading(true);
      await masterDataService.deleteMasterData(id);
      
      // 再取得
      await fetchMasterDataByType(selectedType);
      
      setSuccess('マスターデータを削除しました');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('マスターデータの削除に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };
  
  // フォーム入力変更ハンドラー
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  
  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (modalMode === 'create') {
        await masterDataService.createMasterData(selectedType, formData);
        setSuccess('マスターデータを作成しました');
      } else {
        await masterDataService.updateMasterData(currentItem.id, formData);
        setSuccess('マスターデータを更新しました');
      }
      
      setShowModal(false);
      
      // 再取得
      await fetchMasterDataByType(selectedType);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('マスターデータの保存に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };
  
  // モーダルを閉じるハンドラー
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  // 新しいマスターデータタイプを作成するハンドラー
  const handleCreateNewType = async () => {
    const typeName = prompt('新しいマスターデータタイプの名前を入力してください');
    
    if (!typeName) return;
    
    try {
      setLoading(true);
      await masterDataService.createMasterDataType(typeName);
      
      // マスターデータタイプを再取得
      const types = await masterDataService.getMasterDataTypes();
      setMasterDataTypes(types);
      
      // 新しいタイプを選択
      setSelectedType(typeName);
      fetchMasterDataByType(typeName);
      
      setSuccess('新しいマスターデータタイプを作成しました');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('マスターデータタイプの作成に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">マスターデータ管理</h1>
      
      {error && <Alert type="error" message={error} className="mb-4" />}
      {success && <Alert type="success" message={success} className="mb-4" />}
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex-1 min-w-[300px]">
            <Select
              label="マスターデータタイプ"
              name="dataType"
              value={selectedType}
              onChange={handleTypeChange}
              options={masterDataTypes.map(type => ({
                value: type,
                label: type
              }))}
            />
          </div>
          
          <div className="flex space-x-2">
            {user?.role === 'admin' && (
              <>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleCreate}
                  disabled={loading || !selectedType}
                >
                  新規作成
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCreateNewType}
                  disabled={loading}
                >
                  新規タイプ作成
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            {selectedType ? `${selectedType} - ${masterData.length}件` : 'マスターデータ'}
          </h2>
        </div>
        
        <div className="ag-theme-alpine w-full" style={{ height: '600px' }}>
          <AgGridReact
            rowData={masterData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            domLayout="autoHeight"
          />
        </div>
      </div>
      
      {/* マスターデータ編集モーダル */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={modalMode === 'create' ? 'マスターデータ新規作成' : 'マスターデータ編集'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="名前"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
            
            <Input
              label="表示名"
              name="displayName"
              value={formData.displayName}
              onChange={handleFormChange}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            
            <Input
              label="表示順"
              name="sortOrder"
              type="number"
              value={formData.sortOrder.toString()}
              onChange={handleFormChange}
              required
            />
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleFormChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                有効
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MasterData;
