import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import partnerService, { Partner } from '../services/partnerService';
import antisocialCheckService, { AntisocialCheck } from '../services/antisocialCheckService';
import creditCheckService, { CreditCheck } from '../services/creditCheckService';
import baseContractService, { BaseContract } from '../services/baseContractService';
import contactPersonService, { ContactPerson } from '../services/contactPersonService';

const PartnerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [antisocialChecks, setAntisocialChecks] = useState<AntisocialCheck[]>([]);
  const [creditChecks, setCreditChecks] = useState<CreditCheck[]>([]);
  const [baseContracts, setBaseContracts] = useState<BaseContract[]>([]);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'antisocial' | 'credit' | 'contracts' | 'contacts'>('basic');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPartnerData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // パートナー基本情報を取得
        const partnerData = await partnerService.getPartner(id);
        setPartner(partnerData);

        // 反社チェック情報を取得
        const checksData = await antisocialCheckService.getAntisocialChecksByPartnerId(id);
        setAntisocialChecks(checksData);

        // 信用調査情報を取得
        const creditData = await creditCheckService.getCreditChecksByPartnerId(id);
        setCreditChecks(creditData);

        // 基本契約情報を取得
        const contractsData = await baseContractService.getBaseContractsByPartnerId(id);
        setBaseContracts(contractsData);

        // 営業窓口情報を取得
        const contactsData = await contactPersonService.getContactPersonsByPartnerId(id);
        setContactPersons(contactsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'データの取得に失敗しました');
        console.error('Failed to fetch partner details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartnerData();
  }, [id]);

  // 日付を表示用にフォーマット
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
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

    if (!partner) {
      return (
        <div className="text-center p-8">
          <p>パートナー会社情報が見つかりません。</p>
          <Button
            onClick={() => navigate('/partners')}
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
      case 'antisocial':
        return renderAntisocialChecks();
      case 'credit':
        return renderCreditChecks();
      case 'contracts':
        return renderBaseContracts();
      case 'contacts':
        return renderContactPersons();
      default:
        return null;
    }
  };

  // 基本情報タブの内容
  const renderBasicInfo = () => {
    if (!partner) return null;

    return (
      <div className="card p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">基本情報</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <th className="py-2 text-left">会社名</th>
                  <td className="py-2">{partner.name}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">住所</th>
                  <td className="py-2">{partner.address}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">電話番号</th>
                  <td className="py-2">{partner.phone}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">メールアドレス</th>
                  <td className="py-2">{partner.email || '-'}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">Webサイト</th>
                  <td className="py-2">
                    {partner.website ? (
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {partner.website}
                      </a>
                    ) : '-'}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">ステータス</th>
                  <td className="py-2">
                    <span className={`status-badge ${
                      partner.status === '取引中' ? 'status-active' :
                      partner.status === '取引停止' ? 'status-rejected' :
                      'status-pending'
                    }`}>
                      {partner.status}
                    </span>
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
                  <th className="py-2 text-left">事業内容</th>
                  <td className="py-2">{partner.businessCategory || '-'}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">設立年</th>
                  <td className="py-2">{partner.establishedYear || '-'}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">従業員数</th>
                  <td className="py-2">{partner.employeeCount ? `${partner.employeeCount}名` : '-'}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">年間売上</th>
                  <td className="py-2">{partner.annualRevenue || '-'}</td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">反社チェック完了</th>
                  <td className="py-2">
                    {partner.antisocialCheckCompleted ? 
                      <span className="text-success-color">完了 ({formatDate(partner.antisocialCheckDate)})</span> : 
                      <span className="text-warning-color">未完了</span>
                    }
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">信用調査完了</th>
                  <td className="py-2">
                    {partner.creditCheckCompleted ? 
                      <span className="text-success-color">完了 ({formatDate(partner.creditCheckDate)})</span> : 
                      <span className="text-warning-color">未完了</span>
                    }
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="py-2 text-left">備考</th>
                  <td className="py-2">{partner.remarks || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            variant="secondary"
            onClick={() => navigate('/partners')}
            className="mr-2"
          >
            一覧に戻る
          </Button>
          <Button
            onClick={() => navigate(`/partners/${id}/edit`)}
          >
            編集
          </Button>
        </div>
      </div>
    );
  };

  // 反社チェックタブの内容
  const renderAntisocialChecks = () => {
    const columnDefs: ColDef<AntisocialCheck>[] = [
      {
        field: 'checkDate',
        headerName: 'チェック実施日',
        width: 150,
        valueFormatter: (params) => formatDate(params.value)
      },
      { field: 'checkedBy', headerName: '実施者', width: 120 },
      { field: 'checkMethod', headerName: 'チェック方法', width: 150 },
      {
        field: 'result',
        headerName: '結果',
        width: 100,
        cellRenderer: (params: any) => {
          const result = params.value;
          let className = '';
          
          switch (result) {
            case '問題なし':
              className = 'status-badge status-active';
              break;
            case '要確認':
              className = 'status-badge status-pending';
              break;
            case 'NG':
              className = 'status-badge status-rejected';
              break;
            default:
              className = 'status-badge';
          }
          
          return <span className={className}>{result}</span>;
        }
      },
      {
        field: 'expiryDate',
        headerName: '有効期限',
        width: 150,
        valueFormatter: (params) => formatDate(params.value)
      },
      { field: 'documentFile', headerName: '関連書類', width: 120 },
      { field: 'remarks', headerName: '備考', flex: 1 },
      { 
        headerName: '操作', 
        width: 150,
        cellRenderer: (params: any) => {
          const id = params.data?.id || '';
          return (
            <div>
              <button 
                className="action-button" 
                onClick={() => navigate(`/antisocial-checks/${id}/edit`)}
              >
                編集
              </button>
              <button 
                className="action-button delete" 
                onClick={() => handleDeleteAntisocialCheck(id)}
              >
                削除
              </button>
            </div>
          );
        }
      }
    ];

    const handleDeleteAntisocialCheck = async (checkId: string) => {
      if (!window.confirm('このチェック記録を削除してもよろしいですか？')) {
        return;
      }

      try {
        await antisocialCheckService.deleteAntisocialCheck(checkId);
        setAntisocialChecks(prev => prev.filter(check => check.id !== checkId));
      } catch (err: any) {
        setError(err.response?.data?.message || '削除に失敗しました');
      }
    };

    return (
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">反社チェック履歴</h3>
          <Button
            onClick={() => navigate(`/partners/${id}/antisocial-checks/create`)}
          >
            新規チェック登録
          </Button>
        </div>
        
        {antisocialChecks.length === 0 ? (
          <p className="text-center py-4">チェック履歴はありません。</p>
        ) : (
          <div className="ag-theme-alpine" style={{ height: 400 }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={antisocialChecks}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        )}
      </div>
    );
  };
  
  // 信用調査タブの内容
  const renderCreditChecks = () => {
    const columnDefs: ColDef<CreditCheck>[] = [
      {
        field: 'checkDate',
        headerName: 'チェック実施日',
        width: 150,
        valueFormatter: (params) => formatDate(params.value)
      },
      { field: 'checkedBy', headerName: '実施者', width: 120 },
      { field: 'checkMethod', headerName: 'チェック方法', width: 150 },
      {
        field: 'result',
        headerName: '結果',
        width: 100,
        cellRenderer: (params: any) => {
          const result = params.value;
          let className = '';
          
          switch (result) {
            case '良好':
              className = 'status-badge status-active';
              break;
            case '注意':
              className = 'status-badge status-pending';
              break;
            case '不良':
              className = 'status-badge status-rejected';
              break;
            default:
              className = 'status-badge';
          }
          
          return <span className={className}>{result}</span>;
        }
      },
      { field: 'creditScore', headerName: '信用スコア', width: 120 },
      { field: 'financialStability', headerName: '財務安定性', width: 150 },
      { field: 'paymentHistory', headerName: '支払履歴', width: 150 },
      {
        field: 'expiryDate',
        headerName: '有効期限',
        width: 150,
        valueFormatter: (params) => formatDate(params.value)
      },
      { field: 'documentFile', headerName: '関連書類', width: 120 },
      { field: 'remarks', headerName: '備考', flex: 1 },
      { 
        headerName: '操作', 
        width: 150,
        cellRenderer: (params: any) => {
          const id = params.data?.id || '';
          return (
            <div>
              <button 
                className="action-button" 
                onClick={() => navigate(`/credit-checks/${id}/edit`)}
              >
                編集
              </button>
              <button 
                className="action-button delete" 
                onClick={() => handleDeleteCreditCheck(id)}
              >
                削除
              </button>
            </div>
          );
        }
      }
    ];

    const handleDeleteCreditCheck = async (checkId: string) => {
      if (!window.confirm('この信用調査記録を削除してもよろしいですか？')) {
        return;
      }

      try {
        await creditCheckService.deleteCreditCheck(checkId);
        setCreditChecks(prev => prev.filter(check => check.id !== checkId));
      } catch (err: any) {
        setError(err.response?.data?.message || '削除に失敗しました');
      }
    };

    return (
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">信用調査履歴</h3>
          <Button
            onClick={() => navigate(`/partners/${id}/credit-checks/create`)}
          >
            新規調査登録
          </Button>
        </div>
        
        {creditChecks.length === 0 ? (
          <p className="text-center py-4">調査履歴はありません。</p>
        ) : (
          <div className="ag-theme-alpine" style={{ height: 400 }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={creditChecks}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        )}
      </div>
    );
  };

  // 基本契約タブの内容
  const renderBaseContracts = () => {
    const columnDefs: ColDef<BaseContract>[] = [
      { field: 'name', headerName: '契約名', flex: 1 },
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
        field: 'status',
        headerName: 'ステータス',
        width: 120,
        cellRenderer: (params: any) => {
          const status = params.value;
          let className = '';
          
          switch (status) {
            case '有効':
              className = 'status-badge status-active';
              break;
            case '更新待ち':
              className = 'status-badge status-pending';
              break;
            case '終了':
              className = 'status-badge status-completed';
              break;
            default:
              className = 'status-badge';
          }
          
          return <span className={className}>{status}</span>;
        }
      },
      { field: 'contractType', headerName: '契約種別', width: 120 },
      { field: 'isAutoRenew', headerName: '自動更新', width: 100, valueFormatter: (params) => params.value ? 'あり' : 'なし' },
      { field: 'terms', headerName: '契約条件', width: 150 },
      { field: 'remarks', headerName: '備考', width: 150 },
      { 
        headerName: '操作', 
        width: 150,
        cellRenderer: (params: any) => {
          const id = params.data?.id || '';
          return (
            <div>
              <button 
                className="action-button" 
                onClick={() => navigate(`/base-contracts/${id}/edit`)}
              >
                編集
              </button>
              <button 
                className="action-button" 
                onClick={() => navigate(`/base-contracts/${id}`)}
              >
                詳細
              </button>
            </div>
          );
        }
      }
    ];

    return (
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">基本契約</h3>
          <Button
            onClick={() => navigate(`/partners/${id}/base-contracts/create`)}
          >
            新規契約登録
          </Button>
        </div>
        
        {baseContracts.length === 0 ? (
          <p className="text-center py-4">契約情報はありません。</p>
        ) : (
          <div className="ag-theme-alpine" style={{ height: 400 }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={baseContracts}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        )}
      </div>
    );
  };

  // 営業窓口タブの内容
  const renderContactPersons = () => {
    const columnDefs: ColDef<ContactPerson>[] = [
      { field: 'name', headerName: '氏名', width: 150 },
      { field: 'department', headerName: '部署', width: 150 },
      { field: 'position', headerName: '役職', width: 120 },
      { field: 'email', headerName: 'メールアドレス', width: 200 },
      { field: 'phone', headerName: '電話番号', width: 150 },
      { field: 'mobilePhone', headerName: '携帯電話', width: 150 },
      { 
        field: 'type',
        headerName: '担当区分',
        width: 120,
        cellRenderer: (params: any) => {
          const type = params.value;
          let className = '';
          
          switch (type) {
            case '主要担当':
              className = 'status-badge status-active';
              break;
            case '営業担当':
              className = 'status-badge status-pending';
              break;
            case '技術担当':
              className = 'status-badge status-success';
              break;
            default:
              className = 'status-badge';
          }
          
          return <span className={className}>{type}</span>;
        }
      },
      { field: 'remarks', headerName: '備考', flex: 1 },
      { 
        headerName: '操作', 
        width: 150,
        cellRenderer: (params: any) => {
          const id = params.data?.id || '';
          return (
            <div>
              <button 
                className="action-button" 
                onClick={() => navigate(`/contact-persons/${id}/edit`)}
              >
                編集
              </button>
              <button 
                className="action-button delete" 
                onClick={() => handleDeleteContactPerson(id)}
              >
                削除
              </button>
            </div>
          );
        }
      }
    ];

    const handleDeleteContactPerson = async (contactId: string) => {
      if (!window.confirm('この担当者情報を削除してもよろしいですか？')) {
        return;
      }

      try {
        await contactPersonService.deleteContactPerson(contactId);
        setContactPersons(prev => prev.filter(contact => contact.id !== contactId));
      } catch (err: any) {
        setError(err.response?.data?.message || '削除に失敗しました');
      }
    };

    return (
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">営業窓口担当者</h3>
          <Button
            onClick={() => navigate(`/partners/${id}/contact-persons/create`)}
          >
            新規担当者登録
          </Button>
        </div>
        
        {contactPersons.length === 0 ? (
          <p className="text-center py-4">担当者情報はありません。</p>
        ) : (
          <div className="ag-theme-alpine" style={{ height: 400 }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={contactPersons}
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
          {isLoading ? 'パートナー会社詳細を読み込み中...' : partner ? partner.name : 'パートナー会社詳細'}
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
          className={`tab ${activeTab === 'antisocial' ? 'active' : ''}`}
          onClick={() => setActiveTab('antisocial')}
        >
          反社チェック
        </div>
        <div
          className={`tab ${activeTab === 'credit' ? 'active' : ''}`}
          onClick={() => setActiveTab('credit')}
        >
          信用調査
        </div>
        <div
          className={`tab ${activeTab === 'contracts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contracts')}
        >
          基本契約
        </div>
        <div
          className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          営業窓口担当者
        </div>
      </div>

      {/* タブコンテンツ */}
      {renderTabContent()}
    </div>
  );
};

export default PartnerDetail;
