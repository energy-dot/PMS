import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Staff } from '../../entities/staff.entity';
import { Repository } from 'typeorm';
import { CreateStaffDto } from '../../dto/staff/create-staff.dto';
import { UpdateStaffDto } from '../../dto/staff/update-staff.dto';

describe('StaffService', () => {
  let service: StaffService;
  let repo: Repository<Staff>;

  const mockStaff = {
    id: '1',
    name: '山田 太郎',
    email: 'taro.yamada@example.com',
    phone: '090-1234-5678',
    status: '稼働中',
    skills: ['Java', 'Spring', 'SQL'],
    partner: { id: '1', name: 'テスト株式会社' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue([mockStaff]),
    findOne: jest.fn().mockResolvedValue(mockStaff),
    create: jest.fn().mockReturnValue(mockStaff),
    save: jest.fn().mockResolvedValue(mockStaff),
    delete: jest.fn().mockResolvedValue({ affected: 1, raw: {} }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: getRepositoryToken(Staff),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
    repo = module.get<Repository<Staff>>(getRepositoryToken(Staff));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of staff members with partner relations', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockStaff]);
      expect(repo.find).toHaveBeenCalledWith({ relations: ['partner'] });
    });
  });

  describe('findOne', () => {
    it('should return a single staff member with partner relation', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockStaff);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['partner'],
      });
    });
  });

  describe('create', () => {
    it('should successfully create a staff member', async () => {
      const createStaffDto: CreateStaffDto = {
        name: '山田 太郎',
        email: 'taro.yamada@example.com',
        phone: '090-1234-5678',
        status: '稼働中',
        skills: ['Java', 'Spring', 'SQL'],
        partner: { id: '1', name: 'テスト株式会社' } as any,
      };

      const result = await service.create(createStaffDto);
      expect(result).toEqual(mockStaff);
      expect(repo.create).toHaveBeenCalledWith(createStaffDto);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a staff member', async () => {
      const updateStaffDto: UpdateStaffDto = {
        status: '稼働中',
        skills: ['Java', 'Spring', 'SQL', 'AWS'],
      };

      const result = await service.update('1', updateStaffDto);
      expect(result).toEqual(mockStaff);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['partner'],
      });
      expect(repo.save).toHaveBeenCalled();
    });

    it('should return null if staff member not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

      const updateStaffDto: UpdateStaffDto = {
        status: '待機中',
      };

      const result = await service.update('999', updateStaffDto);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should return true when successfully deleted', async () => {
      const result = await service.remove('1');
      expect(result).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('1');
    });

    it('should return false when no staff member was deleted', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValueOnce({ affected: 0, raw: {} });

      const result = await service.remove('999');
      expect(result).toBe(false);
    });

    it('should handle null affected value', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValueOnce({ affected: null, raw: {} });

      const result = await service.remove('1');
      expect(result).toBe(false);
    });
  });
});
