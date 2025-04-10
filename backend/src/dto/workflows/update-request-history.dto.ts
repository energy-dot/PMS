import { IsOptional, IsUUID, IsString, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestHistoryDto } from './create-request-history.dto';

export class UpdateRequestHistoryDto extends PartialType(CreateRequestHistoryDto) {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  requesterId?: string;

  @IsOptional()
  @IsString()
  requestType?: string;

  @IsOptional()
  @IsString()
  requestStatus?: string;

  @IsOptional()
  @IsDateString()
  requestDate?: string;

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
