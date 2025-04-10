import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import workflowService from '../../services/workflowService';

interface ApprovalWorkflowProps {
  projectId: string;
}

interface RequestHistory {
  id: string;
  requesterId: string;
  requester?: {
    fullName: string;
  };
  approverId?: string;
  approver?: {
    fullName: string;
  };
  requestDate: string;
  approvalDate?: string;
  rejectionDate?: string;
  rejectionReason?: string;
  status: string;
  remarks?: string;
}

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ projectId }) => {
  const [requestHistories, setRequestHistories] = useState<RequestHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalComment, setApprovalComment] = useState('');

  useEffect(() => {
    const fetchRequestHistories = async () => {
      setIsLoading(true);
      try {
        const data = await workflowService.getRequestHistoriesByProjectId(projectId);
        setRequestHistories(data);
      } catch (err: any) {
        setError(err.response?.data?.message || '承認履歴の取得に失敗しました');
        console.error('Failed to fetch request histories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestHistories();
  }, [projectId]);

  // 日付を表示用にフォーマット
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }) + 
           ' ' + d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  // 承認処理
  const handleApprove = async (requestId: string) => {
    try {
      await workflowService.approveProject(requestId, {
        approverId: 'current-user-id', // 実際のユーザーIDに置き換える
        remarks: approvalComment
      });
      
      // 承認履歴を再取得
      const data = await workflowService.getRequestHistoriesByProjectId(projectId);
      setRequestHistories(data);
      
      setApprovalComment('');
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || '承認処理に失敗しました');
      console.error('Failed to approve project:', err);
    }
  };

  // 差戻し処理
  const handleReject = async (requestId: string) => {
    if (!approvalComment) {
      setError('差戻し理由を入力してください');
      return;
    }
    
    try {
      await workflowService.rejectProject(requestId, {
        approverId: 'current-user-id', // 実際のユーザーIDに置き換える
        rejectionReason: approvalComment
      });
      
      // 承認履歴を再取得
      const data = await workflowService.getRequestHistoriesByProjectId(projectId);
      setRequestHistories(data);
      
      setApprovalComment('');
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || '差戻し処理に失敗しました');
      console.error('Failed to reject project:', err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">承認履歴を読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (requestHistories.length === 0) {
    return <div className="text-center py-4">この案件の承認申請履歴はありません。</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h4 className="font-semibold mb-2">承認履歴</h4>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">申請日時</th>
                <th className="py-2 px-4 text-left">申請者</th>
                <th className="py-2 px-4 text-left">ステータス</th>
                <th className="py-2 px-4 text-left">承認者</th>
                <th className="py-2 px-4 text-left">承認/差戻し日時</th>
                <th className="py-2 px-4 text-left">備考</th>
              </tr>
            </thead>
            <tbody>
              {requestHistories.map((history) => (
                <tr key={history.id} className="border-t">
                  <td className="py-2 px-4">{formatDate(history.requestDate)}</td>
                  <td className="py-2 px-4">{history.requester?.fullName || history.requesterId}</td>
                  <td className="py-2 px-4">
                    <span className={`status-badge ${
                      history.status === '承認待ち' ? 'status-pending' :
                      history.status === '承認済み' ? 'status-success' :
                      history.status === '差戻し' ? 'status-rejected' : ''
                    }`}>
                      {history.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{history.approver?.fullName || history.approverId || '-'}</td>
                  <td className="py-2 px-4">
                    {history.approvalDate ? formatDate(history.approvalDate) :
                     history.rejectionDate ? formatDate(history.rejectionDate) : '-'}
                  </td>
                  <td className="py-2 px-4">
                    {history.rejectionReason ? 
                      <span className="text-red-600">{history.rejectionReason}</span> : 
                      history.remarks || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 最新の申請が承認待ちの場合、承認/差戻し操作を表示 */}
      {requestHistories.length > 0 && 
       requestHistories[0].status === '承認待ち' && (
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">承認操作</h4>
          <div className="mb-4">
            <label htmlFor="approval-comment" className="block mb-1">コメント</label>
            <textarea
              id="approval-comment"
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              className="w-full border rounded p-2"
              rows={3}
              placeholder="承認または差戻しのコメントを入力してください"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleApprove(requestHistories[0].id)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              承認
            </button>
            <button
              onClick={() => handleReject(requestHistories[0].id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              差戻し
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalWorkflow;
