import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from '../../entities/contract.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { FileMetadata } from '../../entities/file-metadata.entity';
import { ContractDocument } from '../../entities/contract-document.entity';

@Injectable()
export class ContractDocumentsService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(ContractDocument)
    private contractDocumentRepository: Repository<ContractDocument>,
    private fileUploadService: FileUploadService,
  ) {}

  // 契約書ファイルの取得
  async getContractDocuments(contractId: string): Promise<FileMetadata[]> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
      relations: ['documents'],
    });

    if (!contract) {
      throw new NotFoundException(`契約ID ${contractId} は見つかりませんでした`);
    }

    // ContractDocument配列からFileMetadata配列に変換
    const fileMetadataList: FileMetadata[] = [];
    if (contract.documents && contract.documents.length > 0) {
      for (const doc of contract.documents) {
        const fileMetadata = new FileMetadata();
        fileMetadata.id = doc.id;
        fileMetadata.fileName = doc.name;
        fileMetadata.filePath = doc.filePath;
        fileMetadata.originalName = doc.name;
        fileMetadata.mimetype = doc.fileType;
        fileMetadata.size = doc.fileSize;
        fileMetadata.description = doc.remarks;
        fileMetadata.contractId = contractId;
        fileMetadataList.push(fileMetadata);
      }
    }

    return fileMetadataList;
  }

  // 契約書ファイルの追加
  async addDocument(
    contractId: string,
    file: Express.Multer.File,
    description: string,
  ): Promise<FileMetadata> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException(`契約ID ${contractId} は見つかりませんでした`);
    }

    // FileUploadServiceを使用してファイルをアップロード
    const uploadedFile = await this.fileUploadService.uploadFile(
      file,
      'contracts',
      contractId,
      description,
    );

    // ContractDocument エンティティを作成して保存
    const contractDocument = new ContractDocument();
    contractDocument.contract = contract;
    contractDocument.name = file.originalname;
    contractDocument.filePath = uploadedFile.path;
    contractDocument.fileType = file.mimetype;
    contractDocument.fileSize = file.size;
    contractDocument.documentType = 'その他'; // デフォルト値
    contractDocument.remarks = description;
    contractDocument.isActive = true;

    await this.contractDocumentRepository.save(contractDocument);

    // FileMetadata オブジェクトを作成して返す
    const fileMetadata = new FileMetadata();
    fileMetadata.id = contractDocument.id;
    fileMetadata.fileName = contractDocument.name;
    fileMetadata.filePath = contractDocument.filePath;
    fileMetadata.originalName = contractDocument.name;
    fileMetadata.mimetype = contractDocument.fileType;
    fileMetadata.size = contractDocument.fileSize;
    fileMetadata.description = contractDocument.remarks;
    fileMetadata.contractId = contractId;
    fileMetadata.createdAt = contractDocument.createdAt;
    fileMetadata.updatedAt = contractDocument.updatedAt;

    return fileMetadata;
  }

  // 契約書ファイルの削除
  async removeDocument(contractId: string, fileId: string): Promise<void> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
      relations: ['documents'],
    });

    if (!contract) {
      throw new NotFoundException(`契約ID ${contractId} は見つかりませんでした`);
    }

    // ファイルが契約に関連付けられているか確認
    const fileExists = contract.documents?.some(doc => doc.id === fileId);
    if (!fileExists) {
      throw new NotFoundException(
        `ファイルID ${fileId} は契約ID ${contractId} に関連付けられていません`,
      );
    }

    // ContractDocument エンティティを削除
    await this.contractDocumentRepository.delete(fileId);

    // FileUploadServiceを使用してファイルを削除
    try {
      await this.fileUploadService.deleteFile(fileId);
    } catch (error) {
      console.error('ファイル削除エラー:', error);
      // ファイルが見つからなくてもエンティティは削除済みなのでエラーは投げない
    }
  }
}
