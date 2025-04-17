import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from '../../entities/evaluation.entity';
import { EvaluationSkill } from '../../entities/evaluation-skill.entity';
import { CreateEvaluationDto } from '../../dto/evaluations/create-evaluation.dto';
import { UpdateEvaluationDto } from '../../dto/evaluations/update-evaluation.dto';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(Evaluation)
    private evaluationsRepository: Repository<Evaluation>,
    @InjectRepository(EvaluationSkill)
    private evaluationSkillsRepository: Repository<EvaluationSkill>,
  ) {}

  async findAllEvaluations(): Promise<Evaluation[]> {
    return this.evaluationsRepository.find({
      relations: ['staff', 'evaluator', 'project', 'skills'],
    });
  }

  async findEvaluationById(id: string): Promise<Evaluation> {
    const evaluation = await this.evaluationsRepository.findOne({
      where: { id },
      relations: ['staff', 'evaluator', 'project', 'skills'],
    });

    if (!evaluation) {
      throw new NotFoundException(`評価ID ${id} は見つかりませんでした`);
    }

    return evaluation;
  }

  async findEvaluationsByStaffId(staffId: string): Promise<Evaluation[]> {
    return this.evaluationsRepository.find({
      where: { staffId },
      relations: ['staff', 'evaluator', 'project', 'skills'],
      order: { evaluationDate: 'DESC' },
    });
  }

  async findEvaluationsByEvaluatorId(evaluatorId: string): Promise<Evaluation[]> {
    return this.evaluationsRepository.find({
      where: { evaluatorId },
      relations: ['staff', 'evaluator', 'project', 'skills'],
      order: { evaluationDate: 'DESC' },
    });
  }

  async findEvaluationsByProjectId(projectId: string): Promise<Evaluation[]> {
    return this.evaluationsRepository.find({
      where: { projectId },
      relations: ['staff', 'evaluator', 'project', 'skills'],
      order: { evaluationDate: 'DESC' },
    });
  }

  async createEvaluation(createEvaluationDto: CreateEvaluationDto): Promise<Evaluation> {
    // スキルデータを一時的に保存
    const skillsData = createEvaluationDto.skills || [];
    delete createEvaluationDto.skills;

    // 評価データを作成
    const newEvaluation = this.evaluationsRepository.create({
      ...createEvaluationDto,
      evaluationDate: new Date(createEvaluationDto.evaluationDate),
    });

    // 評価を保存
    const savedEvaluation = await this.evaluationsRepository.save(newEvaluation);

    // スキルデータがある場合は保存
    if (skillsData.length > 0) {
      const skills = skillsData.map(skillData =>
        this.evaluationSkillsRepository.create({
          evaluationId: savedEvaluation.id,
          skillName: skillData.skillName,
          skillLevel: skillData.skillLevel,
        }),
      );

      savedEvaluation.skills = await this.evaluationSkillsRepository.save(skills);
    }

    return savedEvaluation;
  }

  async updateEvaluation(
    id: string,
    updateEvaluationDto: UpdateEvaluationDto,
  ): Promise<Evaluation> {
    const evaluation = await this.findEvaluationById(id);

    // スキルデータを一時的に保存
    const skillsData = updateEvaluationDto.skills;
    delete updateEvaluationDto.skills;

    // 日付フィールドの変換
    if (updateEvaluationDto.evaluationDate) {
      updateEvaluationDto.evaluationDate = new Date(updateEvaluationDto.evaluationDate) as any;
    }

    // 評価データを更新
    const updatedEvaluation = this.evaluationsRepository.merge(evaluation, updateEvaluationDto);
    await this.evaluationsRepository.save(updatedEvaluation);

    // スキルデータがある場合は更新
    if (skillsData && skillsData.length > 0) {
      // 既存のスキルを削除
      await this.evaluationSkillsRepository.delete({ evaluationId: id });

      // 新しいスキルを作成
      const skills = skillsData.map(skillData =>
        this.evaluationSkillsRepository.create({
          evaluationId: id,
          skillName: skillData.skillName,
          skillLevel: skillData.skillLevel,
        }),
      );

      updatedEvaluation.skills = await this.evaluationSkillsRepository.save(skills);
    }

    return updatedEvaluation;
  }

  async removeEvaluation(id: string): Promise<void> {
    const evaluation = await this.findEvaluationById(id);
    await this.evaluationsRepository.remove(evaluation);
  }

  async getSkills(evaluationId: string): Promise<any[]> {
    return this.evaluationSkillsRepository.find({
      where: { evaluationId },
    });
  }

  async removeSkill(id: string): Promise<void> {
    const skill = await this.evaluationSkillsRepository.findOne({ where: { id } });
    if (skill) {
      await this.evaluationSkillsRepository.remove(skill);
    }
  }

  /**
   * スタッフの平均評価を取得する
   * @param staffId スタッフID
   * @returns 平均評価データ
   */
  async getStaffAverageRatings(staffId: string): Promise<any> {
    const evaluations = await this.findEvaluationsByStaffId(staffId);

    if (evaluations.length === 0) {
      return {
        overallRating: 0,
        technicalSkills: 0,
        communicationSkills: 0,
        problemSolving: 0,
        teamwork: 0,
        leadership: 0,
        evaluationCount: 0,
      };
    }

    // 各評価項目の合計を計算
    const totals = evaluations.reduce(
      (acc, evaluation) => {
        acc.overallRating += evaluation.overallRating || 0;
        acc.technicalSkills += evaluation.technicalSkill || 0;
        acc.communicationSkills += evaluation.communicationSkill || 0;
        acc.problemSolving += evaluation.problemSolving || 0;
        acc.teamwork += evaluation.teamwork || 0;
        acc.leadership += evaluation.leadership || 0;
        return acc;
      },
      {
        overallRating: 0,
        technicalSkills: 0,
        communicationSkills: 0,
        problemSolving: 0,
        teamwork: 0,
        leadership: 0,
      },
    );

    // 平均を計算
    const count = evaluations.length;
    return {
      overallRating: totals.overallRating / count,
      technicalSkills: totals.technicalSkills / count,
      communicationSkills: totals.communicationSkills / count,
      problemSolving: totals.problemSolving / count,
      teamwork: totals.teamwork / count,
      leadership: totals.leadership / count,
      evaluationCount: count,
    };
  }

  /**
   * スタッフのスキル評価を取得する
   * @param staffId スタッフID
   * @returns スキル評価データ
   */
  async getStaffSkillRatings(staffId: string): Promise<any> {
    const evaluations = await this.findEvaluationsByStaffId(staffId);

    if (evaluations.length === 0) {
      return [];
    }

    // 全てのスキル評価を取得
    const allSkills = [];
    for (const evaluation of evaluations) {
      const skills = await this.getSkills(evaluation.id);
      allSkills.push(...skills);
    }

    // スキル名ごとに集計
    const skillMap = new Map();
    allSkills.forEach(skill => {
      if (!skillMap.has(skill.skillName)) {
        skillMap.set(skill.skillName, {
          skillName: skill.skillName,
          totalLevel: 0,
          count: 0,
        });
      }

      const skillData = skillMap.get(skill.skillName);
      skillData.totalLevel += skill.skillLevel;
      skillData.count += 1;
    });

    // 平均を計算して結果を返す
    return Array.from(skillMap.values()).map(skillData => ({
      skillName: skillData.skillName,
      averageLevel: skillData.totalLevel / skillData.count,
      evaluationCount: skillData.count,
    }));
  }
}
