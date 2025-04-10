import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Button from '../components/common/Button';

const ContractList: React.FC = () => {
  // 契約データ
  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'staffName', headerName: '要員名', width: 150 },
    { field: 'company', headerName: '所属会社', flex: 1 },
    { field: 'project', headerName: '案件名', flex: 1 },
    { field: 'period', headerName: '契約期間', width: 200 },
    { field: 'price', headerName: '契約単価', width: 120 },
    { field: 'status', headerName: 'ステータス', width: 120, 
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
    { 
      headerName: '操作', 
      width: 150,
      cellRenderer: () => {
        return (
          <div>
            <button className="action-button">詳細</button>
            <button className="action-button">更新</button>
          </div>
        );
      }
    }
  ];

  const rowData = [
    { id: 1, staffName: '山田 太郎', company: '株式会社テクノソリューション', project: 'Javaエンジニア募集', period: '2025/05/01 - 2025/10/31', price: '800,000円', status: '契約中' },
    { id: 2, staffName: '佐藤 次郎', company: 'デジタルイノベーション株式会社', project: 'インフラエンジニア', period: '2025/05/15 - 2025/11/30', price: '750,000円', status: '契約中' },
    { id: 3, staffName: '鈴木 三郎', company: '株式会社ITプロフェッショナル', project: 'フロントエンドエンジニア', period: '2025/01/01 - 2025/03/31', price: '700,000円', status: '契約終了' },
    { id: 4, staffName: '田中 四郎', company: 'サイバーテック株式会社', project: 'PMO支援', period: '2025/05/01 - 2026/03/31', price: '850,000円', status: '契約中' },
    { id: 5, staffName: '高橋 五郎', company: '株式会社システムクリエイト', project: 'テスト自動化エンジニア', period: '2025/04/01 - 2025/04/30', price: '720,000円', status: '更新待ち' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">契約一覧</h1>
        <Button variant="primary">新規契約登録</Button>
      </div>
      
      <div className="card p-4">
        <div className="ag-theme-alpine" style={{ height: 500 }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractList;
