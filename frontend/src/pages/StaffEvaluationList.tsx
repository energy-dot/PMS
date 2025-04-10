import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import evaluationService, { Evaluation } from '../services/evaluationService';
import userService from '../services/userService';

const StaffEvaluationList: React.FC = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staffMap, setStaffMap] = useState<Record<string, any>>({});
  const [evaluatorMap, setEvaluatorMap] = useState<Record<string, any>>({});

  // 評価データの取得
  useEffect(() => {
    const fetchEvaluations = async () => {
      setIsLoading(true);
      try {
        const data = await evaluationService.getEvaluations();
        setEvaluations(data);
        
        // 関連するスタッフと評価者の情報を取得
        const staffIds = [...new Set(data.map(item => item.staffId))];
        const evaluatorIds = [...new Set(data.map(item => item.evaluatorId))];
        const allUserIds = [...new Set([...staffIds, ...evaluatorIds])];
        
        try {
          const users = await Promise.all(
            allUserIds.map(id => userService.getUser(id))
          );
          
          const userMap: Record<string, any> = {};
          users.forEach(user => {
            userMap[user.id] = user;
          });
          
          setStaffMap(userMap);
          setEvaluatorMap(userMap);
        } catch (err) {
          console.error('Failed to fetch related data:', err);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '評価データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvaluations();
  }, []);

  // 評価詳細画面へ遷移
  const handleViewEvaluation = (id: string) => {
    navigate(`/evaluations/${id}`);
  };

  // 新規評価作成画面へ遷移
  const handleCreateEvaluation = () => {
    navigate('/evaluations/new');
  };

  // 日付のフォーマット
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // スタッフ名を取得
  const getStaffName = (staffId: string): string => {
    return staffMap[staffId]?.name || 'Unknown Staff';
  };

  // 評価者名を取得
  const getEvaluatorName = (evaluatorId: string): string => {
    return evaluatorMap[evaluatorId]?.name || 'Unknown Evaluator';
  };

  // 評価レベルを星表示に変換
  const renderRatingStars = (rating: number): JSX.Element => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">要員評価一覧</h1>
        <Button
          onClick={handleCreateEvaluation}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          新規評価作成
        </Button>
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
      ) : evaluations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-center">評価データはありません</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="py-3 px-4 font-semibold">評価日</th>
                <th className="py-3 px-4 font-semibold">要員</th>
                <th className="py-3 px-4 font-semibold">評価者</th>
                <th className="py-3 px-4 font-semibold">技術力</th>
                <th className="py-3 px-4 font-semibold">コミュニケーション</th>
                <th className="py-3 px-4 font-semibold">問題解決力</th>
                <th className="py-3 px-4 font-semibold">チームワーク</th>
                <th className="py-3 px-4 font-semibold">リーダーシップ</th>
                <th className="py-3 px-4 font-semibold">総合評価</th>
                <th className="py-3 px-4 font-semibold">アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {evaluations.map((evaluation) => (
                <tr key={evaluation.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{formatDate(evaluation.evaluationDate)}</td>
                  <td className="py-3 px-4">{getStaffName(evaluation.staffId)}</td>
                  <td className="py-3 px-4">{getEvaluatorName(evaluation.evaluatorId)}</td>
                  <td className="py-3 px-4">{renderRatingStars(evaluation.technicalSkill)}</td>
                  <td className="py-3 px-4">{renderRatingStars(evaluation.communicationSkill)}</td>
                  <td className="py-3 px-4">{renderRatingStars(evaluation.problemSolving)}</td>
                  <td className="py-3 px-4">{renderRatingStars(evaluation.teamwork)}</td>
                  <td className="py-3 px-4">{renderRatingStars(evaluation.leadership)}</td>
                  <td className="py-3 px-4">{renderRatingStars(evaluation.overallRating)}</td>
                  <td className="py-3 px-4">
                    <Button
                      onClick={() => handleViewEvaluation(evaluation.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      詳細
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffEvaluationList;
