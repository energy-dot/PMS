import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import projectService, { Project } from '../services/projectService';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProjectData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 案件情報を取得
        const projectData = await projectService.getProject(id);
        setProject(projectData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'データの取得に失敗しました');
        console.error('Failed to fetch project details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

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
          <Button
            onClick={() => navigate(`/projects/${id}/edit`)}
          >
            編集
          </Button>
        </div>
      </div>
      
      {error && <Alert variant="error" message={error} onClose={() => setError(null)} />}
      
      <div className="card p-6">
        <div className="flex justify-between mb-4">
          <div>
            <span className={getStatusStyle(project.status)}>{project.status}</span>
          </div>
          <div>
            <strong>登録日:</strong> {formatDate(project.createdAt)}
            {project.updatedAt && project.updatedAt !== project.createdAt && (
              <span> / <strong>更新日:</strong> {formatDate(project.updatedAt)}</span>
            )}
          </div>
        </div>
        
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
                  <td className="py-2">{project.department}</td>
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
      
      {/* 案件に関するタブなどの追加セクションはここに実装 */}
      {/* 例: 応募者一覧タブ、選考中の要員一覧タブなど */}
    </div>
  );
};

export default ProjectDetail;
