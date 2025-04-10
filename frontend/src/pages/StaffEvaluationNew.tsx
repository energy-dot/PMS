import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import evaluationService, { CreateEvaluationDto, CreateEvaluationSkillDto } from '../services/evaluationService';
import userService from '../services/userService';
import projectService from '../services/projectService';

const StaffEvaluationNew: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staffOptions, setStaffOptions] = useState<any[]>([]);
  const [projectOptions, setProjectOptions] = useState<any[]>([]);
  const [skillFields, setSkillFields] = useState<CreateEvaluationSkillDto[]>([
    { skillName: '', skillLevel: 3 }
  ]);

  // 評価データの初期値
  const [evaluationData, setEvaluationData] = useState<CreateEvaluationDto>({
    staffId: '',
    evaluatorId: '', // 現在のユーザーIDが自動設定される
    projectId: '',
    evaluationDate: new Date(),
    technicalSkill: 3,
    communicationSkill: 3,
    problemSolving: 3,
    teamwork: 3,
    leadership: 3,
    overallRating: 3,
    strengths: '',
    areasToImprove: '',
    comments: '',
    skills: []
  });

  // スタッフとプロジェクトのデータを取得
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // スタッフ一覧を取得
        const staffData = await userService.getUsers();
        setStaffOptions(staffData);

        // プロジェクト一覧を取得
        const projectData = await projectService.getProjects();
        setProjectOptions(projectData);

        // 現在のユーザーを評価者として設定
        const currentUser = await userService.getCurrentUser();
        setEvaluationData(prev => ({
          ...prev,
          evaluatorId: currentUser.id
        }));
      } catch (err) {
        console.error('Failed to fetch options:', err);
      }
    };

    fetchOptions();
  }, []);

  // 入力フィールドの変更ハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEvaluationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 評価レベルの変更ハンドラ
  const handleRatingChange = (name: string, value: number) => {
    setEvaluationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // スキルフィールドの変更ハンドラ
  const handleSkillChange = (index: number, field: string, value: any) => {
    const updatedSkills = [...skillFields];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: field === 'skillLevel' ? Number(value) : value
    };
    setSkillFields(updatedSkills);
  };

  // スキルフィールドの追加
  const handleAddSkill = () => {
    setSkillFields([...skillFields, { skillName: '', skillLevel: 3 }]);
  };

  // スキルフィールドの削除
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skillFields.filter((_, i) => i !== index);
    setSkillFields(updatedSkills);
  };

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 必須フィールドの検証
    if (!evaluationData.staffId) {
      setError('要員を選択してください');
      return;
    }

    setIsLoading(true);
    try {
      // 有効なスキルのみをフィルタリング
      const validSkills = skillFields.filter(skill => skill.skillName.trim() !== '');
      
      // 評価データを作成
      const dataToSubmit = {
        ...evaluationData,
        skills: validSkills
      };
      
      await evaluationService.createEvaluation(dataToSubmit);
      alert('評価が正常に作成されました');
      navigate('/evaluations');
    } catch (err: any) {
      setError(err.response?.data?.message || '評価の作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 一覧画面に戻る
  const handleCancel = () => {
    navigate('/evaluations');
  };

  // 評価レベルの星表示コンポーネント
  const RatingStars = ({ name, value, onChange }: { name: string; value: number; onChange: (name: string, value: number) => void }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(name, star)}
            className="focus:outline-none"
          >
            <svg
              className={`w-6 h-6 ${
                star <= value ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-400`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">新規評価作成</h1>
        <Button onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
          キャンセル
        </Button>
      </div>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">基本情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                要員 <span className="text-red-500">*</span>
              </label>
              <select
                name="staffId"
                value={evaluationData.staffId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">選択してください</option>
                {staffOptions.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                プロジェクト
              </label>
              <select
                name="projectId"
                value={evaluationData.projectId || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">選択してください</option>
                {projectOptions.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                評価日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="evaluationDate"
                value={evaluationData.evaluationDate instanceof Date 
                  ? evaluationData.evaluationDate.toISOString().split('T')[0]
                  : new Date(evaluationData.evaluationDate).toISOString().split('T')[0]}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">評価項目</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                技術力 <span className="text-red-500">*</span>
              </label>
              <RatingStars
                name="technicalSkill"
                value={evaluationData.technicalSkill}
                onChange={handleRatingChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                コミュニケーション <span className="text-red-500">*</span>
              </label>
              <RatingStars
                name="communicationSkill"
                value={evaluationData.communicationSkill}
                onChange={handleRatingChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                問題解決力 <span className="text-red-500">*</span>
              </label>
              <RatingStars
                name="problemSolving"
                value={evaluationData.problemSolving}
                onChange={handleRatingChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                チームワーク <span className="text-red-500">*</span>
              </label>
              <RatingStars
                name="teamwork"
                value={evaluationData.teamwork}
                onChange={handleRatingChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                リーダーシップ <span className="text-red-500">*</span>
              </label>
              <RatingStars
                name="leadership"
                value={evaluationData.leadership}
                onChange={handleRatingChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                総合評価 <span className="text-red-500">*</span>
              </label>
              <RatingStars
                name="overallRating"
                value={evaluationData.overallRating}
                onChange={handleRatingChange}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">スキル評価</h2>
            <Button
              type="button"
              onClick={handleAddSkill}
              className="bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              スキル追加
            </Button>
          </div>
          
          {skillFields.map((skill, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              <div className="md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  スキル名
                </label>
                <input
                  type="text"
                  value={skill.skillName}
                  onChange={(e) => handleSkillChange(index, 'skillName', e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例: Java, React, AWS"
                />
              </div>
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  レベル
                </label>
                <RatingStars
                  name={`skill-${index}`}
                  value={skill.skillLevel}
                  onChange={(_, value) => handleSkillChange(index, 'skillLevel', value)}
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="text-red-600 hover:text-red-800 focus:outline-none"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">コメント</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                強み
              </label>
              <textarea
                name="strengths"
                value={evaluationData.strengths || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="要員の強みを入力してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                改善点
              </label>
              <textarea
                name="areasToImprove"
                value={evaluationData.areasToImprove || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="要員の改善点を入力してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                その他コメント
              </label>
              <textarea
                name="comments"
                value={evaluationData.comments || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="その他のコメントを入力してください"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 mr-2"
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? '送信中...' : '評価を作成'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StaffEvaluationNew;
