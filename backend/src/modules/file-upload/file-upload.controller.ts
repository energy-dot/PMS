import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, UploadedFiles, Body, Get, Param, Res, Delete } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FileUploadService } from './file-upload.service';
import { Response } from 'express';

@Controller('file-upload')
@UseGuards(JwtAuthGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { entityType: string; entityId: string },
  ) {
    return this.fileUploadService.saveFileMetadata(
      file,
      body.entityType,
      body.entityId,
    );
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { entityType: string; entityId: string },
  ) {
    return Promise.all(
      files.map(file =>
        this.fileUploadService.saveFileMetadata(
          file,
          body.entityType,
          body.entityId,
        ),
      ),
    );
  }

  @Get('entity/:entityType/:entityId')
  getFilesByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.fileUploadService.getFilesByEntity(entityType, entityId);
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const fileData = await this.fileUploadService.getFileById(id);
    res.setHeader('Content-Type', fileData.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${fileData.originalName}"`);
    return res.sendFile(fileData.path, { root: './' });
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const fileData = await this.fileUploadService.getFileById(id);
    res.setHeader('Content-Type', fileData.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName}"`);
    return res.sendFile(fileData.path, { root: './' });
  }

  @Delete(':id')
  deleteFile(@Param('id') id: string) {
    return this.fileUploadService.deleteFile(id);
  }
}
