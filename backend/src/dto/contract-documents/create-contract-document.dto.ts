import { IsNotEmpty, IsOptional, IsUUID, IsDate, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContractDocumentDto {
  @IsNotEmpty()
  @IsUUID()
  contractId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  filePath: string;

  @IsNotEmpty()
  @IsString()
  fileType: string;

  @IsNotEmpty()
  @IsNumber()
  fileSize: number;

  @IsNotEmpty()
  @IsEnum(['契約書', '覚書', '変更依頼書', '請求書', 'その他'])
  documentType: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  uploadedBy?: string;
}
