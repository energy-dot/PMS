import React, { useState, useEffect, useMemo } from 'react';
import DataGrid from '../components/grids/DataGrid';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Alert from '../components/common/Alert';
import partnerService, { Partner } from '../services/partnerService';
import { useNavigate } from 'react-router-dom';
import { ColDef } from 'ag-grid-community';
import { DateEditor, SelectEditor, NumberEditor } from '../components/grids/editors';

const PartnerList: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  // ステータスの選択肢
  const statusOptions = ['取引中', '取引停止', '候補', '検討中', '交渉中'];
  
  // ステータスごとの表示スタイル
  const statusStyles: Record<string, { variant: string, className: string }> = {
    '取引中': { variant: 'success', className: 'bg-green-100 text-green-800' },
    '取引停止': { variant: 'danger', className: 'bg-red-100 text-red-800' },
    '候補': { variant: 'warning', className: 'bg-yellow-100 text-yellow-800' },
    '検討中': { variant: 'info', className: 'bg-blue-100 text-blue-800' },
    '交渉中': { variant: 'primary', className: 'bg-purple-100 text-purple-800' }
  };

  // パートナー会社データ取得
  useEffect(() => {
    const fetchPartners = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await partnerService.getPartners();
        setPartners(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'パートナー会社の取得に失敗しました');
        console.error('Failed to fetch partners:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // 新規登録画面へ遷移
  const handleCreatePartner = () => {
    // 編集モードの時は確認ダイアログ
    if (isEditable) {
      if (window.confirm('編集モードを終了して新規登録しますか？')) {
        setIsEditable(false);
        handleAddNewRow();
      }
    } else {
      // 編集モードを有効にして新規行を追加
      setIsEditable(true);
      setTimeout(() => {
        handleAddNewRow();
      }, 100);
    }
  };

  // グリッドに新規行を追加
  const handleAddNewRow = () => {
    // 新規パートナー会社データの作成
    const newPartner: any = {
      id: `new-${Date.now()}`,
      name: '新規パートナー会社',
      address: '東京都',
      phone: '03-xxxx-xxxx',
      status: '候補',
      isNew: true, // 新規行フラグ
    };
    
    // 新規行を追加
    setPartners(prev => [newPartner, ...prev]);
  };

  // 詳細画面へ遷移
  const handleViewPartner = (id: string) => {
    navigate(`/partners/${id}`);
  };

  // 編集モードの切り替え
  const toggleEditMode = () => {
    setIsEditable(!isEditable);
  };

  // セル編集時の処理
  const handleCellValueChanged = async (params: any) => {
    // 一括保存の場合
    if (params.type === 'saveAll') {
      setIsLoading(true);
      try {
        const promises = params.modifiedRows.map((row: Partner) => {
          const updateData = { ...row };
          
          // データクリーニング
          delete updateData._modified; // 変更追跡用プロパティを削除
          
          // 日付フィールドの処理（foundedDateなど）
          if (updateData.foundedDate && !(updateData.foundedDate instanceof Date)) {
            updateData.foundedDate = new Date(updateData.foundedDate);
          }
          
          if (updateData.antisocialCheckDate && !(updateData.antisocialCheckDate instanceof Date)) {
            updateData.antisocialCheckDate = new Date(updateData.antisocialCheckDate);
          }
          
          if (updateData.creditCheckDate && !(updateData.creditCheckDate instanceof Date)) {
            updateData.creditCheckDate = new Date(updateData.creditCheckDate);
          }
          
          // 必須フィールドの確認と設定
          if (!updateData.name) updateData.name = "新規パートナー会社";
          if (!updateData.address) updateData.address = "住所未設定";
          if (!updateData.phone) updateData.phone = "電話番号未設定";
          if (!updateData.status) updateData.status = "候補";
          
          // 新規行の場合
          if (row.isNew) {
            delete updateData.isNew;
            delete updateData.id;
            return partnerService.createPartner(updateData);
          } else {
            // 既存行の更新
            return partnerService.updatePartner(row.id, updateData);
          }
        });
        
        await Promise.all(promises);
        
        // データ再取得
        const data = await partnerService.getPartners();
        setPartners(data);
        
        // 成功メッセージを表示
        alert('変更を保存しました');
      } catch (err: any) {
        setError(err.response?.data?.message || '変更の保存に失敗しました');
        console.error('Save error details:', err);
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // 単一セル編集のハンドリング（即時保存しない場合）
    console.log('Cell value changed:', params);
  };

  // 行削除時のハンドラ
  const handleRowDeleted = async (data: Partner): Promise<boolean> => {
    // 新規行の場合は単に画面から消すだけ
    if (data.isNew) {
      return true;
    }
    
    try {
      // 既存データの場合はAPIで削除
      await partnerService.deletePartner(data.id);
      return true;
    } catch (err) {
      console.error('Failed to delete partner:', err);
      setError('削除に失敗しました');
      return false;
    }
  };

  // パートナー会社データ列定義
  const columnDefs = useMemo<ColDef<Partner>[]>(() => [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
      cellStyle: { textAlign: 'center' },
      editable: false, // IDは編集不可
    },
    { 
      field: 'name', 
      headerName: '会社名', 
      flex: 2,
      minWidth: 180,
      editable: true,
      cellRenderer: (params: any) => {
        if (isEditable) {
          return params.value;
        }
        return (
          <span className="text-primary-600 hover:text-primary-800 hover:underline cursor-pointer font-medium">
            {params.value}
          </span>
        );
      }
    },
    { 
      field: 'address', 
      headerName: '所在地', 
      flex: 2,
      minWidth: 200,
      editable: true 
    },
    { 
      field: 'phone', 
      headerName: '電話番号', 
      width: 150,
      editable: true 
    },
    // 以下は追加フィールド（パートナーエンティティに存在する場合は追加）
    { 
      field: 'email', 
      headerName: 'メールアドレス', 
      width: 180,
      editable: true 
    },
    { 
      field: 'website', 
      headerName: 'Webサイト', 
      width: 180,
      editable: true 
    },
    { 
      field: 'foundedDate', 
      headerName: '設立日', 
      width: 120,
      editable: true,
      cellEditor: DateEditor,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const d = new Date(params.value);
        return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
      }
    },
    { 
      field: 'status', 
      headerName: 'ステータス', 
      width: 120,
      editable: true,
      cellEditor: SelectEditor,
      cellEditorParams: {
        values: statusOptions,
        allowEmpty: false,
      },
      cellRenderer: (params: any) => {
        const status = params.value;
        if (!status) return null;
        
        // デフォルトスタイル
        let style = statusStyles[status] || { variant: 'default', className: 'bg-gray-100 text-gray-800' };
        
        if (isEditable) {
          return status;
        } else {
          return <Badge variant={style.variant}>{status}</Badge>;
        }
      }
    },
    { 
      headerName: '操作', 
      width: 100,
      editable: false,
      cellRenderer: (params: any) => {
        const id = params.data?.id || '';
        
        // 新規行の場合や編集モードの場合は操作ボタンを非表示
        if (params.data?.isNew || isEditable) return null;
        
        return (
          <div>
            <button 
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 focus:outline-none"
              onClick={() => handleViewPartner(id)}
            >
              詳細
            </button>
          </div>
        );
      },
      cellStyle: { textAlign: 'center' }
    }
  ], [isEditable]);

  // APIがまだ整備されていない場合のフォールバックデータ
  const fallbackData: Partner[] = [
    { id: '1', name: '株式会社テクノソリューション', address: '東京都渋谷区神宮前5-52-2', phone: '03-1234-5678', status: '取引中' },
    { id: '2', name: 'デジタルイノベーション株式会社', address: '東京都新宿区西新宿2-8-1', phone: '03-8765-4321', status: '取引中' },
    { id: '3', name: '株式会社ITプロフェッショナル', address: '東京都千代田区丸の内1-9-1', phone: '03-2345-6789', status: '取引停止' },
    { id: '4', name: 'サイバーテック株式会社', address: '大阪府大阪市北区梅田3-1-3', phone: '06-1234-5678', status: '取引中' },
    { id: '5', name: '株式会社システムクリエイト', address: '福岡県福岡市博多区博多駅前2-1-1', phone: '092-123-4567', status: '候補' },
  ];

  // 表示用のデータ（APIから取得したデータがない場合はフォールバックデータを使用）
  const displayPartners = partners.length > 0 ? partners : fallbackData;

  // 行クリック時のハンドラ
  const handleRowClick = (data: any) => {
    if (!isEditable) {
      navigate(`/partners/${data.id}`);
    }
  };

  // アクションボタン定義
  const actionButtons = [
    {
      label: isEditable ? '編集モード終了' : '編集モード',
      onClick: toggleEditMode,
      variant: isEditable ? 'warning' : 'primary',
    },
    {
      label: '新規登録',
      onClick: handleCreatePartner,
      variant: 'success' as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <div>
      <DataGrid
        title="パートナー会社一覧"
        rowData={displayPartners}
        columnDefs={columnDefs}
        actionButtons={actionButtons}
        onRowClick={handleRowClick}
        loading={isLoading}
        error={error}
        exportOptions={{
          fileName: 'パートナー会社一覧',
          sheetName: 'パートナー会社'
        }}
        height={600}
        rowSelection={isEditable ? 'multiple' : 'single'}
        editable={isEditable}
        onCellValueChanged={handleCellValueChanged}
        onRowDeleted={handleRowDeleted}
      />

      {/* エクセルライクなグリッド表示のためのカスタムCSS */}
      <style jsx global>{`
        /* 編集モード時のセルスタイル強化 */
        .ag-theme-alpine-edit-mode .ag-cell-editable {
          background-color: rgba(240, 248, 255, 0.2);
        }

        /* 編集モード時のホバースタイル */
        .ag-theme-alpine-edit-mode .ag-cell-editable:hover {
          background-color: rgba(224, 242, 254, 0.5);
          box-shadow: inset 0 0 0 1px #4299e1;
        }

        /* 新規行のスタイル強化 */
        .ag-row-new {
          background-color: rgba(240, 255, 240, 0.4) !important;
        }

        /* 変更行のスタイル強化 */
        .ag-row-modified {
          background-color: rgba(255, 255, 224, 0.4) !important;
        }
      `}</style>
    </div>
  );
};

export default PartnerList;