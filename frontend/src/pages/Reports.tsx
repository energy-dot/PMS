import React, { useState, useEffect } from 'react';
import { ColDef } from 'ag-grid-community';
import DataGrid from '../components/grids/DataGrid';
import '../components/grids/DataGrid.css';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import DatePicker from '../components/common/DatePicker';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Chart.js登録
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Reports: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // レポートタイプ
  const [reportType, setReportType] = useState<string>('project_status');

  // フィルター
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(new Date().setMonth(new Date().getMonth() - 3))
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [department, setDepartment] = useState<string>('all');
  const [departments, setDepartments] = useState<any[]>([]);

  // レポートデータ
  const [reportData, setReportData] = useState<any>(null);
  const [tableData, setTableData] = useState<any[]>([]);

  // レポートタイプオプション
  const reportTypeOptions = [
    { value: 'project_status', label: '案件ステータス集計' },
    { value: 'partner_projects', label: 'パートナー別案件数' },
    { value: 'application_status', label: '応募状況集計' },
    { value: 'staff_evaluation', label: '要員評価集計' },
    { value: 'contract_summary', label: '契約状況サマリー' },
    { value: 'monthly_project_trend', label: '月別案件推移' },
  ];

  // 初期データの読み込み
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/departments`);
        setDepartments(response.data);
      } catch (err: any) {
        setError('部署データの取得に失敗しました: ' + (err.message || '不明なエラー'));
      }
    };

    fetchDepartments();
  }, []);

  // レポートデータの取得
  useEffect(() => {
    if (reportType) {
      fetchReportData();
    }
  }, [reportType, startDate, endDate, department]);

  // レポートデータ取得関数
  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // クエリパラメータの構築
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
      if (endDate) params.append('endDate', endDate.toISOString().split('T')[0]);
      if (department !== 'all') params.append('department', department);

      const response = await axios.get(
        `${API_BASE_URL}/reports/${reportType}?${params.toString()}`
      );
      setReportData(response.data);

      // テーブルデータの設定
      if (response.data.tableData) {
        setTableData(response.data.tableData);
      } else {
        setTableData([]);
      }

      setLoading(false);
    } catch (err: any) {
      setError('レポートデータの取得に失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };

  // レポートタイプ変更ハンドラー
  const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
  };

  // 部署変更ハンドラー
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value);
  };

  // 開始日変更ハンドラー
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  // 終了日変更ハンドラー
  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  // レポート出力ハンドラー
  const handleExportReport = async () => {
    try {
      setLoading(true);

      // クエリパラメータの構築
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
      if (endDate) params.append('endDate', endDate.toISOString().split('T')[0]);
      if (department !== 'all') params.append('department', department);
      params.append('format', 'excel');

      const response = await axios.get(
        `${API_BASE_URL}/reports/${reportType}/export?${params.toString()}`,
        {
          responseType: 'blob',
        }
      );

      // ファイルのダウンロード
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${reportType}_report_${new Date().toISOString().split('T')[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess('レポートをエクスポートしました');
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (err: any) {
      setError('レポートのエクスポートに失敗しました: ' + (err.message || '不明なエラー'));
      setLoading(false);
    }
  };

  // レポートタイプに基づいたテーブル列定義の取得
  const getColumnDefs = (): ColDef[] => {
    switch (reportType) {
      case 'project_status':
        return [
          { headerName: 'ステータス', field: 'status', sortable: true, filter: true, flex: 1 },
          { headerName: '案件数', field: 'count', sortable: true, filter: true, width: 120 },
          {
            headerName: '割合',
            field: 'percentage',
            sortable: true,
            filter: true,
            width: 120,
            valueFormatter: params => `${params.value}%`,
          },
        ];

      case 'partner_projects':
        return [
          {
            headerName: 'パートナー会社',
            field: 'partnerName',
            sortable: true,
            filter: true,
            flex: 1,
          },
          { headerName: '案件数', field: 'projectCount', sortable: true, filter: true, width: 120 },
          { headerName: '要員数', field: 'staffCount', sortable: true, filter: true, width: 120 },
          {
            headerName: '平均単価',
            field: 'averageRate',
            sortable: true,
            filter: true,
            width: 150,
            valueFormatter: params => `¥${params.value.toLocaleString()}`,
          },
        ];

      case 'application_status':
        return [
          { headerName: '応募ステータス', field: 'status', sortable: true, filter: true, flex: 1 },
          { headerName: '応募者数', field: 'count', sortable: true, filter: true, width: 120 },
          {
            headerName: '割合',
            field: 'percentage',
            sortable: true,
            filter: true,
            width: 120,
            valueFormatter: params => `${params.value}%`,
          },
        ];

      case 'staff_evaluation':
        return [
          { headerName: '評価項目', field: 'category', sortable: true, filter: true, flex: 1 },
          {
            headerName: '平均スコア',
            field: 'averageScore',
            sortable: true,
            filter: true,
            width: 150,
          },
          { headerName: '最高スコア', field: 'maxScore', sortable: true, filter: true, width: 150 },
          { headerName: '最低スコア', field: 'minScore', sortable: true, filter: true, width: 150 },
        ];

      case 'contract_summary':
        return [
          {
            headerName: '契約タイプ',
            field: 'contractType',
            sortable: true,
            filter: true,
            flex: 1,
          },
          { headerName: '契約数', field: 'count', sortable: true, filter: true, width: 120 },
          {
            headerName: '平均単価',
            field: 'averageRate',
            sortable: true,
            filter: true,
            width: 150,
            valueFormatter: params => `¥${params.value.toLocaleString()}`,
          },
          {
            headerName: '合計金額',
            field: 'totalAmount',
            sortable: true,
            filter: true,
            width: 150,
            valueFormatter: params => `¥${params.value.toLocaleString()}`,
          },
        ];

      case 'monthly_project_trend':
        return [
          { headerName: '月', field: 'month', sortable: true, filter: true, width: 120 },
          {
            headerName: '新規案件数',
            field: 'newProjects',
            sortable: true,
            filter: true,
            width: 150,
          },
          {
            headerName: '終了案件数',
            field: 'endedProjects',
            sortable: true,
            filter: true,
            width: 150,
          },
          {
            headerName: '進行中案件数',
            field: 'activeProjects',
            sortable: true,
            filter: true,
            width: 150,
          },
        ];

      default:
        return [];
    }
  };

  // チャートの表示
  const renderChart = () => {
    if (!reportData || !reportData.chartData) return null;

    const { chartData } = reportData;

    switch (reportType) {
      case 'project_status':
      case 'application_status':
        return (
          <div className="w-full max-w-xl mx-auto">
            <Pie
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    data: chartData.data,
                    backgroundColor: [
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(153, 102, 255, 0.6)',
                      'rgba(255, 159, 64, 0.6)',
                      'rgba(199, 199, 199, 0.6)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  title: {
                    display: true,
                    text:
                      reportType === 'project_status' ? '案件ステータス分布' : '応募ステータス分布',
                  },
                },
              }}
            />
          </div>
        );

      case 'partner_projects':
        return (
          <div className="w-full">
            <Bar
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    label: '案件数',
                    data: chartData.projectCounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                  },
                  {
                    label: '要員数',
                    data: chartData.staffCounts,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'パートナー別案件数・要員数',
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
        );

      case 'staff_evaluation':
        return (
          <div className="w-full">
            <Bar
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    label: '平均スコア',
                    data: chartData.averageScores,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: '要員評価カテゴリ別平均スコア',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 5,
                  },
                },
              }}
            />
          </div>
        );

      case 'contract_summary':
        return (
          <div className="w-full">
            <Bar
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    label: '契約数',
                    data: chartData.counts,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    yAxisID: 'y',
                  },
                  {
                    label: '平均単価（万円）',
                    data: chartData.averageRates.map((rate: number) => rate / 10000),
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: '契約タイプ別サマリー',
                  },
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                },
              }}
            />
          </div>
        );

      case 'monthly_project_trend':
        return (
          <div className="w-full">
            <Bar
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    label: '新規案件',
                    data: chartData.newProjects,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                  },
                  {
                    label: '終了案件',
                    data: chartData.endedProjects,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                  },
                  {
                    label: '進行中案件',
                    data: chartData.activeProjects,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    type: 'line',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: '月別案件推移',
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">レポート</h1>

      {error && <Alert type="error" message={error} className="mb-4" />}
      {success && <Alert type="success" message={success} className="mb-4" />}

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Select
              label="レポートタイプ"
              name="reportType"
              value={reportType}
              onChange={handleReportTypeChange}
              options={reportTypeOptions}
            />
          </div>

          <div>
            <DatePicker
              label="開始日"
              selected={startDate}
              onChange={handleStartDateChange}
              maxDate={endDate || undefined}
            />
          </div>

          <div>
            <DatePicker
              label="終了日"
              selected={endDate}
              onChange={handleEndDateChange}
              minDate={startDate || undefined}
            />
          </div>

          <div>
            <Select
              label="部署"
              name="department"
              value={department}
              onChange={handleDepartmentChange}
              options={[
                { value: 'all', label: '全部署' },
                ...departments.map(dept => ({
                  value: dept.id,
                  label: dept.name,
                })),
              ]}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="button" variant="primary" onClick={handleExportReport} disabled={loading}>
            Excelエクスポート
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg">データを読み込み中...</p>
        </div>
      ) : reportData ? (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {reportTypeOptions.find(option => option.value === reportType)?.label || 'レポート'}
            </h2>

            {/* チャート表示 */}
            <div className="mb-6">{renderChart()}</div>

            {/* サマリー表示 */}
            {reportData.summary && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {Object.entries(reportData.summary).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">{key}</p>
                    <p className="text-xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* テーブル表示 */}
            {tableData.length > 0 && (
              <DataGrid
                data={tableData}
                columns={getColumnDefs()}
                pagination={true}
                pageSize={10}
                loading={loading}
                emptyMessage={error || '表示するデータがありません'}
                onRowClick={(data) => {
                  // 行クリック時の処理
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg">レポートタイプを選択してください</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
