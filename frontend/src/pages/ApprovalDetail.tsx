import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import workflowService, { RequestHistory } from '../services/workflowService';
import projectService from '../services/projectService';
import userService from '../services/userService';

const ApprovalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [requestHistory, setRequestHistory] = useState<RequestHistory | null>(null);
  const [project, setProject] = useState<any | null>(null);
  const [requester, setRequester] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // 申請履歴データの取得
  useEffect(() => {
    if (!id) return;

    const fetchRequestHistoryData = async () => {
      setIsLoading(true);
      try {
        const data = await workflowService.getRequestHistory(id);
        setRequestHistory(data);

        // 関連データの取得
        if (data.projectId) {
          try {
            const projectData = await projectService.getProject(data.projectId);
            setProject(projectData);
          } catch (err) {
            console.error('Failed to fetch project:', err);
          }
        }

        if (data.requesterId) {
          try {
            const userData = await userService.getUser(data.requesterId);
            setRequester(userData);
          } catch (err) {
            console.error('Failed to fetch requester:', err);
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '申請履歴データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestHistoryData();
  }, [id]);

  // 承認処理
  const handleApprove = async () => {
    if (!id) return;
    if (!window.confirm('この申請を承認してもよろしいですか？')) {
      return;
    }

    setIsLoading(true);
    try {
      // 現在のユーザーIDを取得（実際の実装ではログインユーザーのIDを使用）
      const currentUser = await userService.getCurrentUser();

      await workflowService.approveProject(id, currentUser.id);
      alert('申請を承認しました');
      navigate('/approvals');
    } catch (err: any) {
      setError(err.response?.data?.message || '承認処理に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 差戻し処理
  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!rejectReason.trim()) {
      alert('差戻し理由を入力してください');
      return;
    }

    setIsLoading(true);
    try {
      // 現在のユーザーIDを取得（実際の実装ではログインユーザーのIDを使用）
      const currentUser = await userService.getCurrentUser();

      await workflowService.rejectProject(id, currentUser.id, rejectReason);
      alert('申請を差し戻しました');
      navigate('/approvals');
    } catch (err: any) {
      setError(err.response?.data?.message || '差戻し処理に失敗しました');
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

  // 一覧画面に戻る
  const handleBack = () => {
    navigate('/approvals');
  };

  if (isLoading && !requestHistory) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  if (error && !requestHistory) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert type="error">{error}</Alert>
        <Button onClick={handleBack} className="mt-4">
          一覧に戻る
        </Button>
      </div>
    );
  }

  if (!requestHistory) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert type="error">申請履歴データが見つかりません</Alert>
        <Button onClick={handleBack} className="mt-4">
          一覧に戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">申請詳細</h1>
        <Button onClick={handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
          一覧に戻る
        </Button>
      </div>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">申請タイプ</h3>
            <p className="mt-1 text-lg font-semibold">{requestHistory.requestType}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">申請ステータス</h3>
            <p className="mt-1">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  requestHistory.requestStatus === '承認待ち'
                    ? 'bg-yellow-100 text-yellow-800'
                    : requestHistory.requestStatus === '承認済み'
                      ? 'bg-green-100 text-green-800'
                      : requestHistory.requestStatus === '差戻し'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                }`}
              >
                {requestHistory.requestStatus}
              </span>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">申請日</h3>
            <p className="mt-1">{formatDate(requestHistory.requestDate)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">プロジェクト</h3>
            <p className="mt-1">{project?.name || '-'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">申請者</h3>
            <p className="mt-1">{requester?.name || '-'}</p>
          </div>

          {requestHistory.approvalDate && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">承認/差戻し日</h3>
              <p className="mt-1">{formatDate(requestHistory.approvalDate)}</p>
            </div>
          )}

          {requestHistory.remarks && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">備考</h3>
              <p className="mt-1 whitespace-pre-line">{requestHistory.remarks}</p>
            </div>
          )}

          {requestHistory.rejectionReason && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">差戻し理由</h3>
              <p className="mt-1 whitespace-pre-line">{requestHistory.rejectionReason}</p>
            </div>
          )}
        </div>

        {requestHistory.requestStatus === '承認待ち' && (
          <div className="mt-6 flex justify-end space-x-2">
            <Button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              承認
            </Button>
            <Button
              onClick={() => setShowRejectForm(!showRejectForm)}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {showRejectForm ? 'キャンセル' : '差戻し'}
            </Button>
          </div>
        )}
      </div>

      {showRejectForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">差戻し理由</h2>
          <form onSubmit={handleReject}>
            <div className="mb-4">
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="差戻し理由を入力してください"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                差戻しを確定
              </Button>
            </div>
          </form>
        </div>
      )}

      {project && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
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
      )}
    </div>
  );
};

export default ApprovalDetail;
