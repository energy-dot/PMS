import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { EvaluationsService } from './evaluations.service';
import { Evaluation } from '../../entities/evaluation.entity';
import { CreateEvaluationDto } from '../../dto/evaluations/create-evaluation.dto';
import { UpdateEvaluationDto } from '../../dto/evaluations/update-evaluation.dto';

@Controller('evaluations')
@UseGuards(JwtAuthGuard)
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  // 評価関連のエンドポイント
  @Get()
  findAllEvaluations(): Promise<Evaluation[]> {
    return this.evaluationsService.findAllEvaluations();
  }

  @Get(':id')
  findEvaluationById(@Param('id') id: string): Promise<Evaluation> {
    return this.evaluationsService.findEvaluationById(id);
  }

  @Get('staff/:staffId')
  findEvaluationsByStaffId(@Param('staffId') staffId: string): Promise<Evaluation[]> {
    return this.evaluationsService.findEvaluationsByStaffId(staffId);
  }

  @Get('evaluator/:evaluatorId')
  findEvaluationsByEvaluatorId(@Param('evaluatorId') evaluatorId: string): Promise<Evaluation[]> {
    return this.evaluationsService.findEvaluationsByEvaluatorId(evaluatorId);
  }

  @Get('project/:projectId')
  findEvaluationsByProjectId(@Param('projectId') projectId: string): Promise<Evaluation[]> {
    return this.evaluationsService.findEvaluationsByProjectId(projectId);
  }

  @Post()
  createEvaluation(@Body() createEvaluationDto: CreateEvaluationDto): Promise<Evaluation> {
    return this.evaluationsService.createEvaluation(createEvaluationDto);
  }

  @Patch(':id')
  updateEvaluation(
    @Param('id') id: string,
    @Body() updateEvaluationDto: UpdateEvaluationDto,
  ): Promise<Evaluation> {
    return this.evaluationsService.updateEvaluation(id, updateEvaluationDto);
  }

  @Delete(':id')
  removeEvaluation(@Param('id') id: string): Promise<void> {
    return this.evaluationsService.removeEvaluation(id);
  }

  // 統計関連のエンドポイント
  @Get('staff/:staffId/average-ratings')
  getStaffAverageRatings(@Param('staffId') staffId: string): Promise<any> {
    return this.evaluationsService.getStaffAverageRatings(staffId);
  }

  @Get('staff/:staffId/skill-ratings')
  getStaffSkillRatings(@Param('staffId') staffId: string): Promise<any> {
    return this.evaluationsService.getStaffSkillRatings(staffId);
  }
}
