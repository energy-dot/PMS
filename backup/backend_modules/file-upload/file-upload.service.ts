import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// ファイルメタデータを保存するためのエンティティを作成
// このエンティティはデータベースに保存されます
export class FileMetadata {
  id: string;
  originalName: string;
  fileName: string;
  path: string;
  mimeType: string;
  size: number;
  entityType: string;
  entityId: string;
  uploadDate: Date;
}

@Injectable()
export class FileUploadService {
  private readonly files: Map<string, FileMetadata> = new Map();
  private readonly uploadDir = './uploads';

  constructor() {
    // アップロードディレクトリが存在することを確認
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists() {
    try {
      await fs.access(this.uploadDir);
    } catch (error) {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveFileMetadata(
    file: Express.Multer.File,
    entityType: string,
    entityId: string,
  ): Promise<FileMetadata> {
    const fileId = uuidv4();
    const fileMetadata: FileMetadata = {
      id: fileId,
      originalName: file.originalname,
      fileName: file.filename,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
      entityType,
      entityId,
      uploadDate: new Date(),
    };

    this.files.set(fileId, fileMetadata);
    return fileMetadata;
  }

  async getFilesByEntity(entityType: string, entityId: string): Promise<FileMetadata[]> {
    const result: FileMetadata[] = [];
    for (const [_, fileMetadata] of this.files) {
      if (fileMetadata.entityType === entityType && fileMetadata.entityId === entityId) {
        result.push(fileMetadata);
      }
    }
    return result;
  }

  async getFileById(id: string): Promise<FileMetadata> {
    const fileMetadata = this.files.get(id);
    if (!fileMetadata) {
      throw new NotFoundException(`ファイルID ${id} は見つかりませんでした`);
    }
    return fileMetadata;
  }

  async deleteFile(id: string): Promise<{ success: boolean }> {
    const fileMetadata = await this.getFileById(id);
    try {
      await fs.unlink(fileMetadata.path);
      this.files.delete(id);
      return { success: true };
    } catch (error) {
      throw new Error(`ファイルの削除に失敗しました: ${error.message}`);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    entityId: string,
    description?: string,
  ): Promise<FileMetadata> {
    // フォルダパスの作成
    const folderPath = join(this.uploadDir, folder, entityId);

    // フォルダが存在しない場合は作成
    try {
      await fs.access(folderPath);
    } catch {
      await fs.mkdir(folderPath, { recursive: true });
    }

    // ファイル名の生成（オリジナル名を保持しつつ、一意になるようにする）
    const ext = file.originalname.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${ext}`;
    const filePath = join(folderPath, uniqueFileName);

    // ファイルの保存
    await fs.writeFile(filePath, file.buffer);

    // メタデータの保存
    const metadata = new FileMetadata();
    metadata.id = uuidv4();
    metadata.originalName = file.originalname;
    metadata.fileName = uniqueFileName;
    metadata.path = filePath;
    metadata.mimeType = file.mimetype;
    metadata.size = file.size;
    metadata.entityType = folder;
    metadata.entityId = entityId;
    metadata.uploadDate = new Date();

    // メタデータをインメモリストレージに保存
    this.files.set(metadata.id, metadata);

    return metadata;
  }
}
