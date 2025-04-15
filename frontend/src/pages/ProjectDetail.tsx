import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Tabs from '../components/common/Tabs';
import projectService, { Project } from '../services/projectService';
import applicationService, { Application } from '../services/applicationService';
import workflowService from '../services/workflowService';
import ApplicationList from '../components/applications/ApplicationList';
import ApprovalWorkflow from '../components/workflows/ApprovalWorkflow';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState('info');
  const [isLoading, setIsLoading] = useState(true);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProjectDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 案件情報を取得
        const projectData = await projectService.getProjectById(id);
        setProject(projectData);
        
        // 承認ステータスを設定
        setApprovalStatus(projectData.approvalStatus || projectData.status);
      } catch (err: any) {
        setError('Failed to fetch project details: ' + (err.message || 'Unknown error'));
        console.error('Failed to fetch project details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  useEffect(() => {
    if (!id || activeTab !== 'applications') return;

    const fetchApplications = async () => {
      setIsApplicationsLoading(true);
      try {
        const data = await applicationService.getApplicationsByProjectId(id);
        setApplications(data);
      } catch (err: any) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setIsApplicationsLoading(false);
      }
    };

    fetchApplications();
  }, [id, activeTab]);

  // 日付を表示用にフォーマット
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // 案件ステータスに応じたスタイルを取得
  const getStatusStyle = (status: string): string => {
    switch (status) {
      case '募集中':
        return 'status-badge status-active';
      case '選考中':
        return 'status-badge status-pending';
      case '充足':
        return 'status-badge status-success';
      case '承認待ち':
        return 'status-badge status-pending';
      case '差し戻し':
        return 'status-badge status-rejected';
      case '終了':
        return 'status-badge status-completed';
      default:
        return 'status-badge';
    }
  };

  // 承認申請を行う
  const handleRequestApproval = async () => {
    if (!id || !project) return;
    
    try {
      await workflowService.requestProjectApproval(id, {
        requesterId: 'current-user-id', // 実際のユーザーIDに置き換える
        remarks: '承認をお願いします。'
      });
      
      // 案件情報を再取得して表示を更新
      const updatedProject = await projectService.getProjectById(id);
      setProject(updatedProject);
      setApprovalStatus('承認待ち');
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || '承認申請に失敗しました');
      console.error('Failed to request approval:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>データを読み込み中...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center p-8">
        <p>案件情報が見つかりません。</p>
        <Button
          onClick={() => navigate('/projects')}
          className="mt-4"
        >
          一覧に戻る
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'info', label: '基本情報' },
    { id: 'applications', label: '応募者管理' },
    { id: 'workflow', label: '承認ワークフロー' },
    { id: 'documents', label: '関連書類' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">{project.name}</h1>
        <div>
          <Button
            variant="secondary"
            onClick={() => navigate('/projects')}
            className="mr-2"
          >
            一覧に戻る
          </Button>
          {approvalStatus !== '承認待ち' && approvalStatus !== '承認済み' && (
            <Button
              onClick={handleRequestApproval}
              className="mr-2"
              variant="primary"
            >
              承認申請
            </Button>
          )}
          <Button
            onClick={() => navigate(`/projects/${id}/edit`)}
          >
            編集
          </Button>
        </div>
      </div>
      
      {error && <Alert variant="error" message={error} onClose={() => setError(null)} />}
      
      <div className="card p-6 mb-6">
        <div className="flex justify-between mb-4">
          <div>
            <span className={getStatusStyle(project.status)}>{project.status}</span>
            {approvalStatus && approvalStatus !== project.status && (
              <span className={getStatusStyle(approvalStatus)} style={{ marginLeft: '0.5rem' }}>
                {approvalStatus}
              </span>
            )}
          </div>
          <div>
            <strong>登録日:</strong> {formatDate(project.createdAt)}
            {project.updatedAt && project.updatedAt !== project.createdAt && (
              <span> / <strong>更新日:</strong> {formatDate(project.updatedAt)}</span>
            )}
          </div>
        </div>
      </div>
      
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mt-6">
        {activeTab === 'info' && (
          <div className="card p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">案件情報</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <th className="py-2 text-left">案件名</th>
                      <td className="py-2">{project.name}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">部署</th>
                      <td className="py-2">
                        {project.department?.name || '-'} / {project.section?.name || '-'}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">案件概要</th>
                      <td className="py-2">{project.description || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">期間</th>
                      <td className="py-2">
                        {formatDate(project.startDate)} 〜 {formatDate(project.endDate)}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">作業場所</th>
                      <td className="py-2">{project.location || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">リモートワーク</th>
                      <td className="py-2">{project.isRemote ? '可' : '不可'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">勤務時間</th>
                      <td className="py-2">{project.workingHours || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">要件</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <th className="py-2 text-left">必須スキル</th>
                      <td className="py-2">{project.requiredSkills || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">必要経験</th>
                      <td className="py-2">{project.requiredExperience || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">募集人数</th>
                      <td className="py-2">{project.requiredNumber || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">想定単価</th>
                      <td className="py-2">{project.budget || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 text-left">備考</th>
                      <td className="py-2">{project.remarks || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'applications' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">応募者一覧</h3>
              <Button
                onClick={() => navigate(`/applications/new?projectId=${id}`)}
                variant="primary"
              >
                新規応募登録
              </Button>
            </div>
            
            {isApplicationsLoading ? (
              <div className="text-center py-4">応募データを読み込み中...</div>
            ) : applications.length > 0 ? (
              <ApplicationList applications={applications} onStatusChange={() => {
                // 応募ステータス変更時に一覧を再取得
                applicationService.getApplicationsByProjectId(id).then(setApplications);
              }} />
            ) : (
              <div className="text-center py-4">この案件への応募はまだありません。</div>
            )}
          </div>
        )}
        
        {activeTab === 'workflow' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">承認ワークフロー</h3>
            <ApprovalWorkflow projectId={id} />
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">関連書類</h3>
              <Button
                onClick={() => {/* ファイルアップロードモーダルを表示 */}}
                variant="primary"
              >
                書類アップロード
              </Button>
            </div>
            
            <div className="text-center py-4">
              この案件に関連する書類はまだアップロードされていません。
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
