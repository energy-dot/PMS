import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ColDef } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import DataGrid from '../components/grids/DataGrid';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import staffService, { Staff, UpdateStaffDto } from '../services/staffService';
import partnerService from '../services/partnerService';
import DepartmentSectionFilter from '../components/filters/DepartmentSectionFilter';
import { DateEditor, SelectEditor, NumberEditor, TagEditor } from '../components/grids/editors';

const StaffList: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [partners, setPartners] = useState<{id: string, name: string}[]>([]);
  const navigate = useNavigate();

  // ステータスの選択肢
  const statusOptions = ['稼働中', '待機中', '契約終了', '選考中', '予約済み'];
  
  // ステータスごとの表示スタイル
  const statusStyles: Record<string, { variant: string, className: string }> = {
    '稼働中': { variant: 'success', className: 'bg-green-100 text-green-800' },
    '待機中': { variant: 'warning', className: 'bg-yellow-100 text-yellow-800' },
    '契約終了': { variant: 'danger', className: 'bg-red-100 text-red-800' },
    '選考中': { variant: 'info', className: 'bg-blue-100 text-blue-800' },
    '予約済み': { variant: 'primary', className: 'bg-purple-100 text-purple-800' }
  };

  // パートナー会社データ取得
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await partnerService.getPartners();
        const partnerOptions = data.map(partner => ({
          id: partner.id,
          name: partner.name
        }));
        setPartners(partnerOptions);
      } catch (err) {
        console.error('Failed to fetch partners:', err);
      }
    };

    fetchPartners();
  }, []);

  // 要員データ取得
  const fetchStaffList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      
      // 事業部・部でフィルタリング（APIがサポートしている場合）
      if (selectedSectionId) {
        // 部でフィルタリング
        data = await staffService.getStaffBySection(selectedSectionId);
      } else if (selectedDepartmentId) {
        // 事業部でフィルタリング
        data = await staffService.getStaffByDepartment(selectedDepartmentId);
      } else {
        // 全件取得
        data = await staffService.getAllStaff();
      }
      
      setStaffList(data);
    } catch (err: any) {
      setError(err.response?.data?.message || '要員データの取得に失敗しました');
      console.error('Failed to fetch staff:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDepartmentId, selectedSectionId]);

  // 初回読み込み時とフィルター変更時にデータ取得
  useEffect(() => {
    fetchStaffList();
  }, [fetchStaffList]);

  // 検索機能
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchStaffList();
      return;
    }

    // クライアントサイドフィルタリング（開発用）
    const filteredStaff = staffList.filter(staff => 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (staff.partner && staff.partner.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (staff.skills && staff.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );
    setStaffList(filteredStaff);
  };

  // 新規登録機能
  const handleCreateStaff = () => {
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
    // デフォルトパートナーID（存在する場合）
    const defaultPartnerId = partners.length > 0 ? partners[0].id : null;
    const defaultPartnerName = partners.length > 0 ? partners[0].name : '';
    
    // 新規要員データの作成
    const newStaff: any = {
      id: `new-${Date.now()}`,
      name: '新規要員',
      partner: defaultPartnerId ? {
        id: defaultPartnerId,
        name: defaultPartnerName
      } : null,
      skills: [],
      experience: 0,
      status: '待機中',
      isNew: true, // 新規行フラグ
    };
    
    // 新規行を追加
    setStaffList(prev => [newStaff, ...prev]);
  };

  // 詳細画面へ遷移
  const handleViewStaff = (id: string) => {
    navigate(`/staff/${id}`);
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
        const promises = params.modifiedRows.map((row: Staff) => {
          const updateData: UpdateStaffDto = { ...row };
          
          // データクリーニング
          delete updateData._modified; // 変更追跡用プロパティを削除
          
          // パートナーの扱い
          if (updateData.partner && typeof updateData.partner === 'object') {
            updateData.partnerId = updateData.partner.id;
            delete updateData.partner;
          }
          
          // スキルの配列処理
          if (typeof updateData.skills === 'string') {
            updateData.skills = updateData.skills.split(',').map(s => s.trim()).filter(Boolean);
          }
          
          // 必須フィールドの確認と設定
          if (!updateData.name) updateData.name = "新規要員";
          if (!updateData.status) updateData.status = "待機中";
          
          // 生年月日がDateオブジェクトでない場合の変換
          if (updateData.birthDate && !(updateData.birthDate instanceof Date)) {
            updateData.birthDate = new Date(updateData.birthDate);
          }
          
          // 新規行の場合
          if (row.isNew) {
            delete updateData.isNew;
            delete updateData.id;
            return staffService.createStaff(updateData);
          } else {
            // 既存行の更新
            return staffService.updateStaff(row.id, updateData);
          }
        });
        
        await Promise.all(promises);
        
        // データ再取得
        await fetchStaffList();
        
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
  const handleRowDeleted = async (data: Staff): Promise<boolean> => {
    // 新規行の場合は単に画面から消すだけ
    if (data.isNew) {
      return true;
    }
    
    try {
      // 既存データの場合はAPIで削除
      await staffService.deleteStaff(data.id);
      return true;
    } catch (err) {
      console.error('Failed to delete staff:', err);
      setError('削除に失敗しました');
      return false;
    }
  };

  // スキルの選択肢（実際のシステムではマスタデータから取得）
  const skillOptions = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 
    'Node.js', 'Java', 'C#', 'Python', 'PHP', 'Ruby', 'Go',
    'MongoDB', 'MySQL', 'PostgreSQL', 'Oracle', 'SQL Server',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'HTML', 'CSS', 'SCSS', 'Git', 'DevOps'
  ];

  // 要員データの列定義
  const columnDefs = useMemo<ColDef<Staff>[]>(() => [
    { 
      field: 'name', 
      headerName: '氏名', 
      minWidth: 150,
      editable: true
    },
    { 
      field: 'partner.id', 
      headerName: '所属会社', 
      minWidth: 180,
      editable: true,
      cellEditor: SelectEditor,
      cellEditorParams: {
        values: partners.map(p => p.id),
        valueLabels: partners.reduce((acc, p) => ({ ...acc, [p.id]: p.name }), {})
      },
      valueGetter: (params) => params.data?.partner?.id || null,
      valueSetter: (params) => {
        const partnerId = params.newValue;
        const partnerName = partners.find(p => p.id === partnerId)?.name || '';
        
        // パートナー情報を更新
        params.data.partner = {
          id: partnerId,
          name: partnerName
        };
        
        return true;
      },
      valueFormatter: (params) => {
        const partnerId = params.value;
        if (!partnerId) return '';
        return partners.find(p => p.id === partnerId)?.name || '';
      }
    },
    { 
      field: 'skills', 
      headerName: 'スキル', 
      minWidth: 200,
      flex: 1,
      editable: true,
      cellEditor: TagEditor,
      cellEditorParams: {
        availableTags: skillOptions,
        delimiter: ','
      },
      valueGetter: (params) => {
        const skills = params.data?.skills;
        return skills && skills.length > 0 ? skills : [];
      },
      valueFormatter: (params) => {
        const skills = params.value;
        return skills && skills.length > 0 ? skills.join(', ') : '';
      },
      cellRenderer: (params) => {
        const skills = params.value;
        if (!skills || skills.length === 0) return null;
        
        if (isEditable) {
          return skills.join(', ');
        } else {
          return (
            <div className="tag-display">
              {skills.map((skill: string, index: number) => (
                <span key={index} className="tag-item">{skill}</span>
              ))}
            </div>
          );
        }
      }
    },
    { 
      field: 'experience', 
      headerName: '経験年数', 
      width: 110,
      editable: true,
      cellEditor: NumberEditor,
      cellEditorParams: {
        min: 0,
        max: 50,
        step: 1,
        allowDecimals: true,
        decimalPlaces: 1
      },
      valueFormatter: (params) => params.value ? `${params.value}年` : '-'
    },
    { 
      field: 'email', 
      headerName: 'メール', 
      minWidth: 180,
      editable: true,
      hide: false // モバイル表示などで非表示にしたい場合はtrueに
    },
    { 
      field: 'phone', 
      headerName: '電話番号', 
      width: 150,
      editable: true,
      hide: false
    },
    { 
      field: 'status', 
      headerName: 'ステータス', 
      width: 120, 
      editable: true,
      cellEditor: SelectEditor,
      cellEditorParams: {
        values: statusOptions,
        allowEmpty: false
      },
      cellRenderer: (params) => {
        const status = params.value;
        if (!status) return null;
        
        if (isEditable) {
          return status;
        } else {
          // デフォルトスタイル
          let style = statusStyles[status] || { variant: 'default', className: 'bg-gray-100 text-gray-800' };
          
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.className}`}>
              {status}
            </span>
          );
        }
      }
    },
    { 
      headerName: '操作', 
      width: 100,
      editable: false,
      cellRenderer: (params) => {
        const id = params.data?.id || '';
        
        // 新規行の場合や編集モードの場合は操作ボタンを非表示
        if (params.data?.isNew || isEditable) return null;
        
        return (
          <div>
            <button 
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 focus:outline-none"
              onClick={() => handleViewStaff(id)}
            >
              詳細
            </button>
          </div>
        );
      }
    }
  ], [partners, isEditable]);

  // APIがまだ整備されていない場合のフォールバックデータ
  const fallbackData: Staff[] = [
    { 
      id: '1', 
      name: '山田 太郎', 
      email: 'yamada@example.com',
      phone: '090-1234-5678',
      status: '稼働中',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      experience: 5,
      partner: { id: '1', name: '株式会社テクノソリューション' },
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-03-20')
    },
    { 
      id: '2', 
      name: '鈴木 一郎', 
      email: 'suzuki@example.com',
      phone: '090-8765-4321',
      status: '待機中',
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: 3,
      partner: { id: '2', name: 'デジタルイノベーション株式会社' },
      createdAt: new Date('2025-02-10'),
      updatedAt: new Date('2025-02-10')
    },
    { 
      id: '3', 
      name: '佐藤 花子', 
      email: 'sato@example.com',
      phone: '090-9876-5432',
      status: '稼働中',
      skills: ['Python', 'Django', 'PostgreSQL'],
      experience: 4,
      partner: { id: '3', name: '株式会社ITプロフェッショナル' },
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-03-15')
    },
  ];

  // 表示用のデータ（APIから取得したデータがない場合はフォールバックデータを使用）
  const displayStaffList = staffList.length > 0 ? staffList : fallbackData;

  // アクションボタン定義
  const actionButtons = [
    {
      label: isEditable ? '編集モード終了' : '編集モード',
      onClick: toggleEditMode,
      variant: isEditable ? 'warning' : 'primary',
    },
    {
      label: '新規登録',
      onClick: handleCreateStaff,
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">要員一覧</h1>
      </div>
      
      {error && <Alert variant="error" message={error} onClose={() => setError(null)} />}
      
      <div className="card p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* 検索ボックス */}
          <div className="w-full md:w-1/3">
            <Input 
              label="キーワード検索"
              placeholder="氏名、会社名、スキルで検索" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* 事業部・部フィルター */}
          <div className="w-full md:w-2/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              事業部・部フィルター
            </label>
            <DepartmentSectionFilter
              selectedDepartmentId={selectedDepartmentId}
              selectedSectionId={selectedSectionId}
              onDepartmentChange={setSelectedDepartmentId}
              onSectionChange={setSelectedSectionId}
              showAllOption={true}
              className="md:flex-row"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSearch}>検索</Button>
        </div>
      </div>
      
      <DataGrid
        title="要員一覧"
        rowData={displayStaffList}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        onRowClick={handleViewStaff}
        actionButtons={actionButtons}
        exportOptions={{
          fileName: '要員一覧',
          sheetName: '要員'
        }}
        loading={isLoading}
        error={error}
        editable={isEditable}
        onCellValueChanged={handleCellValueChanged}
        onRowDeleted={handleRowDeleted}
        height={600}
        rowSelection={isEditable ? 'multiple' : 'single'}
      />

      {/* タグ表示のためのスタイル */}
      <style jsx global>{`
        .tag-display {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        
        .tag-item {
          background-color: rgba(59, 130, 246, 0.1);
          color: rgba(37, 99, 235, 1);
          padding: 0 8px;
          border-radius: 9999px;
          font-size: 0.75rem;
          line-height: 1.5;
          white-space: nowrap;
        }
        
        /* スキルレベル表示 */
        .skill-level {
          display: inline-flex;
          align-items: center;
        }
        
        .skill-star {
          color: gold;
          margin-right: 2px;
        }
        
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

export default StaffList;