import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuthStore } from '../store/user/authStore';

// Chart.js登録
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title
);

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // KPI指標
  const [kpiData, setKpiData] = useState<any>({
    totalPartners: 42,
    totalOpenings: 15,
    activeStaff: 78,
    contractsEndingSoon: 8,
    changeRates: {
      totalPartners: '+3',
      totalOpenings: '-2',
      activeStaff: '+5',
      contractsEndingSoon: '0',
    }
  });

  // 承認待ちタスクデータ
  const [pendingTasks, setPendingTasks] = useState<any[]>([
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
  ]);

  // 期限管理用のアラートメッセージ
  const expiringContractsMessage = '注意: 5件の契約が30日以内に終了します。確認してください。';
  const partnerCheckMessage = '警告: 2社のパートナー会社の反社チェックが期限切れになります。';

  // 初期データの読み込み
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // APIからデータを取得する処理（省略）
        // 実際のAPIが利用できないため、モックデータを使用
        
        // データ読み込み完了
        setLoading(false);
      } catch (err: any) {
        console.error('ダッシュボードデータの取得に失敗しました:', err);
        setError('ダッシュボードデータの取得に失敗しました: ' + (err.message || '不明なエラー'));
        setLoading(false);
      }
    };

    // データ取得を実行
    fetchDashboardData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg">データを読み込み中...</p>
        </div>
      ) : (
        <>
          {/* KPI指標カード */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">主要KPI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">総パートナー会社数</h3>
                <p className="text-3xl font-bold text-blue-600">{kpiData.totalPartners} <span className="text-sm text-green-500">{kpiData.changeRates.totalPartners}</span></p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">募集中案件数</h3>
                <p className="text-3xl font-bold text-green-600">{kpiData.totalOpenings} <span className="text-sm text-red-500">{kpiData.changeRates.totalOpenings}</span></p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">稼働中要員数</h3>
                <p className="text-3xl font-bold text-purple-600">{kpiData.activeStaff} <span className="text-sm text-green-500">{kpiData.changeRates.activeStaff}</span></p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">今月の契約終了予定</h3>
                <p className="text-3xl font-bold text-orange-600">{kpiData.contractsEndingSoon} <span className="text-sm text-gray-500">{kpiData.changeRates.contractsEndingSoon}</span></p>
              </div>
            </div>
          </div>

          {/* タスク管理 */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">タスク管理</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">種別</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内容</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期限</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingTasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{task.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{task.content}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{task.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{task.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between">
              <span className="text-sm text-gray-500">1 to 5 of 5</span>
              <div className="flex">
                <button className="px-2 py-1 border rounded mr-1 text-sm" disabled>
                  前へ
                </button>
                <button className="px-2 py-1 border rounded text-sm" disabled>
                  次へ
                </button>
              </div>
            </div>
          </div>

          {/* 期限管理 */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">期限管理</h2>
            <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-yellow-700">{expiringContractsMessage}</p>
            </div>
            <div className="p-3 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-700">{partnerCheckMessage}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
