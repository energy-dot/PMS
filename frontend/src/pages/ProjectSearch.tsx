import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import DatePicker from '../components/common/DatePicker';
import projectService, { Project, SearchProjectsParams } from '../services/projectService';
import departmentService from '../services/departmentService';
import sectionService from '../services/sectionService';
import masterDataService from '../services/masterDataService';
import { useAuthStore } from '../store/authStore';

const ProjectSearch: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [contractTypes, setContractTypes] = useState<any[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<any[]>([]);

  // 検索条件
  const [searchParams, setSearchParams] = useState<SearchProjectsParams>({
    name: '',
    status: '',
    departmentId: '',
    sectionId: '',
    contractType: '',
    startDateFrom: '',
    startDateTo: '',
    endDateFrom: '',
    endDateTo: '',
    rateMin: undefined,
    rateMax: undefined,
    requiredSkills: '',
  });

  // 検索条件の詳細表示
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);

  // 列定義
  const columnDefs: ColDef[] = [
    {
      headerName: '案件名',
      field: 'name',
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params: any) => {
        return `<a href="/projects/${params.data.id}" class="text-blue-600 hover:underline">${params.value}</a>`;
      },
    },
    {
      headerName: 'ステータス',
      field: 'status',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: any) => {
        let statusClass = '';
        switch (params.value) {
          case 'draft':
            statusClass = 'bg-gray-200 text-gray-800';
            break;
          case 'pending_approval':
            statusClass = 'bg-yellow-200 text-yellow-800';
            break;
          case 'recruiting':
            statusClass = 'bg-blue-200 text-blue-800';
            break;
          case 'in_progress':
            statusClass = 'bg-green-200 text-green-800';
            break;
          case 'completed':
            statusClass = 'bg-purple-200 text-purple-800';
            break;
          case 'rejected':
            statusClass = 'bg-red-200 text-red-800';
            break;
          default:
            statusClass = 'bg-gray-200 text-gray-800';
        }

        const statusText = getStatusText(params.value);
        return `<span class="px-2 py-1 rounded-full text-xs ${statusClass}">${statusText}</span>`;
      },
    },
    {
      headerName: '部署',
      field: 'department.name',
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: '開始日',
      field: 'startDate',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: any) => {
        return params.value ? new Date(params.value).toLocaleDateString('ja-JP') : '';
      },
    },
    {
      headerName: '終了日',
      field: 'endDate',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: any) => {
        return params.value ? new Date(params.value).toLocaleDateString('ja-JP') : '';
      },
    },
    {
      headerName: '単価範囲',
      field: 'rateRange',
      sortable: true,
      filter: true,
      width: 150,
      valueGetter: (params: any) => {
        if (!params.data) return '';
        return `${params.data.rateMin?.toLocaleString() || 0}円 〜 ${params.data.rateMax?.toLocaleString() || 0}円`;
      },
    },
    {
      headerName: '必要人数',
      field: 'requiredHeadcount',
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      headerName: '現在人数',
      field: 'currentHeadcount',
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      headerName: '承認状態',
      field: 'isApproved',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: any) => {
        return params.value
          ? '<span class="px-2 py-1 rounded-full text-xs bg-green-200 text-green-800">承認済</span>'
          : '<span class="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-800">未承認</span>';
      },
    },
    {
      headerName: '更新日',
      field: 'updatedAt',
      sortable: true,
      filter: true,
      width: 150,
      cellRenderer: (params: any) => {
        return params.value ? new Date(params.value).toLocaleString('ja-JP') : '';
      },
    },
  ];

  // ステータスの表示名を取得
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'draft':
        return '下書き';
      case 'pending_approval':
        return '承認待ち';
      case 'recruiting':
        return '募集中';
      case 'in_progress':
        return '進行中';
      case 'completed':
        return '完了';
      case 'rejected':
        return '差戻し';
      default:
        return status;
    }
  };

  // 初期データの読み込み
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // 案件データの取得
        const projectsData = await projectService.getAllProjects();
        setProjects(projectsData);

        // 部署データの取得
        const departmentsData = await departmentService.getAllDepartments();
        setDepartments(departmentsData);

        // セクションデータの取得
        const sectionsData = await sectionService.getAllSections();
        setSections(sectionsData);

        // 契約形態データの取得
        const contractTypesData = await masterDataService.getMasterDataByType('contractTypes');
        setContractTypes(contractTypesData);

        // 案件ステータスデータの取得
        const projectStatusesData = await masterDataService.getMasterDataByType('projectStatuses');
        setProjectStatuses(projectStatusesData);

        setLoading(false);
      } catch (err: any) {
        setError('データの取得に失敗しました: ' + (err.message || '不明なエラー'));
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 検索条件の変更ハンドラー
  const handleSearchParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  // 日付検索条件の変更ハンドラー
  const handleDateChange = (name: string, value: string) => {
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  // 数値検索条件の変更ハンドラー
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSearchParams({
      ...searchParams,
      [name]: value === '' ? undefined : Number(value),
    });
  };

  // 検索実行ハンドラー
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      // 空の検索条件を除外
      const filteredParams: SearchProjectsParams = {};
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          filteredParams[key as keyof SearchProjectsParams] = value;
        }
      });

      const results = await projectService.searchProjects(filteredParams);
      setProjects(results);

      setLoading(false);
    } catch (err: any) {
      setError('検索に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };

  // 検索条件のリセットハンドラー
  const handleResetSearch = async () => {
    setSearchParams({
      name: '',
      status: '',
      departmentId: '',
      sectionId: '',
      contractType: '',
      startDateFrom: '',
      startDateTo: '',
      endDateFrom: '',
      endDateTo: '',
      rateMin: undefined,
      rateMax: undefined,
      requiredSkills: '',
    });

    try {
      setLoading(true);

      // 全案件を再取得
      const projectsData = await projectService.getAllProjects();
      setProjects(projectsData);

      setLoading(false);
    } catch (err: any) {
      setError('データの取得に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };

  // 詳細検索の表示切替ハンドラー
  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  // 新規案件作成ページへの遷移ハンドラー
  const handleCreateProject = () => {
    window.location.href = '/projects/new';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">案件検索</h1>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Input
              label="案件名"
              name="name"
              value={searchParams.name || ''}
              onChange={handleSearchParamChange}
              placeholder="案件名で検索"
            />
          </div>

          <div>
            <Select
              label="ステータス"
              name="status"
              value={searchParams.status || ''}
              onChange={handleSearchParamChange}
              options={[
                { value: '', label: '全てのステータス' },
                ...projectStatuses.map(status => ({
                  value: status.name,
                  label: getStatusText(status.name),
                })),
              ]}
            />
          </div>

          <div>
            <Select
              label="部署"
              name="departmentId"
              value={searchParams.departmentId || ''}
              onChange={handleSearchParamChange}
              options={[
                { value: '', label: '全ての部署' },
                ...departments.map(dept => ({
                  value: dept.id,
                  label: dept.name,
                })),
              ]}
            />
          </div>
        </div>

        {showAdvancedSearch && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Select
                label="セクション"
                name="sectionId"
                value={searchParams.sectionId || ''}
                onChange={handleSearchParamChange}
                options={[
                  { value: '', label: '全てのセクション' },
                  ...sections.map(section => ({
                    value: section.id,
                    label: section.name,
                  })),
                ]}
              />
            </div>

            <div>
              <Select
                label="契約形態"
                name="contractType"
                value={searchParams.contractType || ''}
                onChange={handleSearchParamChange}
                options={[
                  { value: '', label: '全ての契約形態' },
                  ...contractTypes.map(type => ({
                    value: type.name,
                    label: type.name,
                  })),
                ]}
              />
            </div>

            <div>
              <Input
                label="必要スキル"
                name="requiredSkills"
                value={searchParams.requiredSkills || ''}
                onChange={handleSearchParamChange}
                placeholder="スキルをカンマ区切りで入力"
              />
            </div>

            <div>
              <DatePicker
                label="開始日（から）"
                name="startDateFrom"
                value={searchParams.startDateFrom || ''}
                onChange={value => handleDateChange('startDateFrom', value)}
              />
            </div>

            <div>
              <DatePicker
                label="開始日（まで）"
                name="startDateTo"
                value={searchParams.startDateTo || ''}
                onChange={value => handleDateChange('startDateTo', value)}
              />
            </div>

            <div>
              <DatePicker
                label="終了日（から）"
                name="endDateFrom"
                value={searchParams.endDateFrom || ''}
                onChange={value => handleDateChange('endDateFrom', value)}
              />
            </div>

            <div>
              <DatePicker
                label="終了日（まで）"
                name="endDateTo"
                value={searchParams.endDateTo || ''}
                onChange={value => handleDateChange('endDateTo', value)}
              />
            </div>

            <div>
              <Input
                label="単価下限（円）"
                name="rateMin"
                type="number"
                value={searchParams.rateMin?.toString() || ''}
                onChange={handleNumberChange}
                placeholder="最低単価"
              />
            </div>

            <div>
              <Input
                label="単価上限（円）"
                name="rateMax"
                type="number"
                value={searchParams.rateMax?.toString() || ''}
                onChange={handleNumberChange}
                placeholder="最高単価"
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <Button type="button" variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? '検索中...' : '検索'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleResetSearch}
              className="ml-2"
              disabled={loading}
            >
              リセット
            </Button>
            <Button type="button" variant="link" onClick={toggleAdvancedSearch} className="ml-2">
              {showAdvancedSearch ? '基本検索に戻る' : '詳細検索'}
            </Button>
          </div>

          {(user?.role === 'admin' ||
            user?.role === 'partner_manager' ||
            user?.role === 'developer') && (
            <Button
              type="button"
              variant="success"
              onClick={handleCreateProject}
              disabled={loading}
            >
              新規案件作成
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">検索結果: {projects.length}件</h2>
        </div>

        <div className="ag-theme-alpine w-full" style={{ height: '600px' }}>
          <AgGridReact
            rowData={projects}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            domLayout="autoHeight"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectSearch;
