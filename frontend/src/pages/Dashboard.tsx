import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Dashboard: React.FC = () => {
  // KPI データ
  const kpiData = [
    { title: '総パートナー会社数', value: 42, change: '+3' },
    { title: '募集中案件数', value: 15, change: '-2' },
    { title: '稼働中要員総数', value: 78, change: '+5' },
    { title: '今月の契約終了予定', value: 8, change: '0' },
  ];

  // タスク管理データ
  const taskColumnDefs = [
    { field: 'type', headerName: '種別', width: 120 },
    { field: 'title', headerName: '内容', flex: 1 },
    { field: 'status', headerName: 'ステータス', width: 120 },
    { field: 'deadline', headerName: '期限', width: 120 },
  ];

  const taskRowData = [
    { type: '案件申請', title: 'Javaエンジニア募集', status: '承認待ち', deadline: '2025/04/10' },
    { type: '単価変更', title: '鈴木一郎の単価変更申請', status: '承認待ち', deadline: '2025/04/15' },
    { type: '応募', title: 'インフラエンジニア案件への応募', status: '書類選考中', deadline: '2025/04/08' },
    { type: '契約更新', title: '田中太郎の契約更新', status: '更新待ち', deadline: '2025/04/30' },
    { type: '評価', title: '3月終了案件の要員評価', status: '未対応', deadline: '2025/04/20' },
  ];

  return (
    <div>
      <h1 className="page-title">ダッシュボード</h1>
      
      {/* KPI セクション */}
      <div className="card mb-4">
        <h2 className="page-subtitle">主要KPI</h2>
        <div className="flex gap-4">
          {kpiData.map((kpi, index) => (
            <div key={index} className="card p-4 flex-1">
              <div className="text-lg font-bold">{kpi.title}</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{kpi.value}</span>
                <span className={kpi.change.startsWith('+') ? 'text-success-color' : kpi.change.startsWith('-') ? 'text-error-color' : ''}>
                  {kpi.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* タスク管理セクション */}
      <div className="card mb-4">
        <h2 className="page-subtitle">タスク管理</h2>
        <div className="ag-theme-alpine" style={{ height: 300 }}>
          <AgGridReact
            columnDefs={taskColumnDefs}
            rowData={taskRowData}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      </div>
      
      {/* 期限管理セクション */}
      <div className="card">
        <h2 className="page-subtitle">期限管理</h2>
        <div className="alert alert-warning">
          <strong>注意:</strong> 5件の契約が30日以内に終了します。確認してください。
        </div>
        <div className="alert alert-error">
          <strong>警告:</strong> 2社のパートナー会社の反社チェックが期限切れになります。
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
