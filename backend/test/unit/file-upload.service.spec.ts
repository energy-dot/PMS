import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadService } from '../../src/modules/file-upload/file-upload.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  createWriteStream: jest.fn(),
  unlinkSync: jest.fn(),
  readdirSync: jest.fn(),
  statSync: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
  extname: jest.fn(),
  basename: jest.fn(),
}));

describe('FileUploadService', () => {
  let service: FileUploadService;
  let mockConfigService;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn().mockReturnValue('/uploads'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      // モックの設定
      const mockFile = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test content'),
        mimetype: 'application/pdf',
        size: 1024,
      };
      
      const mockFolder = 'contracts';
      const mockEntityId = 'contract1';
      
      const mockFilePath = '/uploads/contracts/contract1/test.pdf';
      path.join.mockReturnValue(mockFilePath);
      path.extname.mockReturnValue('.pdf');
      path.basename.mockReturnValue('test');
      
      fs.existsSync.mockReturnValue(false);
      
      const mockWriteStream = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'finish') {
            callback();
          }
          return mockWriteStream;
        }),
      };
      
      fs.createWriteStream.mockReturnValue(mockWriteStream);

      // テスト実行
      const result = await service.uploadFile(mockFile, mockFolder, mockEntityId);

      // 検証
      expect(result).toEqual({
        originalName: 'test.pdf',
        fileName: 'test.pdf',
        filePath: mockFilePath,
        mimeType: 'application/pdf',
        size: 1024,
      });
      
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.createWriteStream).toHaveBeenCalledWith(mockFilePath);
      expect(mockWriteStream.write).toHaveBeenCalledWith(mockFile.buffer);
      expect(mockWriteStream.end).toHaveBeenCalled();
    });

    it('should handle file upload error', async () => {
      // モックの設定
      const mockFile = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test content'),
        mimetype: 'application/pdf',
        size: 1024,
      };
      
      const mockFolder = 'contracts';
      const mockEntityId = 'contract1';
      
      const mockFilePath = '/uploads/contracts/contract1/test.pdf';
      path.join.mockReturnValue(mockFilePath);
      path.extname.mockReturnValue('.pdf');
      path.basename.mockReturnValue('test');
      
      fs.existsSync.mockReturnValue(false);
      
      const mockWriteStream = {
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'error') {
            callback(new Error('Write error'));
          }
          return mockWriteStream;
        }),
      };
      
      fs.createWriteStream.mockReturnValue(mockWriteStream);

      // テスト実行とエラー検証
      await expect(service.uploadFile(mockFile, mockFolder, mockEntityId)).rejects.toThrow('Write error');
    });
  });

  describe('deleteFile', () => {
    it('should delete a file successfully', async () => {
      // モックの設定
      const mockFilePath = '/uploads/contracts/contract1/test.pdf';
      fs.existsSync.mockReturnValue(true);

      // テスト実行
      await service.deleteFile(mockFilePath);

      // 検証
      expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath);
    });

    it('should handle file not found', async () => {
      // モックの設定
      const mockFilePath = '/uploads/contracts/contract1/test.pdf';
      fs.existsSync.mockReturnValue(false);

      // テスト実行とエラー検証
      await expect(service.deleteFile(mockFilePath)).rejects.toThrow('ファイルが見つかりません');
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });
  });

  describe('getFilesByEntity', () => {
    it('should return files for an entity', async () => {
      // モックの設定
      const mockFolder = 'contracts';
      const mockEntityId = 'contract1';
      
      const mockDirPath = '/uploads/contracts/contract1';
      path.join.mockReturnValue(mockDirPath);
      
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue(['file1.pdf', 'file2.docx']);
      
      fs.statSync.mockImplementation((filePath) => ({
        isFile: () => true,
        size: filePath.includes('file1') ? 1024 : 2048,
        mtime: new Date(),
      }));
      
      path.extname.mockImplementation((fileName) => {
        if (fileName.includes('file1')) return '.pdf';
        if (fileName.includes('file2')) return '.docx';
        return '';
      });

      // テスト実行
      const result = await service.getFilesByEntity(mockFolder, mockEntityId);

      // 検証
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('fileName', 'file1.pdf');
      expect(result[0]).toHaveProperty('filePath');
      expect(result[0]).toHaveProperty('mimeType', 'application/pdf');
      expect(result[0]).toHaveProperty('size', 1024);
      
      expect(result[1]).toHaveProperty('fileName', 'file2.docx');
      expect(result[1]).toHaveProperty('filePath');
      expect(result[1]).toHaveProperty('mimeType', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      expect(result[1]).toHaveProperty('size', 2048);
    });

    it('should return empty array if directory does not exist', async () => {
      // モックの設定
      const mockFolder = 'contracts';
      const mockEntityId = 'contract1';
      
      const mockDirPath = '/uploads/contracts/contract1';
      path.join.mockReturnValue(mockDirPath);
      
      fs.existsSync.mockReturnValue(false);

      // テスト実行
      const result = await service.getFilesByEntity(mockFolder, mockEntityId);

      // 検証
      expect(result).toEqual([]);
      expect(fs.readdirSync).not.toHaveBeenCalled();
    });
  });

  describe('getMimeType', () => {
    it('should return correct mime type for known extensions', () => {
      // テスト実行と検証
      expect(service.getMimeType('.pdf')).toBe('application/pdf');
      expect(service.getMimeType('.docx')).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      expect(service.getMimeType('.xlsx')).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(service.getMimeType('.jpg')).toBe('image/jpeg');
      expect(service.getMimeType('.png')).toBe('image/png');
    });

    it('should return default mime type for unknown extensions', () => {
      // テスト実行と検証
      expect(service.getMimeType('.unknown')).toBe('application/octet-stream');
    });
  });
});
