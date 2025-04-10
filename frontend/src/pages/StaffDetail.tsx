import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import staffService, { Staff } from '../services/staffService';
import contractService, { Contract } from '../services/contractService';
import evaluationService, { Evaluation, EvaluationSkill } from '../services/evaluationService';

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [staff, setStaff] = useState<Staff | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'evaluations' | 'contracts'>('basic');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchStaffData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 要員基本情報を取得
        const staffData = await staffService.getStaff(id);
        setStaff(staffData);

        // 契約情報を取得
        const contractsData = await contractService.getContractsByStaffId(id);
        setContracts(contractsData);
        
        // 評価情報を取得
        const evaluationsData = await evaluationService.getEvaluationsByStaff(id);
        setEvaluations(evaluationsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'データの取得に失敗しました');
        console.error('Failed to fetch staff details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffData();
  }, [id]);

  // 日付を表示用にフォーマット
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // 金額を表示用にフォーマット
  const formatPrice = (price: number): string => {
    return price.toLocaleString('ja-JP') + '円';
  };

  // 各タブの内容をレンダリング
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <p>データを読み込み中...</p>
        </div>
      );
    }

    if (!staff) {
      return (
        <div className="text-center p-8">
          <p>要員情報が見つかりません。</p>
          <Button
            onClick={() => navigate('/staff')}
            className="mt-4"
          >
            一覧に戻る
          </Button>
        </div>
      );
    }

    switch (activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'skills':
        return renderSkills();
      case 'evaluations':
        return renderEvaluations();
      case 'contracts':
        return renderContracts();
      default:
        return null;
    }
  };

  // 基本情報タブの内容
  const renderBasicInfo = () => {
    if (!staff) return null;

    return (
      <div className="card p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">基本情報</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <th className="py-2 text-left">氏名</th>
                  <td className="py-2">{staff.name}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">メールアドレス</th>
                  <td className="py-2">{staff.email || '-'}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">電話番号</th>
                  <td className="py-2">{staff.phone || '-'}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">ステータス</th>
                  <td className="py-2">
                    <span className={`status-badge ${
                      staff.status === '稼働中' ? 'status-active' :
                      staff.status === '待機中' ? 'status-pending' :
                      'status-completed'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">経験年数</th>
                  <td className="py-2">{staff.experience ? `${staff.experience}年` : '-'}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">所属会社</th>
                  <td className="py-2">
                    <a href={`/partners/${staff.partner.id}`} className="text-primary-color hover:underline">
                      {staff.partner.name}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">詳細情報</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <th className="py-2 text-left">生年月日</th>
                  <td className="py-2">{formatDate(staff.birthDate)}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">性別</th>
                  <td className="py-2">{staff.gender || '-'}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">住所</th>
                  <td className="py-2">{staff.address || '-'}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">保有スキル</th>
                  <td className="py-2">
                    {staff.skills && staff.skills.length > 0 ? 
                      staff.skills.join(', ') : 
                      '-'
                    }
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">履歴書</th>
                  <td className="py-2">
                    {staff.resume ? 
                      <a href={staff.resume} target="_blank" rel="noopener noreferrer" className="text-primary-color hover:underline">
                        ダウンロード
                      </a> : 
                      '-'
                    }
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">備考</th>
                  <td className="py-2">{staff.remarks || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            variant="secondary"
            onClick={() => navigate('/staff')}
            className="mr-2"
          >
            一覧に戻る
          </Button>
          <Button
            onClick={() => navigate(`/staff/${id}/edit`)}
          >
            編集
          </Button>
        </div>
      </div>
    );
  };

  // 契約タブの内容
  const renderContracts = () => {
    const columnDefs: ColDef<Contract>[] = [
      { 
        field: 'project.name', 
        headerName: '案件名', 
        flex: 1,
        valueGetter: (params) => params.data?.project?.name || ''
      },
      {
        field: 'startDate',
        headerName: '開始日',
        width: 120,
        valueFormatter: (params) => formatDate(params.value)
      },
      {
        field: 'endDate',
        headerName: '終了日',
        width: 120,
        valueFormatter: (params) => formatDate(params.value)
      },
      {
        field: 'price',
        headerName: '契約単価',
        width: 120,
        valueFormatter: (params) => formatPrice(params.value)
      },
      {
        field: 'status',
        headerName: 'ステータス',
        width: 120,
        cellRenderer: (params: any) => {
          const status = params.value;
          let className = '';
          
          switch (status) {
            case '契約中':
              className = 'status-badge status-active';
              break;
            case '更新待ち':
              className = 'status-badge status-pending';
              break;
            case '契約終了':
              className = 'status-badge status-completed';
              break;
            default:
              className = 'status-badge';
          }
          
          return <span className={className}>{status}</span>;
        }
      },
      { field: 'paymentTerms', headerName: '支払条件', width: 150 },
      { 
        field: 'isAutoRenew', 
        headerName: '自動更新', 
        width: 100,
        valueFormatter: (params) => params.value ? 'あり' : 'なし'
      },
      { 
        headerName: '操作', 
        width: 150,
        cellRenderer: (params: any) => {
          const id = params.data?.id || '';
          return (
            <div>
              <button 
                className="action-button" 
                onClick={() => navigate(`/contracts/${id}`)}
              >
                詳細
              </button>
              <button 
                className="action-button" 
                onClick={() => navigate(`/contracts/${id}/edit`)}
              >
                編集
              </button>
            </div>
          );
        }
      }
    ];

    return (
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">契約履歴</h3>
          <Button
            onClick={() => navigate(`/staff/${id}/contracts/create`)}
          >
            新規契約登録
          </Button>
        </div>
        
        {contracts.length === 0 ? (
          <p className="text-center py-4">契約履歴はありません。</p>
        ) : (
          <div className="ag-theme-alpine" style={{ height: 400 }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={contracts}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">
          {isLoading ? '要員詳細を読み込み中...' : staff ? staff.name : '要員詳細'}
        </h1>
      </div>
      
      {error && <Alert variant="error" message={error} onClose={() => setError(null)} />}

      {/* タブ */}
      <div className="tabs mb-4">
        <div
          className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          基本情報
        </div>
        <div
          className={`tab ${activeTab === 'contracts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contracts')}
        >
          契約履歴
        </div>
      </div>

      {/* タブコンテンツ */}
      {renderTabContent()}
    </div>
  );
};

export default StaffDetail;
