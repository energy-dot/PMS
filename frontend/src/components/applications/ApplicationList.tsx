// components/applications/ApplicationList.tsxの修正

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataGrid from '../grids/DataGrid';
import { Application } from '../../shared-types';
import applicationService from '../../services/applicationService';

// ApplicationListコンポーネント
const ApplicationList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // アプリケーションデータの取得
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await applicationService.getApplications();
        setApplications(data);
      } catch (err) {
        setError('申請データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // DataGridのカラム定義
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      renderCell: (row: Application) => <Link to={`/applications/${row.id}`}>{row.id}</Link>,
    },
    {
      field: 'projectId',
      headerName: 'プロジェクト',
      width: 200,
    },
    {
      field: 'partnerId',
      headerName: 'パートナー',
      width: 200,
    },
    {
      field: 'applicationDate',
      headerName: '申請日',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'ステータス',
      width: 150,
      renderCell: (row: Application) => {
        let statusClass = '';
        let statusText = '';

        switch (row.status) {
          case 'pending':
            statusClass = 'status-pending';
            statusText = '審査中';
            break;
          case 'reviewing':
            statusClass = 'status-reviewing';
            statusText = '確認中';
            break;
          case 'accepted':
            statusClass = 'status-accepted';
            statusText = '承認済';
            break;
          case 'rejected':
            statusClass = 'status-rejected';
            statusText = '却下';
            break;
          default:
            statusText = row.status;
        }

        return <span className={`status-badge ${statusClass}`}>{statusText}</span>;
      },
    },
  ];

  // アクションボタン定義
  const actionButtons = [
    {
      label: '新規申請',
      onClick: () => {
        window.location.href = '/applications/new';
      },
      variant: 'primary' as const,
    },
  ];

  return (
    <div className="application-list">
      <DataGrid
        title="申請一覧"
        data={applications}
        columns={columns}
        loading={loading}
        actionButtons={actionButtons}
        onRowClick={row => {
          window.location.href = `/applications/${row.id}`;
        }}
        emptyMessage={error || '申請データがありません'}
      />
    </div>
  );
};

export default ApplicationList;
