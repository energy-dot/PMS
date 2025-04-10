import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Button from '../components/common/Button';

const StaffList: React.FC = () => {
  // 要員データ
  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: '氏名', width: 150 },
    { field: 'company', headerName: '所属会社', flex: 1 },
    { field: 'skills', headerName: 'スキル', flex: 1 },
    { field: 'status', headerName: 'ステータス', width: 120, 
      cellRenderer: (params: any) => {
        const status = params.value;
        let className = '';
        
        switch (status) {
          case '稼働中':
            className = 'status-badge status-active';
            break;
          case '待機中':
            className = 'status-badge status-pending';
            break;
          case '契約終了':
            className = 'status-badge status-rejected';
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
            <button className="action-button">評価</button>
          </div>
        );
      }
    }
  ];

  const rowData = [
    { id: 1, name: '山田 太郎', company: '株式会社テクノソリューション', skills: 'Java, Spring, AWS', status: '稼働中' },
    { id: 2, name: '佐藤 次郎', company: 'デジタルイノベーション株式会社', skills: 'Python, Django, Docker', status: '稼働中' },
    { id: 3, name: '鈴木 三郎', company: '株式会社ITプロフェッショナル', skills: 'JavaScript, React, TypeScript', status: '契約終了' },
    { id: 4, name: '田中 四郎', company: 'サイバーテック株式会社', skills: 'C#, .NET, Azure', status: '稼働中' },
    { id: 5, name: '高橋 五郎', company: '株式会社システムクリエイト', skills: 'PHP, Laravel, MySQL', status: '待機中' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">要員一覧</h1>
        <Button variant="primary">新規要員登録</Button>
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

export default StaffList;
