import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterDataDto } from './create-master-data.dto';
import { IsOptional, IsString, IsBoolean, IsNumber, IsObject } from 'class-validator';

export class UpdateMasterDataDto extends PartialType(CreateMasterDataDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
