import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../../src/modules/notifications/notifications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from '../../src/entities/notification.entity';
import { NotificationSetting } from '../../src/entities/notification-setting.entity';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let mockNotificationsRepository;
  let mockNotificationSettingsRepository;

  const mockNotifications = [
    {
      id: '1',
      userId: 'user1',
      title: 'テスト通知1',
      content: 'これはテスト通知1の内容です',
      type: '案件申請',
      relatedId: 'project1',
      isRead: false,
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15'),
      user: { id: 'user1', fullName: 'テストユーザー1' },
    },
    {
      id: '2',
      userId: 'user2',
      title: 'テスト通知2',
      content: 'これはテスト通知2の内容です',
      type: '契約更新',
      relatedId: 'contract1',
      isRead: true,
      createdAt: new Date('2025-02-10'),
      updatedAt: new Date('2025-02-11'),
      user: { id: 'user2', fullName: 'テストユーザー2' },
    },
  ];

  const mockNotificationSettings = [
    {
      id: '1',
      userId: 'user1',
      emailNotification: true,
      applicationNotification: true,
      contractNotification: true,
      evaluationNotification: true,
      workflowNotification: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { id: 'user1', fullName: 'テストユーザー1' },
    },
    {
      id: '2',
      userId: 'user2',
      emailNotification: false,
      applicationNotification: true,
      contractNotification: false,
      evaluationNotification: true,
      workflowNotification: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { id: 'user2', fullName: 'テストユーザー2' },
    },
  ];

  beforeEach(async () => {
    mockNotificationsRepository = {
      find: jest.fn().mockImplementation(({ where }) => {
        if (where && where.userId) {
          return Promise.resolve(mockNotifications.filter(n => n.userId === where.userId));
        }
        return Promise.resolve(mockNotifications);
      }),
      findOne: jest.fn().mockImplementation(({ where }) => {
        const notification = mockNotifications.find(n => n.id === where.id);
        return Promise.resolve(notification);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(notification => {
        if (!notification.id) {
          notification.id = String(Date.now());
        }
        return Promise.resolve(notification);
      }),
      merge: jest.fn().mockImplementation((notification, dto) => ({ ...notification, ...dto })),
      remove: jest.fn().mockResolvedValue(true),
    };

    mockNotificationSettingsRepository = {
      findOne: jest.fn().mockImplementation(({ where }) => {
        const setting = mockNotificationSettings.find(s => s.userId === where.userId);
        return Promise.resolve(setting);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(setting => {
        if (!setting.id) {
          setting.id = String(Date.now());
        }
        return Promise.resolve(setting);
      }),
      merge: jest.fn().mockImplementation((setting, dto) => ({ ...setting, ...dto })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationsRepository,
        },
        {
          provide: getRepositoryToken(NotificationSetting),
          useValue: mockNotificationSettingsRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of notifications', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockNotifications);
      expect(mockNotificationsRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findByUser', () => {
    it('should return notifications for a specific user', async () => {
      const result = await service.findByUser('user1');
      expect(result).toEqual([mockNotifications[0]]);
      expect(mockNotificationsRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a notification by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockNotifications[0]);
      expect(mockNotificationsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['user'],
      });
    });

    it('should throw error if notification not found', async () => {
      mockNotificationsRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(
        '通知ID 999 は見つかりませんでした',
      );
    });
  });

  describe('create', () => {
    it('should create a new notification', async () => {
      const createNotificationDto = {
        userId: 'user3',
        title: '新規通知',
        content: '新規通知の内容です',
        type: '評価登録',
        relatedId: 'evaluation1',
      };

      const result = await service.create(createNotificationDto);

      expect(result).toHaveProperty('id');
      expect(result.userId).toBe(createNotificationDto.userId);
      expect(result.title).toBe(createNotificationDto.title);
      expect(result.content).toBe(createNotificationDto.content);
      expect(result.type).toBe(createNotificationDto.type);
      expect(result.relatedId).toBe(createNotificationDto.relatedId);
      expect(result.isRead).toBe(false);

      expect(mockNotificationsRepository.create).toHaveBeenCalledWith({
        ...createNotificationDto,
        isRead: false,
      });
      expect(mockNotificationsRepository.save).toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const result = await service.markAsRead('1');

      expect(result.id).toBe('1');
      expect(result.isRead).toBe(true);
      expect(mockNotificationsRepository.merge).toHaveBeenCalledWith(mockNotifications[0], { isRead: true });
      expect(mockNotificationsRepository.save).toHaveBeenCalled();
    });

    it('should throw error if notification not found', async () => {
      mockNotificationsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.markAsRead('999')).rejects.toThrow(
        '通知ID 999 は見つかりませんでした',
      );
    });
  });

  describe('remove', () => {
    it('should remove a notification', async () => {
      await service.remove('1');
      expect(mockNotificationsRepository.remove).toHaveBeenCalled();
    });

    it('should throw error if notification not found', async () => {
      mockNotificationsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.remove('999')).rejects.toThrow(
        '通知ID 999 は見つかりませんでした',
      );
    });
  });

  describe('getUserSettings', () => {
    it('should return notification settings for a user', async () => {
      const result = await service.getUserSettings('user1');
      expect(result).toEqual(mockNotificationSettings[0]);
      expect(mockNotificationSettingsRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        relations: ['user'],
      });
    });

    it('should create default settings if not found', async () => {
      mockNotificationSettingsRepository.findOne.mockResolvedValueOnce(null);
      
      const defaultSettings = {
        userId: 'user3',
        emailNotification: true,
        applicationNotification: true,
        contractNotification: true,
        evaluationNotification: true,
        workflowNotification: true,
      };
      
      mockNotificationSettingsRepository.save.mockResolvedValueOnce({
        id: '3',
        ...defaultSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const result = await service.getUserSettings('user3');
      
      expect(result).toHaveProperty('id');
      expect(result.userId).toBe('user3');
      expect(mockNotificationSettingsRepository.create).toHaveBeenCalledWith(defaultSettings);
      expect(mockNotificationSettingsRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateUserSettings', () => {
    it('should update notification settings for a user', async () => {
      const updateSettingsDto = {
        emailNotification: false,
        applicationNotification: false,
      };

      const result = await service.updateUserSettings('user1', updateSettingsDto);

      expect(result.id).toBe('1');
      expect(result.emailNotification).toBe(false);
      expect(result.applicationNotification).toBe(false);
      expect(result.contractNotification).toBe(true);
      expect(mockNotificationSettingsRepository.merge).toHaveBeenCalled();
      expect(mockNotificationSettingsRepository.save).toHaveBeenCalled();
    });

    it('should create settings if not found', async () => {
      mockNotificationSettingsRepository.findOne.mockResolvedValueOnce(null);
      
      const updateSettingsDto = {
        emailNotification: false,
        applicationNotification: false,
      };
      
      const expectedSettings = {
        userId: 'user3',
        emailNotification: false,
        applicationNotification: false,
        contractNotification: true,
        evaluationNotification: true,
        workflowNotification: true,
      };
      
      mockNotificationSettingsRepository.save.mockResolvedValueOnce({
        id: '3',
        ...expectedSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const result = await service.updateUserSettings('user3', updateSettingsDto);
      
      expect(result).toHaveProperty('id');
      expect(result.userId).toBe('user3');
      expect(result.emailNotification).toBe(false);
      expect(result.applicationNotification).toBe(false);
      expect(mockNotificationSettingsRepository.create).toHaveBeenCalledWith(expectedSettings);
      expect(mockNotificationSettingsRepository.save).toHaveBeenCalled();
    });
  });
});
