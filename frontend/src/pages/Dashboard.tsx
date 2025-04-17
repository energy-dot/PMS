import React from 'react';
import KpiWidget from '../components/dashboard/KpiWidget';
import TaskManagement from '../components/dashboard/TaskManagement';

const Dashboard: React.FC = () => {
  // KPI指標データ
  const kpiData = {
    totalPartners: {
      title: '総パートナー会社数',
      value: 42,
      change: '+3',
      color: 'blue'
    },
    totalOpenings: {
      title: '募集中案件数',
      value: 15,
      change: '-2',
      color: 'green'
    },
    activeStaff: {
      title: '稼働中要員数',
      value: 78,
      change: '+5',
      color: 'purple'
    },
    contractsEndingSoon: {
      title: '今月の契約終了予定',
      value: 8,
      change: '0',
      color: 'orange'
    }
  };

  // タスク管理データ
  const tasks = [
    {
      id: 1,
      type: '案件申請',
      content: 'Javaエンジニア募集',
      status: '承認待ち',
      deadline: '2025/04/10',
    },
    {
      id: 2,
      type: '単価変更',
      content: '鈴木一郎の単価変更申請',
      status: '承認待ち',
      deadline: '2025/04/15',
    },
    {
      id: 3,
      type: '応募',
      content: 'インフラエンジニア案件への応募',
      status: '審査進行中',
      deadline: '2025/04/08',
    },
    {
      id: 4,
      type: '契約更新',
      content: '田中太郎の契約更新',
      status: '更新待ち',
      deadline: '2025/04/30',
    },
    {
      id: 5,
      type: '評価',
      content: '3月終了案件の最終評価',
      status: '未対応',
      deadline: '2025/04/20',
    },
  ];

  // 期限管理用のアラートメッセージ
  const expiringContractsMessage = '注意: 5件の契約が30日以内に終了します。確認してください。';
  const partnerCheckMessage = '警告: 2社のパートナー会社の反社チェックが期限切れになります。';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">ダッシュボード</h1>
      
      {/* KPI指標カード */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">主要KPI</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiWidget 
            title={kpiData.totalPartners.title} 
            value={kpiData.totalPartners.value} 
            change={kpiData.totalPartners.change} 
            color={kpiData.totalPartners.color} 
          />
          <KpiWidget 
            title={kpiData.totalOpenings.title} 
            value={kpiData.totalOpenings.value} 
            change={kpiData.totalOpenings.change} 
            color={kpiData.totalOpenings.color} 
          />
          <KpiWidget 
            title={kpiData.activeStaff.title} 
            value={kpiData.activeStaff.value} 
            change={kpiData.activeStaff.change} 
            color={kpiData.activeStaff.color} 
          />
          <KpiWidget 
            title={kpiData.contractsEndingSoon.title} 
            value={kpiData.contractsEndingSoon.value} 
            change={kpiData.contractsEndingSoon.change} 
            color={kpiData.contractsEndingSoon.color} 
          />
        </div>
      </div>

      {/* タスク管理 */}
      <TaskManagement tasks={tasks} />

      {/* 期限管理 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">期限管理</h2>
        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-yellow-700">{expiringContractsMessage}</p>
        </div>
        <div className="p-3 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700">{partnerCheckMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
