import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadService } from '../../src/modules/file-upload/file-upload.service';
import { ProjectsService } from '../../src/modules/projects/projects.service';
import { StaffService } from '../../src/modules/staff/staff.service';
import { ContractsService } from '../../src/modules/contracts/contracts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../../src/entities/project.entity';
import { Staff } from '../../src/entities/staff.entity';
import { Contract } from '../../src/entities/contract.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

describe('FileUpload Entity Integration', () => {
  let fileUploadService: FileUploadService;
  let projectsService: ProjectsService;
  let staffService: StaffService;
  let contractsService: ContractsService;
  let mockProjectRepository: Partial<Repository<Project>>;
  let mockStaffRepository: Partial<Repository<Staff>>;
  let mockContractRepository: Partial<Repository<Contract>>;

  const mockProjects = [
    {
      id: 'project1',
      name: 'テストプロジェクト',
      description: 'テストプロジェクトの説明',
      status: '進行中',
      documents: [],
    }
  ];

  const mockStaff = [
    {
      id: 'staff1',
      firstName: '太郎',
      lastName: 'テスト',
      email: 'test.taro@example.com',
      skillSheets: [],
    }
  ];

  const mockContracts = [
    {
      id: 'contract1',
      projectId: 'project1',
      staffId: 'staff1',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      documents: [],
    }
  ];

  // テスト用のファイルパス
  const testFilesDir = path.join(__dirname, '../../test-files');
  const testFilePath = path.join(testFilesDir, 'test-document.pdf');

  beforeAll(() => {
    // テスト用のディレクトリとファイルを作成
    if (!fs.existsSync(testFilesDir)) {
      fs.mkdirSync(testFilesDir, { recursive: true });
    }
    
    // テスト用のダミーPDFファイルを作成
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, 'Dummy PDF content');
    }
  });

  afterAll(() => {
    // テスト用のファイルとディレクトリを削除
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    if (fs.existsSync(testFilesDir)) {
      fs.rmdirSync(testFilesDir);
    }
  });

  beforeEach(async () => {
    // モックリポジトリの設定
    mockProjectRepository = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        const project = JSON.parse(JSON.stringify(mockProjects.find(p => p.id === where.id)));
        return Promise.resolve(project as Project);
      }),
      save: jest.fn().mockImplementation(project => Promise.resolve(project as Project)),
    };

    mockStaffRepository = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        const staff = JSON.parse(JSON.stringify(mockStaff.find(s => s.id === where.id)));
        return Promise.resolve(staff as Staff);
      }),
      save: jest.fn().mockImplementation(staff => Promise.resolve(staff as Staff)),
    };

    mockContractRepository = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        const contract = JSON.parse(JSON.stringify(mockContracts.find(c => c.id === where.id)));
        return Promise.resolve(contract as Contract);
      }),
      save: jest.fn().mockImplementation(contract => Promise.resolve(contract as Contract)),
    };

    // FileUploadServiceのモック
    const mockFileUploadService = {
      uploadFile: jest.fn().mockImplementation((file, destination) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(destination, fileName);
        return Promise.resolve({
          fileName,
          filePath,
          fileSize: file.size,
          mimeType: file.mimetype,
        });
      }),
      deleteFile: jest.fn().mockImplementation((filePath) => {
        return Promise.resolve(true);
      }),
      getFileStream: jest.fn().mockImplementation((filePath) => {
        return fs.createReadStream(testFilePath);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FileUploadService,
          useValue: mockFileUploadService,
        },
        ProjectsService,
        StaffService,
        ContractsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepository,
        },
        {
          provide: getRepositoryToken(Staff),
          useValue: mockStaffRepository,
        },
        {
          provide: getRepositoryToken(Contract),
          useValue: mockContractRepository,
        },
      ],
    }).compile();

    fileUploadService = module.get<FileUploadService>(FileUploadService);
    projectsService = module.get<ProjectsService>(ProjectsService);
    staffService = module.get<StaffService>(StaffService);
    contractsService = module.get<ContractsService>(ContractsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ファイルアップロードと関連エンティティの連携', () => {
    it('案件に関連する書類をアップロードできること', async () => {
      // テスト用のファイルオブジェクト
      const mockFile = {
        fieldname: 'document',
        originalname: 'project-document.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: Buffer.from('Dummy PDF content'),
        size: 100,
      };

      // ファイルアップロードのスパイを設定
      const uploadFileSpy = jest.spyOn(fileUploadService, 'uploadFile');

      // 案件に書類をアップロード
      const result = await projectsService.addDocument('project1', mockFile as any, '案件計画書');

      // ファイルがアップロードされたことを検証
      expect(uploadFileSpy).toHaveBeenCalled();
      
      // 案件エンティティが更新されたことを検証
      expect(mockProjectRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'project1',
          documents: expect.arrayContaining([
            expect.objectContaining({
              documentType: '案件計画書',
              fileName: expect.any(String),
              filePath: expect.any(String),
            })
          ])
        })
      );
    });

    it('要員のスキルシートをアップロードできること', async () => {
      // テスト用のファイルオブジェクト
      const mockFile = {
        fieldname: 'skillSheet',
        originalname: 'skill-sheet.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: Buffer.from('Dummy PDF content'),
        size: 100,
      };

      // ファイルアップロードのスパイを設定
      const uploadFileSpy = jest.spyOn(fileUploadService, 'uploadFile');

      // 要員にスキルシートをアップロード
      const result = await staffService.addSkillSheet('staff1', mockFile as any, 'Java開発スキル');

      // ファイルがアップロードされたことを検証
      expect(uploadFileSpy).toHaveBeenCalled();
      
      // 要員エンティティが更新されたことを検証
      expect(mockStaffRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'staff1',
          skillSheets: expect.arrayContaining([
            expect.objectContaining({
              skillType: 'Java開発スキル',
              fileName: expect.any(String),
              filePath: expect.any(String),
            })
          ])
        })
      );
    });

    it('契約に関連する書類をアップロードできること', async () => {
      // テスト用のファイルオブジェクト
      const mockFile = {
        fieldname: 'document',
        originalname: 'contract-document.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: Buffer.from('Dummy PDF content'),
        size: 100,
      };

      // ファイルアップロードのスパイを設定
      const uploadFileSpy = jest.spyOn(fileUploadService, 'uploadFile');

      // 契約に書類をアップロード
      const result = await contractsService.addDocument('contract1', mockFile as any, '契約書');

      // ファイルがアップロードされたことを検証
      expect(uploadFileSpy).toHaveBeenCalled();
      
      // 契約エンティティが更新されたことを検証
      expect(mockContractRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'contract1',
          documents: expect.arrayContaining([
            expect.objectContaining({
              documentType: '契約書',
              fileName: expect.any(String),
              filePath: expect.any(String),
            })
          ])
        })
      );
    });

    it('アップロードしたファイルを削除できること', async () => {
      // テスト用のファイルオブジェクト
      const mockFile = {
        fieldname: 'document',
        originalname: 'project-document.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: Buffer.from('Dummy PDF content'),
        size: 100,
      };

      // まずファイルをアップロード
      const uploadResult = await projectsService.addDocument('project1', mockFile as any, '案件計画書');
      
      // アップロードされたファイルのIDを取得（モックなので適当な値を設定）
      const documentId = '1';
      
      // ファイル削除のスパイを設定
      const deleteFileSpy = jest.spyOn(fileUploadService, 'deleteFile');

      // ファイルを削除
      await projectsService.removeDocument('project1', documentId);

      // ファイルが削除されたことを検証
      expect(deleteFileSpy).toHaveBeenCalled();
      
      // 案件エンティティが更新されたことを検証
      expect(mockProjectRepository.save).toHaveBeenCalled();
    });
  });
});
