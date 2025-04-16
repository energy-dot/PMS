import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { useAuthStore } from '../store/authStore';

// 評価データの型定義
interface Evaluation {
  id: string;
  staffId: string;
  staffName: string;
  projectId: string;
  projectName: string;
  evaluationDate: string;
  evaluatorName: string;
  overallScore: number;
  skillScore: number;
  communicationScore: number;
  teamworkScore: number;
  attendanceScore: number;
  comments: string;
}

// ダミーデータ生成関数
const generateDummyEvaluations = (): Evaluation[] => {
  return [
    {
      id: '1',
      staffId: 'S001',
      staffName: '山田太郎',
      projectId: 'P001',
      projectName: '基幹システム刷新プロジェクト',
      evaluationDate: '2025-03-15',
      evaluatorName: '佐藤一郎',
      overallScore: 4.2,
      skillScore: 4,
      communicationScore: 4,
      teamworkScore: 5,
      attendanceScore: 4,
      comments: '全体的に良好なパフォーマンスを示しています。特にチームワークが優れています。',
    },
    {
      id: '2',
      staffId: 'S002',
      staffName: '鈴木花子',
      projectId: 'P002',
      projectName: 'ECサイト開発',
      evaluationDate: '2025-03-10',
      evaluatorName: '高橋次郎',
      overallScore: 3.8,
      skillScore: 5,
      communicationScore: 3,
      teamworkScore: 3,
      attendanceScore: 4,
      comments: '技術スキルは非常に高いですが、コミュニケーション面での改善が必要です。',
    },
    {
      id: '3',
      staffId: 'S003',
      staffName: '田中正',
      projectId: 'P001',
      projectName: '基幹システム刷新プロジェクト',
      evaluationDate: '2025-03-05',
      evaluatorName: '佐藤一郎',
      overallScore: 4.5,
      skillScore: 4,
      communicationScore: 5,
      teamworkScore: 5,
      attendanceScore: 4,
      comments: '非常に優秀な人材です。特にコミュニケーション能力とチームワークが素晴らしい。',
    },
  ];
};

// スコア表示用のカスタムセルレンダラー
const ScoreCellRenderer: React.FC<ICellRendererParams> = (props) => {
  const score = props.value;
  let color = 'black';
  if (score >= 4.5) color = 'green';
  else if (score >= 3.5) color = 'blue';
  else if (score >= 2.5) color = 'orange';
  else color = 'red';

  return <span style={{ color, fontWeight: 'bold' }}>{score}</span>;
};

// 操作ボタン用のカスタムセルレンダラー
const ActionCellRenderer: React.FC<ICellRendererParams> = (props) => {
  const navigate = useNavigate();
  const evaluationId = props.data.id;

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/evaluations/${evaluationId}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/evaluations/${evaluationId}/edit`);
  };

  return (
    <div>
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs mr-2"
        onClick={handleView}
      >
        詳細
      </button>
      <button 
        className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded text-xs"
        onClick={handleEdit}
      >
        編集
      </button>
    </div>
  );
};

const EvaluationList: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // 列定義
  const columnDefs: ColDef[] = [
    {
      headerName: '評価ID',
      field: 'id',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: '要員名',
      field: 'staffName',
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: 'プロジェクト名',
      field: 'projectName',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: '評価日',
      field: 'evaluationDate',
      sortable: true,
      filter: true,
      width: 130,
    },
    {
      headerName: '評価者',
      field: 'evaluatorName',
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: '総合評価',
      field: 'overallScore',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: ScoreCellRenderer
    },
    {
      headerName: '操作',
      width: 180,
      cellRenderer: ActionCellRenderer
    },
  ];

  // データの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 通常はAPIからデータを取得するが、ここではダミーデータを使用
        const data = generateDummyEvaluations();

        // 開発担当者の場合は、自分が評価者の評価のみ表示
        const filteredData =
          user?.role === 'developer'
            ? data.filter(evaluation => evaluation.evaluatorName === user.fullName)
            : data;

        setEvaluations(filteredData);
        setLoading(false);
      } catch (err: any) {
        setError('評価データの取得に失敗しました: ' + (err.message || '不明なエラー'));
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // 新規評価作成ハンドラー
  const handleCreateEvaluation = () => {
    navigate('/evaluations/create');
  };

  if (loading) {
    return <div className="p-4 text-center">データを読み込み中...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">要員評価一覧</h1>
        <Button
          variant="primary"
          onClick={handleCreateEvaluation}
          data-testid="create-evaluation-button"
        >
          新規評価作成
        </Button>
      </div>

      {error && (
        <Alert variant="error" message={error} onClose={() => setError(null)} className="mb-4" />
      )}

      <div className="ag-theme-alpine w-full h-[600px]">
        <AgGridReact
          rowData={evaluations}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          rowSelection="single"
          defaultColDef={{
            resizable: true,
          }}
          overlayNoRowsTemplate="表示するデータがありません"
        />
      </div>
    </div>
  );
};

export default EvaluationList;
