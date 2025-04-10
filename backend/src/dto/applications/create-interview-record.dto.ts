import { IsNotEmpty, IsUUID, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateInterviewRecordDto {
  @IsNotEmpty()
  @IsUUID()
  applicationId: string;

  @IsNotEmpty()
  @IsDateString()
  interviewDate: string;

  @IsOptional()
  @IsUUID()
  interviewerId?: string;

  @IsNotEmpty()
  @IsString()
  interviewFormat: string;

  @IsOptional()
  @IsString()
  evaluation?: string;

  @IsOptional()
  @IsString()
  evaluationComment?: string;
}
