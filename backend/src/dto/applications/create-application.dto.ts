import { IsNotEmpty, IsUUID, IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  @IsUUID()
  partnerId: string;

  @IsOptional()
  @IsUUID()
  contactPersonId?: string;

  @IsNotEmpty()
  @IsString()
  applicantName: string;

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

  @IsNotEmpty()
  @IsDateString()
  applicationDate: string;

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
