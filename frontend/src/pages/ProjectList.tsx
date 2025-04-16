import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataGrid from '../components/grids/DataGrid';
import projectService from '../services/projectService';
import { Project, UpdateProjectDto } from '../shared-types/project';
import '../components/grids/DataGrid.css';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isEditable, setIsEditable] = useState<boolean>(false);

  // 案件一覧の取得
  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.response?.data?.message || '案件の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // DataGridのカラム定義
  const columnDefs = [
    {
      field: 'name',
      headerName: '案件名',
      width: 200,
      editable: true,
    },
    {
      field: 'department.name',
      headerName: '部署',
      width: 150,
      editable: true,
      valueGetter: (params: any) => params.data.department?.name || '',
    },
    {
      field: 'section.name',
      headerName: 'セクション',
      width: 150,
      editable: true,
      valueGetter: (params: any) => params.data.section?.name || '',
    },
    {
      field: 'startDate',
      headerName: '開始日',
      width: 120,
      editable: true,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('ja-JP');
      },
    },
    {
      field: 'endDate',
      headerName: '終了日',
      width: 120,
      editable: true,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('ja-JP');
      },
    },
    {
      field: 'status',
      headerName: 'ステータス',
      width: 120,
      editable: true,
    },
    {
      field: 'isRemote',
      headerName: 'リモート',
      width: 100,
      editable: true,
      valueFormatter: (params: any) => (params.value ? 'あり' : 'なし'),
    },
  ];

  // アクションボタン定義
  const actionButtons = [
    {
      label: '新規登録',
      onClick: handleCreateProject,
      variant: 'primary',
      icon: 'add',
    },
    {
      label: isEditable ? '編集モード終了' : '編集モード',
      onClick: toggleEditMode,
      variant: isEditable ? 'success' : 'secondary',
      icon: isEditable ? 'save' : 'edit',
    },
  ];

  // 行クリック時の処理
  const handleRowClick = (data: Project) => {
    if (!isEditable) {
      handleViewProject(data.id);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchProjects();
      return;
    }

    // クライアントサイドフィルタリング（本来はAPIでの検索が望ましい）
    const filteredProjects = projects.filter(
      project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.department?.name &&
          project.department.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.section?.name &&
          project.section.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
          delete updateData.department;
          delete updateData.section;
          
          if (row.isNew) {
            return projectService.createProject(updateData);
          } else {
            return projectService.updateProject(row.id, updateData);
          }
        });
        
        await Promise.all(promises);
        fetchProjects(); // 保存後にリストを更新
      } catch (err: any) {
        setError(err.response?.data?.message || '保存に失敗しました');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="project-list-container">
      <DataGrid
        title="案件一覧"
        data={projects}
        columns={columnDefs}
        actionButtons={actionButtons}
        onRowClick={handleRowClick}
        loading={isLoading}
        emptyMessage={error || 'データがありません'}
        pagination={true}
        pageSize={10}
        checkboxSelection={isEditable}
        onCellValueChanged={handleCellValueChanged}
        onRowDeleted={handleDeleteProject}
      />
    </div>
  );
};

export default ProjectList;
