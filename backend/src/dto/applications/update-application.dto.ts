import { IsOptional, IsUUID, IsString, IsNumber, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  partnerId?: string;

  @IsOptional()
  @IsUUID()
  contactPersonId?: string;

  @IsOptional()
  @IsString()
  applicantName?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  nearestStation?: string;

  @IsOptional()
  @IsString()
  desiredRate?: string;

  @IsOptional()
  @IsString()
  skillSummary?: string;

  @IsOptional()
  @IsString()
  skillSheetUrl?: string;

  @IsOptional()
  @IsDateString()
  applicationDate?: string;

  @IsOptional()
  @IsString()
  applicationSource?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  documentScreenerId?: string;

  @IsOptional()
  @IsString()
  documentScreeningComment?: string;

  @IsOptional()
  @IsDateString()
  finalResultNotificationDate?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
