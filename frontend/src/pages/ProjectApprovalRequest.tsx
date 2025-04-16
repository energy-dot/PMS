import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import projectService from '../services/projectService';
import workflowService from '../services/workflowService';
import userService from '../services/userService';

const ProjectApprovalRequest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // プロジェクトデータの取得
  useEffect(() => {
    if (!id) return;

    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const data = await projectService.getProject(id);
        setProject(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'プロジェクトデータの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  // 承認申請処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsLoading(true);
    try {
      // 現在のユーザーIDを取得（実際の実装ではログインユーザーのIDを使用）
      const currentUser = await userService.getCurrentUser();

      await workflowService.requestProjectApproval(id, currentUser.id, remarks);
      alert('承認申請を送信しました');
      navigate(`/projects/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || '承認申請の送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 日付のフォーマット
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // プロジェクト詳細画面に戻る
  const handleBack = () => {
    navigate(`/projects/${id}`);
  };

  if (isLoading && !project) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  if (error && !project) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert type="error">{error}</Alert>
        <Button onClick={handleBack} className="mt-4">
          プロジェクト詳細に戻る
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert type="error">プロジェクトデータが見つかりません</Alert>
        <Button onClick={handleBack} className="mt-4">
          プロジェクト詳細に戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">案件承認申請</h1>
        <Button onClick={handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
          キャンセル
        </Button>
      </div>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">プロジェクト情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">プロジェクト名</h3>
            <p className="mt-1">{project.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">クライアント</h3>
            <p className="mt-1">{project.client}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">開始日</h3>
            <p className="mt-1">{formatDate(project.startDate)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">終了日</h3>
            <p className="mt-1">{formatDate(project.endDate)}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">説明</h3>
            <p className="mt-1 whitespace-pre-line">{project.description || '-'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">承認申請</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">申請備考</label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="申請に関する備考があれば入力してください"
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? '送信中...' : '承認申請を送信'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectApprovalRequest;
