import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Button from '../components/common/Button';

const ProjectList: React.FC = () => {
  // 案件データ
  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: '案件名', flex: 1 },
    { field: 'department', headerName: '募集部署', width: 150 },
    { field: 'period', headerName: '予定期間', width: 200 },
    { field: 'status', headerName: 'ステータス', width: 120, 
      cellRenderer: (params: any) => {
        const status = params.value;
        let className = '';
        
        switch (status) {
          case '募集中':
            className = 'status-badge status-active';
            break;
          case '選考中':
            className = 'status-badge status-pending';
            break;
          case '充足':
            className = 'status-badge status-completed';
            break;
          case '承認待ち':
            className = 'status-badge status-pending';
            break;
          case '差し戻し':
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
            <button className="action-button">編集</button>
          </div>
        );
      }
    }
  ];

  const rowData = [
    { id: 1, name: 'Javaエンジニア募集', department: '開発1部', period: '2025/05/01 - 2025/10/31', status: '募集中' },
    { id: 2, name: 'インフラエンジニア', department: '基盤チーム', period: '2025/05/15 - 2025/11/30', status: '選考中' },
    { id: 3, name: 'フロントエンドエンジニア', department: '開発2部', period: '2025/06/01 - 2025/12/31', status: '承認待ち' },
    { id: 4, name: 'PMO支援', department: 'PMO', period: '2025/05/01 - 2026/03/31', status: '充足' },
    { id: 5, name: 'テスト自動化エンジニア', department: '品質保証部', period: '2025/06/15 - 2025/12/15', status: '差し戻し' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">案件一覧</h1>
        <Button variant="primary">新規案件登録</Button>
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

export default ProjectList;
