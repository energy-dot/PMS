import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowsService } from '../../src/modules/workflows/workflows.service';
import { NotificationsService } from '../../src/modules/notifications/notifications.service';
import { UsersService } from '../../src/modules/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequestHistory } from '../../src/entities/request-history.entity';
import { Notification } from '../../src/entities/notification.entity';
import { User } from '../../src/entities/user.entity';
import { Project } from '../../src/entities/project.entity';
import { Repository } from 'typeorm';

describe('WorkflowNotification Integration', () => {
  let workflowsService: WorkflowsService;
  let notificationsService: NotificationsService;
  let usersService: UsersService;
  let mockRequestHistoryRepository: Partial<Repository<RequestHistory>>;
  let mockNotificationRepository: Partial<Repository<Notification>>;
  let mockUserRepository: Partial<Repository<User>>;
  let mockProjectRepository: Partial<Repository<Project>>;

  const mockUsers = [
    {
      id: 'user1',
      username: 'requester',
      fullName: 'テスト申請者',
      role: 'user',
      department: 'IT',
      email: 'requester@example.com',
    },
    {
      id: 'user2',
      username: 'approver',
      fullName: 'テスト承認者',
      role: 'manager',
      department: 'IT',
      email: 'approver@example.com',
    },
  ];

  const mockProjects = [
    {
      id: 'project1',
      name: 'テストプロジェクト',
      description: 'テストプロジェクトの説明',
      status: '進行中',
      approvalStatus: '未申請',
    }
  ];

  beforeEach(async () => {
    // モックリポジトリの設定
    mockRequestHistoryRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn().mockImplementation(dto => dto as RequestHistory),
      save: jest.fn().mockImplementation(requestHistory => {
        if (!(requestHistory as RequestHistory).id) {
          (requestHistory as RequestHistory).id = 'history1';
        }
        return Promise.resolve(requestHistory as RequestHistory);
      }),
      merge: jest.fn().mockImplementation((requestHistory, dto) => ({ ...requestHistory, ...dto } as RequestHistory)),
    };

    mockNotificationRepository = {
      create: jest.fn().mockImplementation(dto => dto as Notification),
      save: jest.fn().mockImplementation(notification => {
        if (!(notification as Notification).id) {
          (notification as Notification).id = 'notification1';
        }
        return Promise.resolve(notification as Notification);
      }),
      find: jest.fn(),
    };

    mockUserRepository = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        const user = mockUsers.find(u => u.id === where.id);
        return Promise.resolve(user as User);
      }),
    };

    mockProjectRepository = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        const project = mockProjects.find(p => p.id === where.id);
        return Promise.resolve(project as Project);
      }),
      save: jest.fn().mockImplementation(project => Promise.resolve(project as Project)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowsService,
        NotificationsService,
        UsersService,
        {
          provide: getRepositoryToken(RequestHistory),
          useValue: mockRequestHistoryRepository,
        },
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepository,
        },
      ],
    }).compile();

    workflowsService = module.get<WorkflowsService>(WorkflowsService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ワークフロー承認と通知の連携', () => {
    it('案件承認申請時に承認者に通知が送信されること', async () => {
      // スパイを設定
      const createApprovalNotificationSpy = jest.spyOn(notificationsService, 'createApprovalNotification');

      // 案件承認申請を実行
      await workflowsService.requestProjectApproval('project1', 'user1', '承認をお願いします');

      // 通知が作成されたことを検証
      expect(createApprovalNotificationSpy).toHaveBeenCalled();
      expect(mockProjectRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          approvalStatus: '承認待ち'
        })
      );
    });

    it('案件承認時に申請者に通知が送信されること', async () => {
      // モック依頼履歴データ
      const mockRequestHistory = {
        id: 'history1',
        projectId: 'project1',
        requesterId: 'user1',
        requestType: '案件承認申請',
        requestStatus: '承認待ち',
        requestDate: new Date(),
      };

      (mockRequestHistoryRepository.findOne as jest.Mock).mockResolvedValue(mockRequestHistory);

      // スパイを設定
      const createApprovalNotificationSpy = jest.spyOn(notificationsService, 'createApprovalNotification');

      // 案件承認を実行
      await workflowsService.approveProject('history1', 'user2', '承認します');

      // 通知が作成されたことを検証
      expect(createApprovalNotificationSpy).toHaveBeenCalled();
      expect(mockRequestHistoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          requestStatus: '承認済み',
          approverId: 'user2'
        })
      );
    });

    it('案件却下時に申請者に通知が送信されること', async () => {
      // モック依頼履歴データ
      const mockRequestHistory = {
        id: 'history1',
        projectId: 'project1',
        requesterId: 'user1',
        requestType: '案件承認申請',
        requestStatus: '承認待ち',
        requestDate: new Date(),
      };

      (mockRequestHistoryRepository.findOne as jest.Mock).mockResolvedValue(mockRequestHistory);

      // スパイを設定
      const createApprovalNotificationSpy = jest.spyOn(notificationsService, 'createApprovalNotification');

      // 案件却下を実行
      await workflowsService.rejectProject('history1', 'user2', '却下します');

      // 通知が作成されたことを検証
      expect(createApprovalNotificationSpy).toHaveBeenCalled();
      expect(mockRequestHistoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          requestStatus: '差戻し',
          approverId: 'user2',
          rejectionReason: '却下します'
        })
      );
    });

    it('システム通知が正しく作成されること', async () => {
      // システム通知を作成
      const notification = await notificationsService.createSystemNotification(
        'user1',
        'システム通知テスト',
        'これはシステム通知のテストです'
      );

      // 通知が正しく作成されたことを検証
      expect(mockNotificationRepository.create).toHaveBeenCalledWith({
        userId: 'user1',
        title: 'システム通知テスト',
        content: 'これはシステム通知のテストです',
        notificationType: 'system'
      });
      expect(mockNotificationRepository.save).toHaveBeenCalled();
    });
  });
});
