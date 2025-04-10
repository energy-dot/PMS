import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowsService } from '../../src/modules/workflows/workflows.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request } from '../../src/entities/request.entity';
import { RequestHistory } from '../../src/entities/request-history.entity';
import { UsersService } from '../../src/modules/users/users.service';
import { NotificationsService } from '../../src/modules/notifications/notifications.service';

describe('WorkflowsService', () => {
  let service: WorkflowsService;
  let mockRequestsRepository;
  let mockRequestHistoryRepository;
  let mockUsersService;
  let mockNotificationsService;

  const mockRequests = [
    {
      id: '1',
      type: '案件申請',
      title: 'テスト案件申請1',
      content: 'テスト案件申請1の内容です',
      status: '承認待ち',
      requesterId: 'user1',
      approverId: 'user2',
      relatedId: 'project1',
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15'),
      requester: { id: 'user1', fullName: 'テスト申請者1' },
      approver: { id: 'user2', fullName: 'テスト承認者1' },
      histories: [],
    },
    {
      id: '2',
      type: '契約更新',
      title: 'テスト契約更新申請1',
      content: 'テスト契約更新申請1の内容です',
      status: '承認済み',
      requesterId: 'user3',
      approverId: 'user4',
      relatedId: 'contract1',
      createdAt: new Date('2025-02-10'),
      updatedAt: new Date('2025-02-11'),
      requester: { id: 'user3', fullName: 'テスト申請者2' },
      approver: { id: 'user4', fullName: 'テスト承認者2' },
      histories: [],
    },
  ];

  const mockRequestHistories = [
    {
      id: '1',
      requestId: '1',
      status: '申請中',
      comment: '申請しました',
      actorId: 'user1',
      createdAt: new Date('2025-01-15'),
      actor: { id: 'user1', fullName: 'テスト申請者1' },
    },
    {
      id: '2',
      requestId: '2',
      status: '申請中',
      comment: '申請しました',
      actorId: 'user3',
      createdAt: new Date('2025-02-10'),
      actor: { id: 'user3', fullName: 'テスト申請者2' },
    },
    {
      id: '3',
      requestId: '2',
      status: '承認済み',
      comment: '承認します',
      actorId: 'user4',
      createdAt: new Date('2025-02-11'),
      actor: { id: 'user4', fullName: 'テスト承認者2' },
    },
  ];

  beforeEach(async () => {
    mockRequestsRepository = {
      find: jest.fn().mockImplementation(({ where }) => {
        if (where) {
          if (where.requesterId) {
            return Promise.resolve(mockRequests.filter(r => r.requesterId === where.requesterId));
          }
          if (where.approverId) {
            return Promise.resolve(mockRequests.filter(r => r.approverId === where.approverId));
          }
          if (where.status) {
            return Promise.resolve(mockRequests.filter(r => r.status === where.status));
          }
        }
        return Promise.resolve(mockRequests);
      }),
      findOne: jest.fn().mockImplementation(({ where }) => {
        const request = mockRequests.find(r => r.id === where.id);
        return Promise.resolve(request);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(request => {
        if (!request.id) {
          request.id = String(Date.now());
        }
        return Promise.resolve(request);
      }),
      merge: jest.fn().mockImplementation((request, dto) => ({ ...request, ...dto })),
      remove: jest.fn().mockResolvedValue(true),
    };

    mockRequestHistoryRepository = {
      find: jest.fn().mockImplementation(({ where }) => {
        const histories = mockRequestHistories.filter(h => h.requestId === where.requestId);
        return Promise.resolve(histories);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(history => {
        if (!history.id) {
          history.id = String(Date.now());
        }
        return Promise.resolve(history);
      }),
    };

    mockUsersService = {
      findById: jest.fn().mockImplementation(id => {
        if (id === 'user1') return Promise.resolve({ id: 'user1', fullName: 'テスト申請者1' });
        if (id === 'user2') return Promise.resolve({ id: 'user2', fullName: 'テスト承認者1' });
        if (id === 'user3') return Promise.resolve({ id: 'user3', fullName: 'テスト申請者2' });
        if (id === 'user4') return Promise.resolve({ id: 'user4', fullName: 'テスト承認者2' });
        return Promise.resolve(null);
      }),
    };

    mockNotificationsService = {
      create: jest.fn().mockResolvedValue({ id: 'notification1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowsService,
        {
          provide: getRepositoryToken(Request),
          useValue: mockRequestsRepository,
        },
        {
          provide: getRepositoryToken(RequestHistory),
          useValue: mockRequestHistoryRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
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

  describe('findAll', () => {
    it('should return an array of requests', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockRequests);
      expect(mockRequestsRepository.find).toHaveBeenCalledWith({
        relations: ['requester', 'approver'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findByRequester', () => {
    it('should return requests filtered by requester', async () => {
      const result = await service.findByRequester('user1');
      expect(result).toEqual([mockRequests[0]]);
      expect(mockRequestsRepository.find).toHaveBeenCalledWith({
        where: { requesterId: 'user1' },
        relations: ['requester', 'approver'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findByApprover', () => {
    it('should return requests filtered by approver', async () => {
      const result = await service.findByApprover('user2');
      expect(result).toEqual([mockRequests[0]]);
      expect(mockRequestsRepository.find).toHaveBeenCalledWith({
        where: { approverId: 'user2' },
        relations: ['requester', 'approver'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findPending', () => {
    it('should return pending requests', async () => {
      const result = await service.findPending();
      expect(result).toEqual([mockRequests[0]]);
      expect(mockRequestsRepository.find).toHaveBeenCalledWith({
        where: { status: '承認待ち' },
        relations: ['requester', 'approver'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a request by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockRequests[0]);
      expect(mockRequestsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['requester', 'approver'],
      });
    });

    it('should throw error if request not found', async () => {
      mockRequestsRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(
        '依頼ID 999 は見つかりませんでした',
      );
    });
  });

  describe('create', () => {
    it('should create a new request', async () => {
      const createRequestDto = {
        type: '評価申請',
        title: '新規評価申請',
        content: '新規評価申請の内容です',
        requesterId: 'user1',
        approverId: 'user2',
        relatedId: 'evaluation1',
      };

      const mockSavedRequest = {
        id: '3',
        ...createRequestDto,
        status: '承認待ち',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequestsRepository.save.mockResolvedValueOnce(mockSavedRequest);

      const result = await service.create(createRequestDto);

      expect(result).toEqual(mockSavedRequest);
      expect(mockRequestsRepository.create).toHaveBeenCalledWith({
        ...createRequestDto,
        status: '承認待ち',
      });
      expect(mockRequestsRepository.save).toHaveBeenCalled();
      expect(mockRequestHistoryRepository.create).toHaveBeenCalledWith({
        requestId: '3',
        status: '申請中',
        comment: '申請しました',
        actorId: 'user1',
      });
      expect(mockRequestHistoryRepository.save).toHaveBeenCalled();
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });
  });

  describe('approve', () => {
    it('should approve a request', async () => {
      const approveRequestDto = {
        comment: '承認します',
        actorId: 'user2',
      };

      const updatedRequest = {
        ...mockRequests[0],
        status: '承認済み',
        updatedAt: new Date(),
      };

      mockRequestsRepository.save.mockResolvedValueOnce(updatedRequest);

      const result = await service.approve('1', approveRequestDto);

      expect(result).toEqual(updatedRequest);
      expect(mockRequestsRepository.merge).toHaveBeenCalledWith(mockRequests[0], { status: '承認済み' });
      expect(mockRequestsRepository.save).toHaveBeenCalled();
      expect(mockRequestHistoryRepository.create).toHaveBeenCalledWith({
        requestId: '1',
        status: '承認済み',
        comment: '承認します',
        actorId: 'user2',
      });
      expect(mockRequestHistoryRepository.save).toHaveBeenCalled();
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });

    it('should throw error if request not found', async () => {
      mockRequestsRepository.findOne.mockResolvedValueOnce(null);
      
      const approveRequestDto = {
        comment: '承認します',
        actorId: 'user2',
      };

      await expect(service.approve('999', approveRequestDto)).rejects.toThrow(
        '依頼ID 999 は見つかりませんでした',
      );
    });
  });

  describe('reject', () => {
    it('should reject a request', async () => {
      const rejectRequestDto = {
        comment: '却下します',
        actorId: 'user2',
      };

      const updatedRequest = {
        ...mockRequests[0],
        status: '却下',
        updatedAt: new Date(),
      };

      mockRequestsRepository.save.mockResolvedValueOnce(updatedRequest);

      const result = await service.reject('1', rejectRequestDto);

      expect(result).toEqual(updatedRequest);
      expect(mockRequestsRepository.merge).toHaveBeenCalledWith(mockRequests[0], { status: '却下' });
      expect(mockRequestsRepository.save).toHaveBeenCalled();
      expect(mockRequestHistoryRepository.create).toHaveBeenCalledWith({
        requestId: '1',
        status: '却下',
        comment: '却下します',
        actorId: 'user2',
      });
      expect(mockRequestHistoryRepository.save).toHaveBeenCalled();
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });

    it('should throw error if request not found', async () => {
      mockRequestsRepository.findOne.mockResolvedValueOnce(null);
      
      const rejectRequestDto = {
        comment: '却下します',
        actorId: 'user2',
      };

      await expect(service.reject('999', rejectRequestDto)).rejects.toThrow(
        '依頼ID 999 は見つかりませんでした',
      );
    });
  });

  describe('getHistory', () => {
    it('should return history for a request', async () => {
      const result = await service.getHistory('2');
      
      expect(result).toEqual([mockRequestHistories[1], mockRequestHistories[2]]);
      expect(mockRequestHistoryRepository.find).toHaveBeenCalledWith({
        where: { requestId: '2' },
        relations: ['actor'],
        order: { createdAt: 'ASC' },
      });
    });
  });
});
