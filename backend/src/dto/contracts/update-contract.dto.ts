import { PartialType } from '@nestjs/mapped-types';
import { CreateContractDto } from './create-contract.dto';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateContractDto extends PartialType(CreateContractDto) {
  @IsOptional()
  @IsNumber()
  monthlyRate?: number;

  @IsOptional()
  @IsNumber()
  manMonth?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
