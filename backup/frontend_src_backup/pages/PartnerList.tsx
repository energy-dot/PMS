import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const PartnerList: React.FC = () => {
  // パートナー会社データ
  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: '会社名', flex: 1 },
    { field: 'address', headerName: '所在地', flex: 1 },
    { field: 'phone', headerName: '電話番号', width: 150 },
    { field: 'status', headerName: 'ステータス', width: 120, 
      cellRenderer: (params: any) => {
        const status = params.value;
        let className = '';
        
        switch (status) {
          case '取引中':
            className = 'status-badge status-active';
            break;
          case '取引停止':
            className = 'status-badge status-rejected';
            break;
          case '候補':
            className = 'status-badge status-pending';
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
            <button className="action-button delete">削除</button>
          </div>
        );
      }
    }
  ];

  const rowData = [
    { id: 1, name: '株式会社テクノソリューション', address: '東京都渋谷区神宮前5-52-2', phone: '03-1234-5678', status: '取引中' },
    { id: 2, name: 'デジタルイノベーション株式会社', address: '東京都新宿区西新宿2-8-1', phone: '03-8765-4321', status: '取引中' },
    { id: 3, name: '株式会社ITプロフェッショナル', address: '東京都千代田区丸の内1-9-1', phone: '03-2345-6789', status: '取引停止' },
    { id: 4, name: 'サイバーテック株式会社', address: '大阪府大阪市北区梅田3-1-3', phone: '06-1234-5678', status: '取引中' },
    { id: 5, name: '株式会社システムクリエイト', address: '福岡県福岡市博多区博多駅前2-1-1', phone: '092-123-4567', status: '候補' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">パートナー会社一覧</h1>
        <Button variant="primary">新規登録</Button>
      </div>
      
      <div className="card p-4">
        <div className="flex gap-4 mb-4">
          <Input placeholder="会社名で検索" />
          <Button>検索</Button>
        </div>
        
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

export default PartnerList;
