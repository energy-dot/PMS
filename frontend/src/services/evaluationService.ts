// services/evaluationService.tsの修正 - APIのインポート方法を修正

import api from './api';
import { Evaluation } from '../shared-types';

// 評価データの取得
export const getEvaluations = async (): Promise<Evaluation[]> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.get('/evaluations');
    // return response.data;

    // デモ用のモックデータ
    return [
      {
        id: '1',
        staffId: '101',
        projectId: '201',
        evaluatorId: '301',
        evaluationDate: '2023-01-15',
        overallRating: 4,
        technicalSkills: 4,
        communicationSkills: 3,
        problemSolving: 4,
        teamwork: 5,
        leadership: 3,
        comments:
          '技術的なスキルが高く、問題解決能力も優れています。チームワークも素晴らしいです。',
        skillRatings: [
          { skillName: 'JavaScript', rating: 4 },
          { skillName: 'React', rating: 5 },
          { skillName: 'Node.js', rating: 3 },
        ],
      },
      {
        id: '2',
        staffId: '102',
        projectId: '202',
        evaluatorId: '302',
        evaluationDate: '2023-02-20',
        overallRating: 3,
        technicalSkills: 3,
        communicationSkills: 4,
        problemSolving: 3,
        teamwork: 4,
        leadership: 2,
        comments:
          'コミュニケーション能力が高く、チームでの協力も良好です。技術的なスキルの向上が期待されます。',
        skillRatings: [
          { skillName: 'Java', rating: 3 },
          { skillName: 'Spring', rating: 3 },
          { skillName: 'SQL', rating: 4 },
        ],
      },
    ];
  } catch (error) {
    console.error('Failed to fetch evaluations:', error);
    throw error;
  }
};

// 評価データの取得（ID指定）
export const getEvaluationById = async (id: string): Promise<Evaluation> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.get(`/evaluations/${id}`);
    // return response.data;

    // デモ用のモックデータ
    const evaluations = await getEvaluations();
    const evaluation = evaluations.find(e => e.id === id);

    if (!evaluation) {
      throw new Error(`Evaluation with ID ${id} not found`);
    }

    return evaluation;
  } catch (error) {
    console.error(`Failed to fetch evaluation with ID ${id}:`, error);
    throw error;
  }
};

// 評価データの作成
export const createEvaluation = async (data: Omit<Evaluation, 'id'>): Promise<Evaluation> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.post('/evaluations', data);
    // return response.data;

    // デモ用のモックデータ
    const newId = Math.floor(Math.random() * 1000).toString();
    const newEvaluation: Evaluation = {
      id: newId,
      ...data,
    };

    return newEvaluation;
  } catch (error) {
    console.error('Failed to create evaluation:', error);
    throw error;
  }
};

// 評価データの更新
export const updateEvaluation = async (
  id: string,
  data: Partial<Evaluation>
): Promise<Evaluation> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // const response = await api.put(`/evaluations/${id}`, data);
    // return response.data;

    // デモ用のモックデータ
    const evaluation = await getEvaluationById(id);
    const updatedEvaluation: Evaluation = {
      ...evaluation,
      ...data,
    };

    return updatedEvaluation;
  } catch (error) {
    console.error(`Failed to update evaluation with ID ${id}:`, error);
    throw error;
  }
};

// 評価データの削除
export const deleteEvaluation = async (id: string): Promise<void> => {
  try {
    // 本番環境では実際のAPIエンドポイントを呼び出す
    // await api.delete(`/evaluations/${id}`);

    // デモ用のモックデータ
    // 実際には何もしない
    console.log(`Evaluation with ID ${id} deleted`);
  } catch (error) {
    console.error(`Failed to delete evaluation with ID ${id}:`, error);
    throw error;
  }
};

// 評価DTOの型定義
export interface EvaluationDto extends Omit<Evaluation, 'id'> {}
export interface EvaluationSkillDto {
  skillName: string;
  rating: number;
}

// デフォルトエクスポートを追加
const evaluationService = {
  getEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
};

export default evaluationService;
