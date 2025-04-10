import React from 'react';
import { Application } from '../../services/applicationService';

interface ApplicationListProps {
  applications: Application[];
  onStatusChange: (applicationId: string, newStatus: string) => void;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ applications, onStatusChange }) => {
  // 応募ステータスに応じたスタイルを取得
  const getStatusStyle = (status: string): string => {
    switch (status) {
      case '新規応募':
        return 'status-badge status-new';
      case '書類選考中':
        return 'status-badge status-pending';
      case '書類選考通過':
        return 'status-badge status-success';
      case '面接調整中':
        return 'status-badge status-pending';
      case '面接実施':
        return 'status-badge status-pending';
      case '内定':
        return 'status-badge status-success';
      case '不採用':
        return 'status-badge status-rejected';
      case '辞退':
        return 'status-badge status-rejected';
      default:
        return 'status-badge';
    }
  };

  // 日付を表示用にフォーマット
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // ステータス変更ハンドラー
  const handleStatusChange = (applicationId: string, event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    onStatusChange(applicationId, newStatus);
  };

  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">応募者名</th>
            <th className="py-2 px-4 text-left">所属会社</th>
            <th className="py-2 px-4 text-left">応募日</th>
            <th className="py-2 px-4 text-left">ステータス</th>
            <th className="py-2 px-4 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id} className="border-b">
              <td className="py-2 px-4">{application.applicantName}</td>
              <td className="py-2 px-4">
                <a href={`/partners/${application.partnerId}`} className="text-blue-600 hover:underline">
                  {application.partner?.name || application.partnerId}
                </a>
              </td>
              <td className="py-2 px-4">{formatDate(application.applicationDate)}</td>
              <td className="py-2 px-4">
                <span className={getStatusStyle(application.status)}>{application.status}</span>
              </td>
              <td className="py-2 px-4">
                <div className="flex items-center space-x-2">
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="新規応募">新規応募</option>
                    <option value="書類選考中">書類選考中</option>
                    <option value="書類選考通過">書類選考通過</option>
                    <option value="面接調整中">面接調整中</option>
                    <option value="面接実施">面接実施</option>
                    <option value="内定">内定</option>
                    <option value="不採用">不採用</option>
                    <option value="辞退">辞退</option>
                  </select>
                  <a
                    href={`/applications/${application.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    詳細
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;
