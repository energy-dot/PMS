import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ContractDocumentsService } from './contract-documents.service';
import { FileMetadata } from '../../entities/file-metadata.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../enums/user-role.enum';

@ApiTags('contract-documents')
@Controller('contract-documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContractDocumentsController {
  constructor(private readonly contractDocumentsService: ContractDocumentsService) {}

  @Get(':contractId')
  @ApiOperation({ summary: '契約書ファイル一覧の取得' })
  @Roles(UserRole.ADMIN, UserRole.PARTNER_MANAGER, UserRole.DEVELOPMENT_MANAGER)
  async getContractDocuments(@Param('contractId') contractId: string): Promise<FileMetadata[]> {
    return this.contractDocumentsService.getContractDocuments(contractId);
  }

  @Post(':contractId')
  @ApiOperation({ summary: '契約書ファイルのアップロード' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.ADMIN, UserRole.PARTNER_MANAGER)
  async addDocument(
    @Param('contractId') contractId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description: string,
  ): Promise<FileMetadata> {
    return this.contractDocumentsService.addDocument(contractId, file, description);
  }

  @Delete(':contractId/:fileId')
  @ApiOperation({ summary: '契約書ファイルの削除' })
  @Roles(UserRole.ADMIN, UserRole.PARTNER_MANAGER)
  async removeDocument(
    @Param('contractId') contractId: string,
    @Param('fileId') fileId: string,
  ): Promise<void> {
    return this.contractDocumentsService.removeDocument(contractId, fileId);
  }
}
