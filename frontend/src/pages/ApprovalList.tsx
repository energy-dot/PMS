import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import workflowService, { RequestHistory } from '../services/workflowService';
import projectService from '../services/projectService';
import userService from '../services/userService';

const ApprovalList: React.FC = () => {
  const navigate = useNavigate();
  const [pendingApprovals, setPendingApprovals] = useState<RequestHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectsMap, setProjectsMap] = useState<Record<string, any>>({});
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});

  // 承認待ちの申請一覧を取得
  useEffect(() => {
    const fetchPendingApprovals = async () => {
      setIsLoading(true);
      try {
        const data = await workflowService.getPendingApprovals();
        setPendingApprovals(data);

        // 関連するプロジェクトとユーザーの情報を取得
        const projectIds = [...new Set(data.map(item => item.projectId))];
        const userIds = [...new Set(data.map(item => item.requesterId))];

        try {
          const projects = await Promise.all(projectIds.map(id => projectService.getProject(id)));

          const projMap: Record<string, any> = {};
          projects.forEach(proj => {
            projMap[proj.id] = proj;
          });
          setProjectsMap(projMap);

          const users = await Promise.all(userIds.map(id => userService.getUser(id)));

          const userMap: Record<string, any> = {};
          users.forEach(user => {
            userMap[user.id] = user;
          });
          setUsersMap(userMap);
        } catch (err) {
          console.error('Failed to fetch related data:', err);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '承認待ちの申請データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingApprovals();
  }, []);

  // 申請詳細画面へ遷移
  const handleViewApproval = (id: string) => {
    navigate(`/approvals/${id}`);
  };

  // 承認処理
  const handleApprove = async (id: string) => {
    if (!window.confirm('この申請を承認してもよろしいですか？')) {
      return;
    }

    setIsLoading(true);
    try {
      // 現在のユーザーIDを取得（実際の実装ではログインユーザーのIDを使用）
      const currentUser = await userService.getCurrentUser();

      await workflowService.approveProject(id, currentUser.id);
      // 承認後、リストを更新
      const updatedApprovals = pendingApprovals.filter(approval => approval.id !== id);
      setPendingApprovals(updatedApprovals);
      alert('申請を承認しました');
    } catch (err: any) {
      setError(err.response?.data?.message || '承認処理に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 差戻し処理
  const handleReject = async (id: string) => {
    const reason = window.prompt('差戻し理由を入力してください');
    if (reason === null) {
      return; // キャンセルされた場合
    }

    if (!reason.trim()) {
      alert('差戻し理由を入力してください');
      return;
    }

    setIsLoading(true);
    try {
      // 現在のユーザーIDを取得（実際の実装ではログインユーザーのIDを使用）
      const currentUser = await userService.getCurrentUser();

      await workflowService.rejectProject(id, currentUser.id, reason);
      // 差戻し後、リストを更新
      const updatedApprovals = pendingApprovals.filter(approval => approval.id !== id);
      setPendingApprovals(updatedApprovals);
      alert('申請を差し戻しました');
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

  // プロジェクト名を取得
  const getProjectName = (projectId: string): string => {
    return projectsMap[projectId]?.name || 'Unknown Project';
  };

  // ユーザー名を取得
  const getUserName = (userId: string): string => {
    return usersMap[userId]?.name || 'Unknown User';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">承認待ち一覧</h1>
      </div>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      ) : pendingApprovals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-center">承認待ちの申請はありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map(approval => (
            <div key={approval.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">申請タイプ</h3>
                  <p className="mt-1 text-lg font-semibold">{approval.requestType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">申請日</h3>
                  <p className="mt-1">{formatDate(approval.requestDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">プロジェクト</h3>
                  <p className="mt-1">{getProjectName(approval.projectId)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">申請者</h3>
                  <p className="mt-1">{getUserName(approval.requesterId)}</p>
                </div>
                {approval.remarks && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">備考</h3>
                    <p className="mt-1 whitespace-pre-line">{approval.remarks}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => handleViewApproval(approval.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  詳細
                </Button>
                <Button
                  onClick={() => handleApprove(approval.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  承認
                </Button>
                <Button
                  onClick={() => handleReject(approval.id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading}
                >
                  差戻し
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalList;
