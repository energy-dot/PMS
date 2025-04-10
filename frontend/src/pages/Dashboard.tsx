import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuthStore } from '../store/authStore';

// Chart.js登録
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // ダッシュボードデータ
  const [projectStatusData, setProjectStatusData] = useState<any>(null);
  const [applicationStatusData, setApplicationStatusData] = useState<any>(null);
  const [monthlyTrendData, setMonthlyTrendData] = useState<any>(null);
  const [partnerProjectsData, setPartnerProjectsData] = useState<any>(null);
  
  // KPI指標
  const [kpiData, setKpiData] = useState<any>({
    totalProjects: 0,
    activeProjects: 0,
    totalApplications: 0,
    pendingApprovals: 0,
    recentNotifications: []
  });
  
  // 初期データの読み込み
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 案件ステータス集計データの取得
        const projectStatusResponse = await axios.get(`${API_BASE_URL}/reports/project_status`);
        setProjectStatusData(projectStatusResponse.data);
        
        // 応募状況集計データの取得
        const applicationStatusResponse = await axios.get(`${API_BASE_URL}/reports/application_status`);
        setApplicationStatusData(applicationStatusResponse.data);
        
        // 月別案件推移データの取得
        const monthlyTrendResponse = await axios.get(`${API_BASE_URL}/reports/monthly_project_trend`);
        setMonthlyTrendData(monthlyTrendResponse.data);
        
        // パートナー別案件数データの取得
        const partnerProjectsResponse = await axios.get(`${API_BASE_URL}/reports/partner_projects`);
        setPartnerProjectsData(partnerProjectsResponse.data);
        
        // KPI指標データの取得
        const kpiResponse = await axios.get(`${API_BASE_URL}/dashboard/kpi`);
        setKpiData(kpiResponse.data);
        
        setLoading(false);
      } catch (err: any) {
        setError('ダッシュボードデータの取得に失敗しました: ' + (err.message || '不明なエラー'));
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // 案件ステータス円グラフの設定
  const projectStatusChartData = {
    labels: projectStatusData?.chartData?.labels || [],
    datasets: [
      {
        data: projectStatusData?.chartData?.data || [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // 応募状況円グラフの設定
  const applicationStatusChartData = {
    labels: applicationStatusData?.chartData?.labels || [],
    datasets: [
      {
        data: applicationStatusData?.chartData?.data || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // 月別案件推移グラフの設定
  const monthlyTrendChartData = {
    labels: monthlyTrendData?.chartData?.labels || [],
    datasets: [
      {
        label: '新規案件',
        data: monthlyTrendData?.chartData?.newProjects || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: '終了案件',
        data: monthlyTrendData?.chartData?.endedProjects || [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: '進行中案件',
        data: monthlyTrendData?.chartData?.activeProjects || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        type: 'line',
      },
    ],
  };
  
  // パートナー別案件数グラフの設定
  const partnerProjectsChartData = {
    labels: partnerProjectsData?.chartData?.labels?.slice(0, 5) || [],
    datasets: [
      {
        label: '案件数',
        data: partnerProjectsData?.chartData?.projectCounts?.slice(0, 5) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: '要員数',
        data: partnerProjectsData?.chartData?.staffCounts?.slice(0, 5) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
  
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">総案件数</h3>
              <p className="text-3xl font-bold text-blue-600">{kpiData.totalProjects}</p>
              <p className="text-sm text-gray-500">全案件の総数</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">進行中案件</h3>
              <p className="text-3xl font-bold text-green-600">{kpiData.activeProjects}</p>
              <p className="text-sm text-gray-500">現在進行中の案件数</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">応募総数</h3>
              <p className="text-3xl font-bold text-purple-600">{kpiData.totalApplications}</p>
              <p className="text-sm text-gray-500">全応募者の総数</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">承認待ち</h3>
              <p className="text-3xl font-bold text-orange-600">{kpiData.pendingApprovals}</p>
              <p className="text-sm text-gray-500">承認待ちの案件数</p>
            </div>
          </div>
          
          {/* グラフセクション - 上段 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 案件ステータス円グラフ */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">案件ステータス分布</h3>
              <div className="h-64">
                <Pie
                  data={projectStatusChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            {/* 応募状況円グラフ */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">応募状況分布</h3>
              <div className="h-64">
                <Pie
                  data={applicationStatusChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* グラフセクション - 下段 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 月別案件推移グラフ */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">月別案件推移</h3>
              <div className="h-64">
                <Bar
                  data={monthlyTrendChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            {/* パートナー別案件数グラフ */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">パートナー別案件数（上位5社）</h3>
              <div className="h-64">
                <Bar
                  data={partnerProjectsChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* 最近の通知 */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">最近の通知</h3>
            {kpiData.recentNotifications && kpiData.recentNotifications.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {kpiData.recentNotifications.map((notification: any) => (
                  <li key={notification.id} className="py-3">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-2 w-2 rounded-full mt-2 ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-500">{notification.message}</p>
                        <p className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">最近の通知はありません</p>
            )}
          </div>
          
          {/* 承認待ちタスク */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">承認待ちタスク</h3>
            {kpiData.pendingApprovals > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">案件名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申請者</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申請日</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {kpiData.pendingTasks && kpiData.pendingTasks.map((task: any) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.projectName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.requesterName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(task.requestDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a href={`/approvals/${task.id}`} className="text-indigo-600 hover:text-indigo-900">詳細</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">承認待ちのタスクはありません</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
