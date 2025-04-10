import { IsOptional, IsUUID, IsString, IsInt, IsDateString, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluationDto, CreateEvaluationSkillDto } from './create-evaluation.dto';

export class UpdateEvaluationDto extends PartialType(CreateEvaluationDto) {
  @IsOptional()
  @IsUUID()
  staffId?: string;

  @IsOptional()
  @IsUUID()
  evaluatorId?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsDateString()
  evaluationDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  technicalSkill?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  communicationSkill?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  problemSolving?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  teamwork?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  leadership?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  overallRating?: number;

  @IsOptional()
  @IsString()
  strengths?: string;

  @IsOptional()
  @IsString()
  areasToImprove?: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  skills?: CreateEvaluationSkillDto[];
}

export class UpdateEvaluationSkillDto extends PartialType(CreateEvaluationSkillDto) {
  @IsOptional()
  @IsString()
  skillName?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  skillLevel?: number;
}
