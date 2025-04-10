import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import evaluationService, { Evaluation } from '../services/evaluationService';
import userService from '../services/userService';
import projectService from '../services/projectService';

const StaffEvaluationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [staff, setStaff] = useState<any | null>(null);
  const [evaluator, setEvaluator] = useState<any | null>(null);
  const [project, setProject] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 評価データの取得
  useEffect(() => {
    if (!id) return;

    const fetchEvaluationData = async () => {
      setIsLoading(true);
      try {
        const data = await evaluationService.getEvaluation(id);
        setEvaluation(data);

        // 関連データの取得
        if (data.staffId) {
          try {
            const staffData = await userService.getUser(data.staffId);
            setStaff(staffData);
          } catch (err) {
            console.error('Failed to fetch staff:', err);
          }
        }

        if (data.evaluatorId) {
          try {
            const evaluatorData = await userService.getUser(data.evaluatorId);
            setEvaluator(evaluatorData);
          } catch (err) {
            console.error('Failed to fetch evaluator:', err);
          }
        }

        if (data.projectId) {
          try {
            const projectData = await projectService.getProject(data.projectId);
            setProject(projectData);
          } catch (err) {
            console.error('Failed to fetch project:', err);
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '評価データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluationData();
  }, [id]);

  // 編集画面へ遷移
  const handleEdit = () => {
    navigate(`/evaluations/${id}/edit`);
  };

  // 一覧画面に戻る
  const handleBack = () => {
    navigate('/evaluations');
  };

  // 日付のフォーマット
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // 評価レベルを星表示に変換
  const renderRatingStars = (rating: number): JSX.Element => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading && !evaluation) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  if (error && !evaluation) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert type="error">{error}</Alert>
        <Button onClick={handleBack} className="mt-4">一覧に戻る</Button>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert type="error">評価データが見つかりません</Alert>
        <Button onClick={handleBack} className="mt-4">一覧に戻る</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">評価詳細</h1>
        <div className="flex space-x-2">
          <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
            編集
          </Button>
          <Button onClick={handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
            一覧に戻る
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">評価日</h3>
            <p className="mt-1">{formatDate(evaluation.evaluationDate)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">要員</h3>
            <p className="mt-1">{staff?.name || '-'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">評価者</h3>
            <p className="mt-1">{evaluator?.name || '-'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">プロジェクト</h3>
            <p className="mt-1">{project?.name || '-'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">評価項目</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">技術力</h3>
            <div className="mt-1">{renderRatingStars(evaluation.technicalSkill)}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">コミュニケーション</h3>
            <div className="mt-1">{renderRatingStars(evaluation.communicationSkill)}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">問題解決力</h3>
            <div className="mt-1">{renderRatingStars(evaluation.problemSolving)}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">チームワーク</h3>
            <div className="mt-1">{renderRatingStars(evaluation.teamwork)}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">リーダーシップ</h3>
            <div className="mt-1">{renderRatingStars(evaluation.leadership)}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">総合評価</h3>
            <div className="mt-1">{renderRatingStars(evaluation.overallRating)}</div>
          </div>
        </div>
      </div>

      {evaluation.skills && evaluation.skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">スキル評価</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {evaluation.skills.map((skill) => (
              <div key={skill.id}>
                <h3 className="text-sm font-medium text-gray-500">{skill.skillName}</h3>
                <div className="mt-1">{renderRatingStars(skill.skillLevel)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">コメント</h2>
        <div className="grid grid-cols-1 gap-6">
          {evaluation.strengths && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">強み</h3>
              <p className="mt-1 whitespace-pre-line">{evaluation.strengths}</p>
            </div>
          )}

          {evaluation.areasToImprove && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">改善点</h3>
              <p className="mt-1 whitespace-pre-line">{evaluation.areasToImprove}</p>
            </div>
          )}

          {evaluation.comments && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">その他コメント</h3>
              <p className="mt-1 whitespace-pre-line">{evaluation.comments}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffEvaluationDetail;
