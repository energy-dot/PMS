import React, { useState, useEffect, useCallback } from 'react';
import { ColDef, ValueGetterParams, ValueSetterParams } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import DataGrid from '../components/grids/DataGrid';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import DepartmentSectionFilter from '../components/filters/DepartmentSectionFilter';
import projectService, { Project } from '../services/projectService';
import departmentService from '../services/departmentService';
import { DateEditor, SelectEditor, TagEditor, NumberEditor } from '../components/grids/editors';

// UpdateProjectDtoの型定義
export interface UpdateProjectDto extends Partial<Project> {}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [departmentsMap, setDepartmentsMap] = useState<Record<string, string>>({});
  const [sectionsMap, setSectionsMap] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // ステータスの選択肢と表示用のスタイル
  const statusOptions = ['募集中', '選考中', '充足', '承認待ち', '差し戻し', '終了'];
  const statusClassMap: Record<string, string> = {
    '募集中': 'bg-green-100 text-green-800',
    '選考中': 'bg-blue-100 text-blue-800',
    '充足': 'bg-purple-100 text-purple-800',
    '承認待ち': 'bg-yellow-100 text-yellow-800',
    '差し戻し': 'bg-red-100 text-red-800',
    '終了': 'bg-gray-100 text-gray-800',
  };

  // 事業部/部署のマスタデータを取得
  useEffect(() => {
    const fetchDepartmentsAndSections = async () => {
      try {
        const departments = await departmentService.getDepartmentsWithSections();
        
        // 事業部IDから名前への変換マップを作成
        const deptMap: Record<string, string> = {};
        departments.forEach(dept => {
          deptMap[dept.id] = dept.name;
        });
        setDepartmentsMap(deptMap);
        
        // 部IDから名前への変換マップを作成
        const sectMap: Record<string, string> = {};
        departments.forEach(dept => {
          if (dept.sections) {
            dept.sections.forEach(section => {
              sectMap[section.id] = section.name;
            });
          }
        });
        setSectionsMap(sectMap);
      } catch (err) {
        console.error('Failed to fetch departments and sections:', err);
      }
    };
    
    fetchDepartmentsAndSections();
  }, []);

  // 案件データ取得
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      if (selectedSectionId) {
        // セクションでフィルタリング
        data = await projectService.searchProjects({ sectionId: selectedSectionId });
      } else if (selectedDepartmentId) {
        // 事業部でフィルタリング
        data = await projectService.searchProjects({ departmentId: selectedDepartmentId });
      } else {
        // 全件取得
        data = await projectService.getAllProjects();
      }
      setProjects(data);
    } catch (err: any) {
      setError(err.response?.data?.message || '案件データの取得に失敗しました');
      console.error('Failed to fetch projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDepartmentId, selectedSectionId]);

  // 初回読み込み時とフィルター変更時にデータ取得
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // 検索機能
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchProjects();
      return;
    }

    // クライアントサイドフィルタリング（本来はAPIでの検索が望ましい）
    const filteredProjects = projects.filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (project.department && project.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setProjects(filteredProjects);
  };

  // 新規登録画面へ遷移
  const handleCreateProject = () => {
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
    // 現在の日付
    const today = new Date();
    // 3ヶ月後の日付
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(today.getMonth() + 3);
    
    // 新規案件データの作成
    const newProject: any = {
      id: `new-${Date.now()}`,
      name: '新規案件',
      department: '未設定',
      departmentId: null,
      sectionId: null,
      startDate: today,
      endDate: threeMonthsLater,
      status: '承認待ち',
      isRemote: false,
      isNew: true, // 新規行フラグ
    };
    
    // 新規行を追加
    setProjects(prev => [newProject, ...prev]);
  };

  // 詳細画面へ遷移
  const handleViewProject = (id: string) => {
    // 編集モードの時は遷移させない（DataGridコンポーネントの変更で対応済み）
    navigate(`/projects/${id}`);
  };

  // 削除処理
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('この案件を削除してもよろしいですか？')) {
      return;
    }

    setIsLoading(true);
    try {
      await projectService.deleteProject(id);
      // 削除後、リストを更新
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
    } catch (err: any) {
      setError(err.response?.data?.message || '削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
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
        const promises = params.modifiedRows.map((row: Project) => {
          const updateData: UpdateProjectDto = { ...row };
          
          // データクリーニング
          delete updateData._modified; // 変更追跡用プロパティを削除
          
          // startDateとendDateが文字列の場合、Dateオブジェクトに変換
          if (updateData.startDate && !(updateData.startDate instanceof Date)) {
            updateData.startDate = new Date(updateData.startDate);
          }
          
          if (updateData.endDate && !(updateData.endDate instanceof Date)) {
            updateData.endDate = new Date(updateData.endDate);
          }

          // departmentIdとsectionIdがUUID形式でない場合はnullに設定
          // マイグレーションで追加されたデータは文字列の数値("1", "2"など)になっているので、
          // 新規保存・更新時にはnullに設定してバリデーションエラーを回避
          if (updateData.departmentId !== null && updateData.departmentId !== undefined) {
            if (typeof updateData.departmentId === 'string') {
              const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(updateData.departmentId);
              if (!isUUID) {
                updateData.departmentId = null;
              }
            } else {
              // 文字列以外の場合もnullに設定
              updateData.departmentId = null;
            }
          }
          
          if (updateData.sectionId !== null && updateData.sectionId !== undefined) {
            if (typeof updateData.sectionId === 'string') {
              const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(updateData.sectionId);
              if (!isUUID) {
                updateData.sectionId = null;
              }
            } else {
              // 文字列以外の場合もnullに設定
              updateData.sectionId = null;
            }
          }

          // 必須フィールドの確認と設定
          if (!updateData.name) updateData.name = "新規案件";
          if (!updateData.department) updateData.department = "未設定";
          if (!updateData.startDate) updateData.startDate = new Date();
          if (!updateData.endDate) updateData.endDate = new Date(new Date().setMonth(new Date().getMonth() + 3)); // デフォルト3ヶ月
          
          // 新規行の場合
          if (row.isNew) {
            delete updateData.isNew;
            delete updateData.id;
            return projectService.createProject(updateData);
          } else {
            // 既存行の更新
            return projectService.updateProject(row.id, updateData);
          }
        });
        
        await Promise.all(promises);
        
        // データ再取得
        fetchProjects();
        
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
  const handleRowDeleted = async (data: Project): Promise<boolean> => {
    // 新規行の場合は単に画面から消すだけ
    if (data.isNew) {
      return true;
    }
    
    try {
      // 既存データの場合はAPIで削除
      await projectService.deleteProject(data.id);
      return true;
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError('削除に失敗しました');
      return false;
    }
  };

  // 日付を表示用にフォーマット
  const formatDate = (date: Date | string): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // 事業部・部のIDを名前に変換
  const getDepartmentName = (departmentId: string | null): string => {
    if (!departmentId) return '';
    return departmentsMap[departmentId] || '';
  };
  
  const getSectionName = (sectionId: string | null): string => {
    if (!sectionId) return '';
    return sectionsMap[sectionId] || '';
  };

  // 特定の事業部に属するセクションのIDを取得
  const getSectionsByDepartment = (departmentId: string): string[] => {
    if (!departmentId) return [];
    
    try {
      // departmentService.getSectionsFromCacheからフィルタリング
      return departmentService.getSectionsFromCache()
        .filter(section => section.departmentId === departmentId)
        .map(section => section.id);
    } catch (error) {
      console.error('Failed to get sections by department:', error);
      return [];
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

  // 案件データ用列定義
  const columnDefs: ColDef<Project>[] = [
    { 
      field: 'name', 
      headerName: '案件名', 
      flex: 1,
      editable: true,
      minWidth: 180,
      cellStyle: { textOverflow: 'ellipsis' },
    },
    { 
      field: 'department', 
      headerName: '部署（従来）', 
      width: 150,
      editable: true,
    },
    {
      field: 'departmentId',
      headerName: '事業部',
      width: 150,
      editable: true,
      cellEditor: SelectEditor,
      cellEditorParams: {
        values: Object.keys(departmentsMap),
        valueLabels: departmentsMap,
        allowEmpty: true,
        emptyText: '選択してください'
      },
      valueFormatter: (params) => getDepartmentName(params.value),
      valueGetter: (params) => params.data?.departmentId || null,
      valueSetter: (params: ValueSetterParams) => {
        const newValue = params.newValue;
        params.data.departmentId = newValue;
        
        // 事業部が変更された場合、セクションをクリア
        if (params.data.departmentId !== newValue) {
          params.data.sectionId = null;
        }
        
        return true;
      }
    },
    {
      field: 'sectionId',
      headerName: '部',
      width: 150,
      editable: true,
      cellEditor: SelectEditor,
      cellEditorParams: (params) => {
        // 選択中の事業部に所属する部のみを選択肢に表示
        const departmentId = params.data.departmentId;
        if (!departmentId) return { values: [] };
        
        // 事業部に紐づく部のIDリスト
        const filteredSectionIds = getSectionsByDepartment(departmentId);
        
        // 選択肢とラベルのマッピングを作成
        const filteredSectionLabels: Record<string, string> = {};
        filteredSectionIds.forEach(id => {
          filteredSectionLabels[id] = sectionsMap[id] || '';
        });
        
        return { 
          values: filteredSectionIds,
          valueLabels: filteredSectionLabels,
          allowEmpty: true,
          emptyText: '選択してください'
        };
      },
      valueFormatter: (params) => getSectionName(params.value),
    },
    { 
      field: 'startDate', 
      headerName: '開始日', 
      width: 120,
      editable: true,
      cellEditor: DateEditor,
      valueFormatter: (params) => formatDate(params.value),
    },
    { 
      field: 'endDate', 
      headerName: '終了日', 
      width: 120,
      editable: true,
      cellEditor: DateEditor,
      valueFormatter: (params) => formatDate(params.value),
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
      cellRenderer: (params: import('ag-grid-community').ICellRendererParams<Project>) => {
        const status = params.value;
        if (!status) return null;
        
        const className = `px-2 py-1 rounded-full text-xs font-medium ${statusClassMap[status] || 'bg-gray-100 text-gray-800'}`;
        
        return <span className={className}>{status}</span>;
      }
    },
    { 
      field: 'requiredNumber', 
      headerName: '募集人数', 
      width: 110,
      editable: true,
      cellEditor: NumberEditor,
      cellEditorParams: {
        min: 1,
        max: 100,
        step: 1,
        allowDecimals: false
      },
      valueFormatter: (params) => params.value || '-'
    },
    { 
      field: 'budget', 
      headerName: '想定単価', 
      width: 150,
      editable: true,
      cellEditor: NumberEditor,
      cellEditorParams: {
        min: 0,
        step: 10000,
        currency: true,
        currencySymbol: '¥',
        useThousandSeparator: true
      },
      valueFormatter: (params) => {
        if (!params.value) return '-';
        
        // 数値型の場合はフォーマット
        if (typeof params.value === 'number') {
          return new Intl.NumberFormat('ja-JP', { 
            style: 'currency', 
            currency: 'JPY',
            maximumFractionDigits: 0
          }).format(params.value);
        }
        
        return params.value;
      }
    },
    {
      field: 'requiredSkills',
      headerName: '必須スキル',
      width: 200,
      editable: true,
      cellEditor: TagEditor,
      cellEditorParams: {
        availableTags: skillOptions,
        delimiter: ',',
        maxTags: 10
      },
      valueFormatter: (params) => params.value || '-',
      cellStyle: { overflow: 'hidden', textOverflow: 'ellipsis' }
    },
    { 
      headerName: '操作', 
      width: 100,
      editable: false,
      cellRenderer: (params: import('ag-grid-community').ICellRendererParams<Project>) => {
        const id = params.data?.id || '';
        // 新規行の場合は操作ボタンを非表示
        if (params.data?.isNew) return null;
        
        return (
          <div>
            <button 
              className="action-button px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 focus:outline-none" 
              onClick={() => handleViewProject(id)}
              disabled={isEditable}
            >
              詳細
            </button>
          </div>
        );
      }
    }
  ];

  // APIがまだ整備されていない場合のフォールバックデータ
  const fallbackData: Project[] = [
    { 
      id: '1', 
      name: 'Javaエンジニア募集', 
      department: '開発1部', 
      departmentId: null,
      sectionId: null,
      description: 'ECサイト開発のためのJavaエンジニアを募集します',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-10-31'),
      status: '募集中',
      requiredSkills: 'Java, Spring Boot, MySQL',
      requiredExperience: 'Javaでの開発経験3年以上',
      requiredNumber: 2,
      budget: '700,000〜850,000円',
      location: '東京都中央区',
      workingHours: '9:30〜18:30',
      isRemote: true,
      remarks: '',
      createdAt: new Date('2025-04-01'),
      updatedAt: new Date('2025-04-01')
    },
    { 
      id: '2', 
      name: 'インフラエンジニア', 
      department: '基盤開発部', 
      departmentId: null,
      sectionId: null,
      description: 'クラウドインフラ構築・運用のエンジニアを募集します',
      startDate: new Date('2025-05-15'),
      endDate: new Date('2025-11-30'),
      status: '選考中',
      requiredSkills: 'AWS, Docker, Kubernetes',
      requiredExperience: 'AWSでの構築経験2年以上',
      requiredNumber: 1,
      budget: '800,000〜900,000円',
      location: '東京都港区',
      workingHours: '9:00〜18:00',
      isRemote: true,
      remarks: '',
      createdAt: new Date('2025-04-05'),
      updatedAt: new Date('2025-04-10')
    },
    { 
      id: '3', 
      name: 'フロントエンドエンジニア', 
      department: '開発2部', 
      departmentId: null,
      sectionId: null,
      description: 'SPAフロントエンド開発のエンジニアを募集します',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-09-30'),
      status: '承認待ち',
      requiredSkills: 'React, TypeScript, GraphQL',
      requiredExperience: 'SPAフレームワークでの開発経験2年以上',
      requiredNumber: 1,
      budget: '750,000〜850,000円',
      location: '東京都新宿区',
      workingHours: '10:00〜19:00',
      isRemote: true,
      remarks: '',
      createdAt: new Date('2025-04-12'),
      updatedAt: new Date('2025-04-12')
    },
  ];

  // 表示用のデータ（APIから取得したデータがない場合はフォールバックデータを使用）
  const displayProjects = projects.length > 0 ? projects : fallbackData;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">案件一覧</h1>
      </div>
      
      {error && <Alert variant="error" message={error} onClose={() => setError(null)} />}
      
      <div className="card p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* 検索ボックス */}
          <div className="w-full md:w-1/3">
            <Input 
              label="キーワード検索"
              placeholder="案件名で検索" 
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
        title="案件一覧"
        rowData={displayProjects}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        onRowClick={handleViewProject}
        actionButtons={[
          {
            label: isEditable ? '編集モード終了' : '編集モード',
            onClick: toggleEditMode,
            variant: isEditable ? 'warning' : 'primary',
          },
          {
            label: '新規登録',
            onClick: handleCreateProject,
            variant: 'success',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )
          }
        ]}
        exportOptions={{
          fileName: '案件一覧',
        }}
        loading={isLoading}
        error={error}
        editable={isEditable}
        onCellValueChanged={handleCellValueChanged}
        onRowDeleted={handleRowDeleted}
        height={600}
        rowSelection={isEditable ? 'multiple' : 'single'}
      />

      {/* エクセルライクなグリッド表示のためのカスタムCSS */}
      <style jsx global>{`
        /* ステータス表示用の基本スタイル */
        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          display: inline-block;
          line-height: 1;
        }

        /* AG-Grid用のカスタムスタイル */
        .ag-theme-alpine .ag-header {
          font-weight: bold;
        }

        .ag-theme-alpine .ag-header-cell-label {
          justify-content: center;
        }

        /* 編集モード時のセルスタイル */
        .ag-theme-alpine-edit-mode .ag-cell {
          transition: all 0.2s;
        }

        .ag-theme-alpine-edit-mode .ag-cell-editable:hover {
          background-color: rgba(240, 248, 255, 0.6);
          box-shadow: inset 0 0 0 1px #4299e1;
        }

        /* 編集中のセルスタイル */
        .ag-theme-alpine-edit-mode .ag-cell-focus.ag-cell-inline-editing {
          padding: 0 !important;
          height: 100% !important;
        }

        /* タグ表示用スタイル */
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

export default ProjectList;