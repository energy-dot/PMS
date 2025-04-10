import { IsNotEmpty, IsUUID, IsOptional, IsString, IsInt, IsDateString, Min, Max } from 'class-validator';

export class CreateEvaluationDto {
  @IsNotEmpty()
  @IsUUID()
  staffId: string;

  @IsNotEmpty()
  @IsUUID()
  evaluatorId: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsNotEmpty()
  @IsDateString()
  evaluationDate: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  technicalSkill: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  communicationSkill: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  problemSolving: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  teamwork: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  leadership: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  overallRating: number;

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

export class CreateEvaluationSkillDto {
  @IsNotEmpty()
  @IsString()
  skillName: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  skillLevel: number;
}
