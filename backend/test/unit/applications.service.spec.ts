import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from '../../src/modules/applications/applications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application } from '../../src/entities/application.entity';
import { InterviewRecord } from '../../src/entities/interview-record.entity';
import { CreateApplicationDto } from '../../src/dto/applications/create-application.dto';
import { CreateInterviewRecordDto } from '../../src/dto/applications/create-interview-record.dto';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let mockApplicationsRepository: MockRepository<Application>;
  let mockInterviewRecordsRepository: MockRepository<InterviewRecord>;

  const mockApplications = [
    {
      id: '1',
      projectId: 'project1',
      staffId: 'staff1',
      status: '書類選考中',
      appliedDate: new Date('2025-01-15'),
      notes: 'テスト応募者1',
      createdAt: new Date(),
      updatedAt: new Date(),
      project: { id: 'project1', name: 'テストプロジェクト1' },
      staff: { id: 'staff1', fullName: 'テスト要員1' },
      interviewRecords: [],
    },
    {
      id: '2',
      projectId: 'project2',
      staffId: 'staff2',
      status: '一次面接',
      appliedDate: new Date('2025-02-10'),
      notes: 'テスト応募者2',
      createdAt: new Date(),
      updatedAt: new Date(),
      project: { id: 'project2', name: 'テストプロジェクト2' },
      staff: { id: 'staff2', fullName: 'テスト要員2' },
      interviewRecords: [],
    },
  ];

  const mockInterviewRecords = [
    {
      id: '1',
      applicationId: '1',
      interviewDate: new Date('2025-01-20'),
      interviewType: '一次面接',
      interviewers: '面接官A, 面接官B',
      result: '合格',
      feedback: 'コミュニケーション能力が高い',
      notes: 'テスト面接記録1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      applicationId: '2',
      interviewDate: new Date('2025-02-15'),
      interviewType: '一次面接',
      interviewers: '面接官C, 面接官D',
      result: '保留',
      feedback: '技術力は高いが、コミュニケーションに課題あり',
      notes: 'テスト面接記録2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    mockApplicationsRepository = {
      find: jest.fn().mockResolvedValue(mockApplications),
      findOne: jest.fn().mockImplementation(({ where }) => {
        const application = mockApplications.find(a => a.id === where.id);
        return Promise.resolve(application);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(application => {
        if (!application.id) {
          application.id = String(Date.now());
        }
        return Promise.resolve(application);
      }),
      merge: jest.fn().mockImplementation((application, dto) => ({ ...application, ...dto })),
      remove: jest.fn().mockResolvedValue(true),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn()
      })),
      delete: jest.fn(),
      count: jest.fn()
    } as unknown as MockRepository<Application>;

    mockInterviewRecordsRepository = {
      find: jest.fn().mockImplementation(({ where }) => {
        const records = mockInterviewRecords.filter(r => r.applicationId === where.applicationId);
        return Promise.resolve(records);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(record => {
        if (!record.id) {
          record.id = String(Date.now());
        }
        return Promise.resolve(record);
      }),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn()
      })),
      delete: jest.fn(),
      count: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn()
    } as unknown as MockRepository<InterviewRecord>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationsRepository,
        },
        {
          provide: getRepositoryToken(InterviewRecord),
          useValue: mockInterviewRecordsRepository,
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of applications', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockApplications);
      expect(mockApplicationsRepository.find).toHaveBeenCalledWith({
        relations: ['project', 'staff', 'interviewRecords'],
      });
    });
  });

  describe('findOne', () => {
    it('should return an application by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockApplications[0]);
      expect(mockApplicationsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['project', 'staff', 'interviewRecords'],
      });
    });

    it('should throw error if application not found', async () => {
      mockApplicationsRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(
        '応募ID 999 は見つかりませんでした',
      );
    });
  });

  describe('create', () => {
    it('should create a new application', async () => {
      const createApplicationDto: CreateApplicationDto = {
        projectId: 'project3',
        partnerId: 'partner1',
        applicantName: 'Test Applicant',
        applicationDate: new Date('2025-03-01'),
        status: '書類選考中',
        notes: '新規応募者',
      };

      const result = await service.create(createApplicationDto);

      expect(result).toHaveProperty('id');
      expect(result.projectId).toBe(createApplicationDto.projectId);
      expect(result.partnerId).toBe(createApplicationDto.partnerId);
      expect(result.status).toBe(createApplicationDto.status);
      expect(result.applicationDate).toEqual(createApplicationDto.applicationDate);
      expect(result.notes).toBe(createApplicationDto.notes);

      expect(mockApplicationsRepository.create).toHaveBeenCalledWith(createApplicationDto);
      expect(mockApplicationsRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing application', async () => {
      const updateApplicationDto = {
        status: '二次面接',
        notes: '更新備考',
      };

      const result = await service.update('1', updateApplicationDto);

      expect(result.id).toBe('1');
      expect(result.status).toBe('二次面接');
      expect(result.notes).toBe('更新備考');
      expect(mockApplicationsRepository.merge).toHaveBeenCalled();
      expect(mockApplicationsRepository.save).toHaveBeenCalled();
    });

    it('should throw error if application not found', async () => {
      mockApplicationsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.update('999', { status: 'テスト' })).rejects.toThrow(
        '応募ID 999 は見つかりませんでした',
      );
    });
  });

  describe('remove', () => {
    it('should remove an application', async () => {
      await service.remove('1');
      expect(mockApplicationsRepository.remove).toHaveBeenCalled();
    });

    it('should throw error if application not found', async () => {
      mockApplicationsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.remove('999')).rejects.toThrow(
        '応募ID 999 は見つかりませんでした',
      );
    });
  });

  describe('findByProject', () => {
    it('should return applications filtered by project', async () => {
      mockApplicationsRepository.find.mockResolvedValueOnce([mockApplications[0]]);
      
      const result = await service.findByProject('project1');
      
      expect(result).toEqual([mockApplications[0]]);
      expect(mockApplicationsRepository.find).toHaveBeenCalledWith({
        where: { projectId: 'project1' },
        relations: ['project', 'staff', 'interviewRecords'],
      });
    });
  });

  describe('findByStaff', () => {
    it('should return applications filtered by staff', async () => {
      mockApplicationsRepository.find.mockResolvedValueOnce([mockApplications[0]]);
      
      const result = await service.findByStaff('staff1');
      
      expect(result).toEqual([mockApplications[0]]);
      expect(mockApplicationsRepository.find).toHaveBeenCalledWith({
        where: { staffId: 'staff1' },
        relations: ['project', 'staff', 'interviewRecords'],
      });
    });
  });

  describe('findByStatus', () => {
    it('should return applications filtered by status', async () => {
      mockApplicationsRepository.find.mockResolvedValueOnce([mockApplications[0]]);
      
      const result = await service.findByStatus('書類選考中');
      
      expect(result).toEqual([mockApplications[0]]);
      expect(mockApplicationsRepository.find).toHaveBeenCalledWith({
        where: { status: '書類選考中' },
        relations: ['project', 'staff', 'interviewRecords'],
      });
    });
  });

  describe('addInterviewRecord', () => {
    it('should add an interview record to an application', async () => {
      const createInterviewRecordDto: CreateInterviewRecordDto = {
        applicationId: '1',
        interviewDate: new Date('2025-01-25'),
        interviewFormat: '対面',
        interviewers: ['面接官E', '面接官F'],
        result: '合格',
        feedback: '技術力が高く、チームへの適合性も良好',
        notes: '新規面接記録',
      };

      const mockSavedRecord = {
        id: '3',
        ...createInterviewRecordDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockInterviewRecordsRepository.save.mockResolvedValueOnce(mockSavedRecord);

      const result = await service.addInterviewRecord('1', createInterviewRecordDto);

      expect(result).toEqual(mockSavedRecord);
      expect(mockInterviewRecordsRepository.create).toHaveBeenCalledWith(createInterviewRecordDto);
      expect(mockInterviewRecordsRepository.save).toHaveBeenCalled();
    });
  });

  describe('getInterviewRecords', () => {
    it('should return interview records for an application', async () => {
      const result = await service.getInterviewRecords('1');
      
      expect(result).toEqual([mockInterviewRecords[0]]);
      expect(mockInterviewRecordsRepository.find).toHaveBeenCalledWith({
        where: { applicationId: '1' },
      });
    });
  });
});
