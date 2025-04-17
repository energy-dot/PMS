import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from '../../entities/evaluation.entity';
import { DateUtilsService } from '../utils/date-utils.service';
import { FilterUtilsService } from '../utils/filter-utils.service';

/**
 * 要員評価に関するレポートを生成するサービス
 */
@Injectable()
export class EvaluationReportService {
  constructor(
    @InjectRepository(Evaluation)
    private evaluationRepository: Repository<Evaluation>,
    private dateUtilsService: DateUtilsService,
    private filterUtilsService: FilterUtilsService,
  ) {}

  /**
   * 要員評価集計レポートを生成
   */
  async getStaffEvaluationReport(startDate?: string, endDate?: string, department?: string) {
    // フィルター条件の構築
    const whereCondition: any = {};

    const dateFilter = this.dateUtilsService.getDateFilter(startDate, endDate);
    if (dateFilter) {
      whereCondition.createdAt = dateFilter;
    }

    // スタッフ経由で部署フィルターを適用
    if (department && department !== 'all') {
      whereCondition.staff = {
        departmentId: department,
      };
    }

    // データ取得
    const evaluations = await this.evaluationRepository.find({
      where: whereCondition,
      relations: ['staff', 'evaluationSkills'],
    });

    // カテゴリ別に集計
    const categoryScores: Record<string, { scores: number[]; sum: number; count: number }> = {};

    evaluations.forEach(evaluation => {
      evaluation.evaluationSkills?.forEach(skill => {
        // TypeScriptの型エラーを回避するためにプロパティを安全にアクセス
        const skillData = skill as any;
        const category = '未分類'; // 実際のカテゴリ情報がないため標準値を使用

        if (!categoryScores[category]) {
          categoryScores[category] = {
            scores: [],
            sum: 0,
            count: 0,
          };
        }

        // skillLevel は EvaluationSkill エンティティに存在する既知のプロパティ
        const score = skillData.skillLevel || 0;
        categoryScores[category].scores.push(score);
        categoryScores[category].sum += score;
        categoryScores[category].count += 1;
      });
    });

    // テーブルデータの作成
    const tableData = Object.entries(categoryScores).map(([category, data]) => {
      const scores = data.scores;
      return {
        category,
        averageScore: data.count > 0 ? Math.round((data.sum / data.count) * 100) / 100 : 0,
        maxScore: scores.length > 0 ? Math.max(...scores) : 0,
        minScore: scores.length > 0 ? Math.min(...scores) : 0,
      };
    });

    // チャートデータの作成
    const chartData = {
      labels: tableData.map(item => item.category),
      averageScores: tableData.map(item => item.averageScore),
    };

    // サマリーデータの作成
    const totalEvaluations = evaluations.length;
    const totalStaff = new Set(evaluations.map(e => e.staffId)).size;

    let allScores: number[] = [];
    Object.values(categoryScores).forEach(data => {
      allScores = allScores.concat(data.scores);
    });

    const overallAverage =
      allScores.length > 0
        ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 100) / 100
        : 0;

    const summary = {
      評価総数: totalEvaluations,
      評価対象要員数: totalStaff,
      全体平均スコア: overallAverage,
    };

    return {
      tableData,
      chartData,
      summary,
    };
  }
}
