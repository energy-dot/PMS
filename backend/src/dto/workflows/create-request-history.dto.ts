import { IsNotEmpty, IsUUID, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateRequestHistoryDto {
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  @IsUUID()
  requesterId: string;

  @IsNotEmpty()
  @IsString()
  requestType: string;

  @IsOptional()
  @IsString()
  requestStatus?: string;

  @IsNotEmpty()
  @IsDateString()
  requestDate: string;

  @IsOptional()
  @IsUUID()
  approverId?: string;

  @IsOptional()
  @IsDateString()
  approvalDate?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
