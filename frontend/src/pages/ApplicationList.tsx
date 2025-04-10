import React, { useState, useEffect, useCallback } from 'react';
import { ColDef } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import DataGrid from '../components/grids/DataGrid';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import applicationService, { Application } from '../services/applicationService';
import projectService from '../services/projectService';
import partnerService from '../services/partnerService';
import { DateEditor, SelectEditor } from '../components/grids/editors';

const ApplicationList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [projectsMap, setProjectsMap] = useState<Record<string, string>>({});
  const [partnersMap, setPartnersMap] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // ステータスの選択肢と表示用のスタイル
  const statusOptions = ['新規応募', '書類選考中', '書類NG', '書類OK', '面談調整中', '面談設定済', '面談NG', '面談OK', '内定', '採用', '見送り', '辞退'];
  const statusClassMap: Record<string, string> = {
    '新規応募': 'bg-blue-100 text-blue-800',
    '書類選考中': 'bg-yellow-100 text-yellow-800',
    '書類NG': 'bg-red-100 text-red-800',
    '書類OK': 'bg-green-100 text-green-800',
    '面談調整中': 'bg-purple-100 text-purple-800',
    '面談設定済': 'bg-indigo-100 text-indigo-800',
    '面談NG': 'bg-red-100 text-red-800',
    '面談OK': 'bg-green-100 text-green-800',
    '内定': 'bg-green-200 text-green-800',
    '採用': 'bg-green-300 text-green-800',
    '見送り': 'bg-gray-100 text-gray-800',
    '辞退': 'bg-orange-100 text-orange-800',
  };

  // 案件とパートナー会社のマスタデータを取得
  useEffect(() => {
    const fetchProjectsAndPartners = async () => {
      try {
        const projects = await projectService.getProjects();
        const partners = await partnerService.getPartners();
        
        // 案件IDから名前への変換マップを作成
        const projMap: Record<string, string> = {};
        projects.forEach(proj => {
          projMap[proj.id] = proj.name;
        });
        setProjectsMap(projMap);
        
        // パートナー会社IDから名前への変換マップを作成
        const partMap: Record<string, string> = {};
        partners.forEach(part => {
          partMap[part.id] = part.name;
        });
        setPartnersMap(partMap);
      } catch (err) {
        console.error('Failed to fetch projects and partners:', err);
      }
    };
    
    fetchProjectsAndPartners();
  }, []);

  // 応募者データ取得
  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      if (selectedProjectId) {
        // 案件でフィルタリング
        data = await applicationService.getApplicationsByProject(selectedProjectId);
      } else {
        // 全件取得
        data = await applicationService.getApplications();
      }
      setApplications(data);
    } catch (err: any) {
      setError(err.response?.data?.message || '応募者データの取得に失敗しました');
      console.error('Failed to fetch applications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  // 初回読み込み時とフィルター変更時にデータ取得
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // 検索機能
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchApplications();
      return;
    }

    // クライアントサイドフィルタリング（本来はAPIでの検索が望ましい）
    const filteredApplications = applications.filter(application => 
      application.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (application.skillSummary && application.skillSummary.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setApplications(filteredApplications);
  };

  // 新規登録画面へ遷移
  const handleCreateApplication = () => {
    navigate('/applications/new');
  };

  // 詳細画面へ遷移
  const handleViewApplication = (id: string) => {
    navigate(`/applications/${id}`);
  };

  // 削除処理
  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm('この応募者情報を削除してもよろしいですか？')) {
      return;
    }

    setIsLoading(true);
    try {
      await applicationService.deleteApplication(id);
      // 削除後、リストを更新
      const updatedApplications = applications.filter(application => application.id !== id);
      setApplications(updatedApplications);
    } catch (err: any) {
      setError(err.response?.data?.message || '削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 案件名を取得
  const getProjectName = (projectId: string | null): string => {
    if (!projectId) return '';
    return projectsMap[projectId] || '';
  };
  
  // パートナー会社名を取得
  const getPartnerName = (partnerId: string | null): string => {
    if (!partnerId) return '';
    return partnersMap[partnerId] || '';
  };

  // 日付を表示用にフォーマット
  const formatDate = (date: Date | string): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // 応募者データ用列定義
  const columnDefs: ColDef<Application>[] = [
    { 
      field: 'applicantName', 
      headerName: '応募者名', 
      flex: 1,
      minWidth: 150,
      cellStyle: { textOverflow: 'ellipsis' },
    },
    { 
      field: 'projectId', 
      headerName: '案件名', 
      width: 200,
      valueFormatter: (params) => getProjectName(params.value),
    },
    { 
      field: 'partnerId', 
      headerName: 'パートナー会社', 
      width: 200,
      valueFormatter: (params) => getPartnerName(params.value),
    },
    { 
      field: 'applicationDate', 
      headerName: '応募日', 
      width: 120,
      valueFormatter: (params) => formatDate(params.value),
    },
    { 
      field: 'status', 
      headerName: 'ステータス', 
      width: 140, 
      cellRenderer: (params: import('ag-grid-community').ICellRendererParams<Application>) => {
        const status = params.value;
        if (!status) return null;
        
        const className = `px-2 py-1 rounded-full text-xs font-medium ${statusClassMap[status] || 'bg-gray-100 text-gray-800'}`;
        
        return <span className={className}>{status}</span>;
      }
    },
    { 
      field: 'desiredRate', 
      headerName: '希望単価', 
      width: 120,
      valueFormatter: (params) => params.value || '-'
    },
    { 
      field: 'skillSummary', 
      headerName: 'スキル概要', 
      width: 200,
      cellStyle: { overflow: 'hidden', textOverflow: 'ellipsis' }
    },
    { 
      headerName: '操作', 
      width: 150,
      cellRenderer: (params: import('ag-grid-community').ICellRendererParams<Application>) => {
        const id = params.data?.id || '';
        
        return (
          <div className="flex space-x-1">
            <button 
              className="action-button px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 focus:outline-none" 
              onClick={() => handleViewApplication(id)}
            >
              詳細
            </button>
            <button 
              className="action-button px-2 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200 focus:outline-none" 
              onClick={() => handleDeleteApplication(id)}
            >
              削除
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">応募者一覧</h1>
        <Button 
          onClick={handleCreateApplication}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          新規登録
        </Button>
      </div>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              案件で絞り込み
            </label>
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(e.target.value || null)}
            >
              <option value="">すべての案件</option>
              {Object.entries(projectsMap).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              キーワード検索
            </label>
            <div className="flex">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="応募者名、スキルなどで検索"
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                検索
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <DataGrid
          rowData={applications}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
          isLoading={isLoading}
          onRowDoubleClicked={(params) => {
            if (params.data) {
              handleViewApplication(params.data.id);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ApplicationList;
