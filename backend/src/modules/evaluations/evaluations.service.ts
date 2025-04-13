import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from '../../entities/evaluation.entity';
import { EvaluationSkill } from '../../entities/evaluation-skill.entity';
import { CreateEvaluationDto } from '../../dto/evaluations/create-evaluation.dto';
import { UpdateEvaluationDto } from '../../dto/evaluations/update-evaluation.dto';

@Injectable()
export class EvaluationsService {
  // 必要なメソッドを追加
  async findAll(): Promise<Evaluation[]> {
    return this.evaluationsRepository.find({
      relations: ['staff', 'evaluator', 'project', 'skills'],
    });
  }

  async findOne(id: string): Promise<Evaluation> {
    const evaluation = await this.evaluationsRepository.findOne({
      where: { id },
      relations: ['staff', 'evaluator', 'project', 'skills'],
    });

    if (!evaluation) {
      throw new Error(`評価ID ${id} は見つかりませんでした`);
    }

    return evaluation;
  }

  async create(createEvaluationDto: CreateEvaluationDto): Promise<Evaluation> {
    const newEvaluation = this.evaluationsRepository.create(createEvaluationDto);
    return this.evaluationsRepository.save(newEvaluation);
  }

  async update(id: string, updateEvaluationDto: UpdateEvaluationDto): Promise<Evaluation> {
    const evaluation = await this.findOne(id);
    this.evaluationsRepository.merge(evaluation, updateEvaluationDto);
    return this.evaluationsRepository.save(evaluation);
  }

  async remove(id: string): Promise<void> {
    const evaluation = await this.findOne(id);
    await this.evaluationsRepository.remove(evaluation);
  }

  async findByStaff(staffId: string): Promise<Evaluation[]> {
    return this.evaluationsRepository.find({
      where: { staffId },
      relations: ['staff', 'evaluator', 'project', 'skills'],
    });
  }

  async findByProject(projectId: string): Promise<Evaluation[]> {
    return this.evaluationsRepository.find({
      where: { projectId },
      relations: ['staff', 'evaluator', 'project', 'skills'],
    });
  }

  async addSkill(createSkillDto: any): Promise<any> {
    const skill = this.evaluationSkillsRepository.create(createSkillDto);
    return this.evaluationSkillsRepository.save(skill);
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
  constructor(
    @InjectRepository(Evaluation)
    private evaluationsRepository: Repository<Evaluation>,
    @InjectRepository(EvaluationSkill)
    private evaluationSkillsRepository: Repository<EvaluationSkill>,
  ) {}

  // 評価関連のメソッド
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
        })
      );
      
      savedEvaluation.skills = await this.evaluationSkillsRepository.save(skills);
    }

    return savedEvaluation;
  }

  async updateEvaluation(id: string, updateEvaluationDto: UpdateEvaluationDto): Promise<Evaluation> {
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
        })
      );
      
      updatedEvaluation.skills = await this.evaluationSkillsRepository.save(skills);
    }
    
    return updatedEvaluation;
  }

  async removeEvaluation(id: string): Promise<void> {
    const evaluation = await this.findEvaluationById(id);
    await this.evaluationsRepository.remove(evaluation);
  }

  // 統計関連のメソッド
  async getStaffAverageRatings(staffId: string): Promise<any> {
    const evaluations = await this.findEvaluationsByStaffId(staffId);
    
    if (evaluations.length === 0) {
      return {
        technicalSkill: 0,
        communicationSkill: 0,
        problemSolving: 0,
        teamwork: 0,
        leadership: 0,
        overallRating: 0,
        evaluationCount: 0,
      };
    }
    
    const sum = evaluations.reduce((acc, evaluation) => {
      return {
        technicalSkill: acc.technicalSkill + evaluation.technicalSkill,
        communicationSkill: acc.communicationSkill + evaluation.communicationSkill,
        problemSolving: acc.problemSolving + evaluation.problemSolving,
        teamwork: acc.teamwork + evaluation.teamwork,
        leadership: acc.leadership + evaluation.leadership,
        overallRating: acc.overallRating + evaluation.overallRating,
      };
    }, {
      technicalSkill: 0,
      communicationSkill: 0,
      problemSolving: 0,
      teamwork: 0,
      leadership: 0,
      overallRating: 0,
    });
    
    const count = evaluations.length;
    
    return {
      technicalSkill: sum.technicalSkill / count,
      communicationSkill: sum.communicationSkill / count,
      problemSolving: sum.problemSolving / count,
      teamwork: sum.teamwork / count,
      leadership: sum.leadership / count,
      overallRating: sum.overallRating / count,
      evaluationCount: count,
    };
  }

  async getStaffSkillRatings(staffId: string): Promise<any> {
    const evaluations = await this.findEvaluationsByStaffId(staffId);
    
    if (evaluations.length === 0) {
      return [];
    }
    
    // スキル名ごとに評価を集計
    const skillMap = new Map<string, { sum: number; count: number }>();
    
    evaluations.forEach(evaluation => {
      evaluation.skills?.forEach(skill => {
        if (!skillMap.has(skill.skillName)) {
          skillMap.set(skill.skillName, { sum: 0, count: 0 });
        }
        
        const current = skillMap.get(skill.skillName);
        if (current) {
          skillMap.set(skill.skillName, {
            sum: current.sum + skill.skillLevel,
            count: current.count + 1,
          });
        }
      });
    });
    
    // 平均値を計算
    const result = Array.from(skillMap.entries()).map(([skillName, data]) => ({
      skillName,
      averageRating: data.sum / data.count,
      evaluationCount: data.count,
    }));
    
    return result;
  }
}
