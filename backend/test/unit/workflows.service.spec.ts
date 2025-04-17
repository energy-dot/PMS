import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowsService } from '../../src/modules/workflows/workflows.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequestHistory } from '../../src/entities/request-history.entity';
import { Project } from '../../src/entities/project.entity';

describe('WorkflowsService', () => {
  let service: WorkflowsService;
  let mockRequestHistoryRepository: any;
  let mockProjectsRepository: any;

  const mockRequestHistories = [
    {
      id: '1',
      projectId: 'project1',
      requesterId: 'user1',
      approverId: 'user2',
      requestType: '案件承認申請',
      requestStatus: '承認待ち',
      requestDate: new Date('2025-01-15'),
      approvalDate: null,
      remarks: 'テスト申請1の備考',
      rejectionReason: null,
      requester: { id: 'user1', fullName: 'テスト申請者1' },
      approver: { id: 'user2', fullName: 'テスト承認者1' },
      project: { id: 'project1', name: 'テストプロジェクト1' }
    },
    {
      id: '2',
      projectId: 'project2',
      requesterId: 'user3',
      approverId: 'user4',
      requestType: '案件承認申請',
      requestStatus: '承認済み',
      requestDate: new Date('2025-02-10'),
      approvalDate: new Date('2025-02-11'),
      remarks: 'テスト申請2の備考',
      rejectionReason: null,
      requester: { id: 'user3', fullName: 'テスト申請者2' },
      approver: { id: 'user4', fullName: 'テスト承認者2' },
      project: { id: 'project2', name: 'テストプロジェクト2' }
    }
  ];

  const mockProjects = [
    {
      id: 'project1',
      name: 'テストプロジェクト1',
      approvalStatus: '承認待ち',
      approverId: null,
      approvalDate: null,
      rejectionReason: null
    },
    {
      id: 'project2',
      name: 'テストプロジェクト2',
      approvalStatus: '承認済み',
      approverId: 'user4',
      approvalDate: new Date('2025-02-11'),
      rejectionReason: null
    }
  ];

  beforeEach(async () => {
    mockRequestHistoryRepository = {
      find: jest.fn().mockImplementation(({ where, relations, order }) => {
        let histories = [...mockRequestHistories];
        
        if (where) {
          if (where.projectId) {
            histories = histories.filter(h => h.projectId === where.projectId);
          }
          if (where.requesterId) {
            histories = histories.filter(h => h.requesterId === where.requesterId);
          }
          if (where.requestStatus) {
            histories = histories.filter(h => h.requestStatus === where.requestStatus);
          }
        }
        
        return Promise.resolve(histories);
      }),
      findOne: jest.fn().mockImplementation(({ where, relations }) => {
        const history = mockRequestHistories.find(h => h.id === where.id);
        return Promise.resolve(history);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(history => {
        if (!history.id) {
          history.id = String(Date.now());
        }
        return Promise.resolve(history);
      }),
      merge: jest.fn().mockImplementation((history, dto) => ({ ...history, ...dto })),
      remove: jest.fn().mockResolvedValue(true),
    };

    mockProjectsRepository = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        const project = mockProjects.find(p => p.id === where.id);
        return Promise.resolve(project);
      }),
      save: jest.fn().mockImplementation(project => {
        return Promise.resolve(project);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowsService,
        {
          provide: getRepositoryToken(RequestHistory),
          useValue: mockRequestHistoryRepository,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectsRepository,
        },
      ],
    }).compile();

    service = module.get<WorkflowsService>(WorkflowsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllRequestHistories', () => {
    it('should return an array of request histories', async () => {
      const result = await service.findAllRequestHistories();
      expect(result).toEqual(mockRequestHistories);
      expect(mockRequestHistoryRepository.find).toHaveBeenCalledWith({
        relations: ['project', 'requester', 'approver'],
      });
    });
  });

  describe('findRequestHistoryById', () => {
    it('should return a request history by id', async () => {
      const result = await service.findRequestHistoryById('1');
      expect(result).toEqual(mockRequestHistories[0]);
      expect(mockRequestHistoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['project', 'requester', 'approver'],
      });
    });

    it('should throw error if request history not found', async () => {
      mockRequestHistoryRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findRequestHistoryById('999')).rejects.toThrow(
        '申請履歴ID 999 は見つかりませんでした',
      );
    });
  });

  describe('findRequestHistoriesByProjectId', () => {
    it('should return request histories filtered by project id', async () => {
      const result = await service.findRequestHistoriesByProjectId('project1');
      expect(result).toEqual([mockRequestHistories[0]]);
      expect(mockRequestHistoryRepository.find).toHaveBeenCalledWith({
        where: { projectId: 'project1' },
        relations: ['project', 'requester', 'approver'],
      });
    });
  });

  describe('findRequestHistoriesByRequesterId', () => {
    it('should return request histories filtered by requester id', async () => {
      const result = await service.findRequestHistoriesByRequesterId('user1');
      expect(result).toEqual([mockRequestHistories[0]]);
      expect(mockRequestHistoryRepository.find).toHaveBeenCalledWith({
        where: { requesterId: 'user1' },
        relations: ['project', 'requester', 'approver'],
      });
    });
  });

  describe('findRequestHistoriesByStatus', () => {
    it('should return request histories filtered by status', async () => {
      const result = await service.findRequestHistoriesByStatus('承認待ち');
      expect(result).toEqual([mockRequestHistories[0]]);
      expect(mockRequestHistoryRepository.find).toHaveBeenCalledWith({
        where: { requestStatus: '承認待ち' },
        relations: ['project', 'requester', 'approver'],
      });
    });
  });

  describe('getPendingApprovals', () => {
    it('should return pending approval request histories', async () => {
      const result = await service.getPendingApprovals();
      expect(result).toEqual([mockRequestHistories[0]]);
      expect(mockRequestHistoryRepository.find).toHaveBeenCalledWith({
        where: { requestStatus: '承認待ち' },
        relations: ['project', 'requester'],
      });
    });
  });

  describe('approveProject', () => {
    it('should approve a project request', async () => {
      const updatedRequestHistory = {
        ...mockRequestHistories[0],
        requestStatus: '承認済み',
        approverId: 'user2',
        approvalDate: expect.any(Date),
        remarks: 'テスト承認備考'
      };

      mockRequestHistoryRepository.save.mockResolvedValueOnce(updatedRequestHistory);

      const result = await service.approveProject('1', 'user2', 'テスト承認備考');

      expect(result).toEqual(updatedRequestHistory);
      expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'project1' }
      });
      expect(mockProjectsRepository.save).toHaveBeenCalled();
      expect(mockRequestHistoryRepository.save).toHaveBeenCalled();
    });

    it('should throw error if request history not found', async () => {
      mockRequestHistoryRepository.findOne.mockResolvedValueOnce(null);
      
      await expect(service.approveProject('999', 'user2')).rejects.toThrow(
        '申請履歴ID 999 は見つかりませんでした',
      );
    });

    it('should throw error if request is already processed', async () => {
      const processedHistory = {
        ...mockRequestHistories[0],
        requestStatus: '承認済み'
      };
      
      mockRequestHistoryRepository.findOne.mockResolvedValueOnce(processedHistory);
      
      await expect(service.approveProject('1', 'user2')).rejects.toThrow(
        'この申請は既に処理されています',
      );
    });
  });

  describe('rejectProject', () => {
    it('should reject a project request', async () => {
      const updatedRequestHistory = {
        ...mockRequestHistories[0],
        requestStatus: '差戻し',
        approverId: 'user2',
        approvalDate: expect.any(Date),
        rejectionReason: 'テスト却下理由'
      };

      mockRequestHistoryRepository.save.mockResolvedValueOnce(updatedRequestHistory);

      const result = await service.rejectProject('1', 'user2', 'テスト却下理由');

      expect(result).toEqual(updatedRequestHistory);
      expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'project1' }
      });
      expect(mockProjectsRepository.save).toHaveBeenCalled();
      expect(mockRequestHistoryRepository.save).toHaveBeenCalled();
    });

    it('should throw error if request history not found', async () => {
      mockRequestHistoryRepository.findOne.mockResolvedValueOnce(null);
      
      await expect(service.rejectProject('999', 'user2', 'テスト却下理由')).rejects.toThrow(
        '申請履歴ID 999 は見つかりませんでした',
      );
    });
  });
});
