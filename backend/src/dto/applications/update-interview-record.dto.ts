import { IsOptional, IsUUID, IsString, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateInterviewRecordDto } from './create-interview-record.dto';

export class UpdateInterviewRecordDto extends PartialType(CreateInterviewRecordDto) {
  @IsOptional()
  @IsUUID()
  applicationId?: string;

  @IsOptional()
  @IsDateString()
  interviewDate?: string;

  @IsOptional()
  @IsUUID()
  interviewerId?: string;

  @IsOptional()
  @IsString()
  interviewFormat?: string;

  @IsOptional()
  @IsString()
  evaluation?: string;

  @IsOptional()
  @IsString()
  evaluationComment?: string;
}
