import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from '../../src/modules/staff/staff.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Staff } from '../../src/entities/staff.entity';

describe('StaffService', () => {
  let service: StaffService;
  let mockStaffRepository;

  const mockStaff = [
    {
      id: '1',
      fullName: 'テスト要員1',
      partnerId: 'partner1',
      skills: 'Java, Spring, SQL',
      experience: 5,
      monthlyRate: 800000,
      status: '稼働中',
      availability: '2025-06-01',
      notes: 'テスト備考1',
      createdAt: new Date(),
      updatedAt: new Date(),
      partner: { id: 'partner1', name: 'テストパートナー1' },
      contracts: [],
    },
    {
      id: '2',
      fullName: 'テスト要員2',
      partnerId: 'partner2',
      skills: 'JavaScript, React, Node.js',
      experience: 3,
      monthlyRate: 700000,
      status: '待機中',
      availability: '2025-04-15',
      notes: 'テスト備考2',
      createdAt: new Date(),
      updatedAt: new Date(),
      partner: { id: 'partner2', name: 'テストパートナー2' },
      contracts: [],
    },
  ];

  beforeEach(async () => {
    mockStaffRepository = {
      find: jest.fn().mockResolvedValue(mockStaff),
      findOne: jest.fn().mockImplementation(({ where }) => {
        const staff = mockStaff.find(s => s.id === where.id);
        return Promise.resolve(staff);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(staff => {
        if (!staff.id) {
          staff.id = String(Date.now());
        }
        return Promise.resolve(staff);
      }),
      merge: jest.fn().mockImplementation((staff, dto) => ({ ...staff, ...dto })),
      remove: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: getRepositoryToken(Staff),
          useValue: mockStaffRepository,
        },
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of staff', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockStaff);
      expect(mockStaffRepository.find).toHaveBeenCalledWith({
        relations: ['partner', 'contracts'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a staff by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockStaff[0]);
      expect(mockStaffRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['partner', 'contracts'],
      });
    });

    it('should throw error if staff not found', async () => {
      mockStaffRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(
        '要員ID 999 は見つかりませんでした',
      );
    });
  });

  describe('create', () => {
    it('should create a new staff', async () => {
      const createStaffDto = {
        fullName: '新規要員',
        partnerId: 'partner3',
        skills: 'Python, Django, AWS',
        experience: 4,
        monthlyRate: 750000,
        status: '待機中',
        availability: '2025-05-01',
        notes: '新規備考',
      };

      const result = await service.create(createStaffDto);

      expect(result).toHaveProperty('id');
      expect(result.fullName).toBe(createStaffDto.fullName);
      expect(result.partnerId).toBe(createStaffDto.partnerId);
      expect(result.skills).toBe(createStaffDto.skills);
      expect(result.experience).toBe(createStaffDto.experience);
      expect(result.monthlyRate).toBe(createStaffDto.monthlyRate);
      expect(result.status).toBe(createStaffDto.status);
      expect(result.availability).toBe(createStaffDto.availability);
      expect(result.notes).toBe(createStaffDto.notes);

      expect(mockStaffRepository.create).toHaveBeenCalledWith(createStaffDto);
      expect(mockStaffRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing staff', async () => {
      const updateStaffDto = {
        fullName: '更新要員',
        monthlyRate: 850000,
      };

      const result = await service.update('1', updateStaffDto);

      expect(result.id).toBe('1');
      expect(result.fullName).toBe('更新要員');
      expect(result.monthlyRate).toBe(850000);
      expect(mockStaffRepository.merge).toHaveBeenCalled();
      expect(mockStaffRepository.save).toHaveBeenCalled();
    });

    it('should throw error if staff not found', async () => {
      mockStaffRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.update('999', { fullName: 'テスト' })).rejects.toThrow(
        '要員ID 999 は見つかりませんでした',
      );
    });
  });

  describe('remove', () => {
    it('should remove a staff', async () => {
      await service.remove('1');
      expect(mockStaffRepository.remove).toHaveBeenCalled();
    });

    it('should throw error if staff not found', async () => {
      mockStaffRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.remove('999')).rejects.toThrow(
        '要員ID 999 は見つかりませんでした',
      );
    });
  });

  describe('search', () => {
    it('should search staff with name filter', async () => {
      const searchDto = { fullName: 'テスト要員1' };
      mockStaffRepository.find.mockResolvedValueOnce([mockStaff[0]]);
      
      const result = await service.search(searchDto);
      
      expect(result).toEqual([mockStaff[0]]);
      expect(mockStaffRepository.find).toHaveBeenCalled();
    });
    
    it('should search staff with skills filter', async () => {
      const searchDto = { skills: 'Java' };
      mockStaffRepository.find.mockResolvedValueOnce([mockStaff[0]]);
      
      const result = await service.search(searchDto);
      
      expect(result).toEqual([mockStaff[0]]);
      expect(mockStaffRepository.find).toHaveBeenCalled();
    });
    
    it('should search staff with partner filter', async () => {
      const searchDto = { partnerId: 'partner1' };
      mockStaffRepository.find.mockResolvedValueOnce([mockStaff[0]]);
      
      const result = await service.search(searchDto);
      
      expect(result).toEqual([mockStaff[0]]);
      expect(mockStaffRepository.find).toHaveBeenCalled();
    });
    
    it('should search staff with rate range filter', async () => {
      const searchDto = { rateMin: 700000, rateMax: 800000 };
      mockStaffRepository.find.mockResolvedValueOnce(mockStaff);
      
      const result = await service.search(searchDto);
      
      expect(result).toEqual(mockStaff);
      expect(mockStaffRepository.find).toHaveBeenCalled();
    });
    
    it('should search staff with availability filter', async () => {
      const searchDto = { availability: '待機中' };
      mockStaffRepository.find.mockResolvedValueOnce([mockStaff[1]]);
      
      const result = await service.search(searchDto);
      
      expect(result).toEqual([mockStaff[1]]);
      expect(mockStaffRepository.find).toHaveBeenCalled();
    });
  });
});
