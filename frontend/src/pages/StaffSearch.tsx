import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import staffService, { Staff, SearchStaffParams } from '../services/staffService';
import partnerService from '../services/partnerService';
import masterDataService from '../services/masterDataService';
import { useAuthStore } from '../store/authStore';

const StaffSearch: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [contractTypes, setContractTypes] = useState<any[]>([]);
  
  // 検索条件
  const [searchParams, setSearchParams] = useState<SearchStaffParams>({
    fullName: '',
    nameKana: '',
    partnerId: '',
    skills: '',
    skillLevelMin: undefined,
    skillLevelMax: undefined,
    yearsOfExperienceMin: undefined,
    yearsOfExperienceMax: undefined,
    contractType: '',
    rateMin: undefined,
    rateMax: undefined,
    availability: undefined
  });
  
  // 検索条件の詳細表示
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);
  
  // 列定義
  const columnDefs: ColDef[] = [
    { 
      headerName: '氏名', 
      field: 'fullName', 
      sortable: true, 
      filter: true, 
      flex: 1,
      cellRenderer: (params: any) => {
        return `<a href="/staff/${params.data.id}" class="text-blue-600 hover:underline">${params.value}</a>`;
      }
    },
    { 
      headerName: 'フリガナ', 
      field: 'nameKana', 
      sortable: true, 
      filter: true, 
      width: 150 
    },
    { 
      headerName: '所属', 
      field: 'partner.name', 
      sortable: true, 
      filter: true, 
      width: 150 
    },
    { 
      headerName: 'スキル', 
      field: 'skills', 
      sortable: true, 
      filter: true, 
      width: 200,
      cellRenderer: (params: any) => {
        if (!params.value) return '';
        
        const skills = params.value.split(',').map((skill: string) => skill.trim());
        return skills.map((skill: string) => 
          `<span class="inline-block px-2 py-1 mr-1 mb-1 text-xs bg-blue-100 text-blue-800 rounded-full">${skill}</span>`
        ).join('');
      }
    },
    { 
      headerName: 'スキルレベル', 
      field: 'skillLevel', 
      sortable: true, 
      filter: true, 
      width: 120,
      cellRenderer: (params: any) => {
        if (params.value === undefined || params.value === null) return '';
        
        const levelText = staffService.getSkillLevelText(params.value);
        let levelClass = '';
        
        switch (params.value) {
          case 1: levelClass = 'bg-gray-200 text-gray-800'; break;
          case 2: levelClass = 'bg-blue-200 text-blue-800'; break;
          case 3: levelClass = 'bg-green-200 text-green-800'; break;
          case 4: levelClass = 'bg-purple-200 text-purple-800'; break;
          case 5: levelClass = 'bg-yellow-200 text-yellow-800'; break;
          default: levelClass = 'bg-gray-200 text-gray-800';
        }
        
        return `<span class="px-2 py-1 rounded-full text-xs ${levelClass}">${levelText}</span>`;
      }
    },
    { 
      headerName: '経験年数', 
      field: 'yearsOfExperience', 
      sortable: true, 
      filter: true, 
      width: 100,
      valueFormatter: (params: any) => {
        return params.value !== undefined && params.value !== null ? `${params.value}年` : '';
      }
    },
    { 
      headerName: '契約形態', 
      field: 'contractType', 
      sortable: true, 
      filter: true, 
      width: 120 
    },
    { 
      headerName: '単価', 
      field: 'rate', 
      sortable: true, 
      filter: true, 
      width: 120,
      valueFormatter: (params: any) => {
        return params.value !== undefined && params.value !== null ? `${params.value.toLocaleString()}円` : '';
      }
    },
    { 
      headerName: '稼働状況', 
      field: 'availability', 
      sortable: true, 
      filter: true, 
      width: 120,
      cellRenderer: (params: any) => {
        if (!params.value) return '';
        
        let statusClass = '';
        switch (params.value) {
          case 'available':
            statusClass = 'bg-green-200 text-green-800';
            break;
          case 'unavailable':
            statusClass = 'bg-red-200 text-red-800';
            break;
          case 'partially_available':
            statusClass = 'bg-yellow-200 text-yellow-800';
            break;
          default:
            statusClass = 'bg-gray-200 text-gray-800';
        }
        
        const statusText = staffService.getAvailabilityText(params.value);
        return `<span class="px-2 py-1 rounded-full text-xs ${statusClass}">${statusText}</span>`;
      }
    },
    { 
      headerName: '更新日', 
      field: 'updatedAt', 
      sortable: true, 
      filter: true, 
      width: 150,
      cellRenderer: (params: any) => {
        return params.value ? new Date(params.value).toLocaleString('ja-JP') : '';
      }
    }
  ];
  
  // 初期データの読み込み
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // 要員データの取得
        const staffData = await staffService.getAllStaff();
        setStaff(staffData);
        
        // パートナーデータの取得
        const partnersData = await partnerService.getAllPartners();
        setPartners(partnersData);
        
        // 契約形態データの取得
        const contractTypesData = await masterDataService.getMasterDataByType('contractTypes');
        setContractTypes(contractTypesData);
        
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
      [name]: value
    });
  };
  
  // 数値検索条件の変更ハンドラー
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setSearchParams({
      ...searchParams,
      [name]: value === '' ? undefined : Number(value)
    });
  };
  
  // 検索実行ハンドラー
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 空の検索条件を除外
      const filteredParams: SearchStaffParams = {};
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          filteredParams[key as keyof SearchStaffParams] = value;
        }
      });
      
      const results = await staffService.searchStaff(filteredParams);
      setStaff(results);
      
      setLoading(false);
    } catch (err: any) {
      setError('検索に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };
  
  // 検索条件のリセットハンドラー
  const handleResetSearch = async () => {
    setSearchParams({
      fullName: '',
      nameKana: '',
      partnerId: '',
      skills: '',
      skillLevelMin: undefined,
      skillLevelMax: undefined,
      yearsOfExperienceMin: undefined,
      yearsOfExperienceMax: undefined,
      contractType: '',
      rateMin: undefined,
      rateMax: undefined,
      availability: undefined
    });
    
    try {
      setLoading(true);
      
      // 全要員を再取得
      const staffData = await staffService.getAllStaff();
      setStaff(staffData);
      
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
  
  // 新規要員作成ページへの遷移ハンドラー
  const handleCreateStaff = () => {
    window.location.href = '/staff/new';
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">要員検索</h1>
      
      {error && <Alert type="error" message={error} className="mb-4" />}
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Input
              label="氏名"
              name="fullName"
              value={searchParams.fullName || ''}
              onChange={handleSearchParamChange}
              placeholder="氏名で検索"
            />
          </div>
          
          <div>
            <Input
              label="フリガナ"
              name="nameKana"
              value={searchParams.nameKana || ''}
              onChange={handleSearchParamChange}
              placeholder="フリガナで検索"
            />
          </div>
          
          <div>
            <Select
              label="所属パートナー"
              name="partnerId"
              value={searchParams.partnerId || ''}
              onChange={handleSearchParamChange}
              options={[
                { value: '', label: '全てのパートナー' },
                ...partners.map(partner => ({
                  value: partner.id,
                  label: partner.name
                }))
              ]}
            />
          </div>
        </div>
        
        {showAdvancedSearch && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Input
                label="スキル"
                name="skills"
                value={searchParams.skills || ''}
                onChange={handleSearchParamChange}
                placeholder="スキルをカンマ区切りで入力"
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
                    label: type.name
                  }))
                ]}
              />
            </div>
            
            <div>
              <Select
                label="稼働状況"
                name="availability"
                value={searchParams.availability || ''}
                onChange={handleSearchParamChange}
                options={[
                  { value: '', label: '全ての稼働状況' },
                  { value: 'available', label: '稼働可能' },
                  { value: 'unavailable', label: '稼働不可' },
                  { value: 'partially_available', label: '一部稼働可能' }
                ]}
              />
            </div>
            
            <div>
              <Input
                label="スキルレベル（最小）"
                name="skillLevelMin"
                type="number"
                min="1"
                max="5"
                value={searchParams.skillLevelMin?.toString() || ''}
                onChange={handleNumberChange}
                placeholder="最小レベル"
              />
            </div>
            
            <div>
              <Input
                label="スキルレベル（最大）"
                name="skillLevelMax"
                type="number"
                min="1"
                max="5"
                value={searchParams.skillLevelMax?.toString() || ''}
                onChange={handleNumberChange}
                placeholder="最大レベル"
              />
            </div>
            
            <div>
              <Input
                label="経験年数（最小）"
                name="yearsOfExperienceMin"
                type="number"
                min="0"
                value={searchParams.yearsOfExperienceMin?.toString() || ''}
                onChange={handleNumberChange}
                placeholder="最小経験年数"
              />
            </div>
            
            <div>
              <Input
                label="経験年数（最大）"
                name="yearsOfExperienceMax"
                type="number"
                min="0"
                value={searchParams.yearsOfExperienceMax?.toString() || ''}
                onChange={handleNumberChange}
                placeholder="最大経験年数"
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
            <Button
              type="button"
              variant="primary"
              onClick={handleSearch}
              disabled={loading}
            >
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
            <Button
              type="button"
              variant="link"
              onClick={toggleAdvancedSearch}
              className="ml-2"
            >
              {showAdvancedSearch ? '基本検索に戻る' : '詳細検索'}
            </Button>
          </div>
          
          {(user?.role === 'admin' || user?.role === 'partner_manager') && (
            <Button
              type="button"
              variant="success"
              onClick={handleCreateStaff}
              disabled={loading}
            >
              新規要員登録
            </Button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">検索結果: {staff.length}件</h2>
        </div>
        
        <div className="ag-theme-alpine w-full" style={{ height: '600px' }}>
          <AgGridReact
            rowData={staff}
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

export default StaffSearch;
