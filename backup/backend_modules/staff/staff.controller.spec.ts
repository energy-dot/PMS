import { Test, TestingModule } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateStaffDto } from '../../dto/staff/create-staff.dto';
import { UpdateStaffDto } from '../../dto/staff/update-staff.dto';

describe('StaffController', () => {
  let controller: StaffController;
  let service: StaffService;

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

  const mockStaffService = {
    findAll: jest.fn().mockResolvedValue([mockStaff]),
    findOne: jest.fn().mockResolvedValue(mockStaff),
    create: jest.fn().mockResolvedValue(mockStaff),
    update: jest.fn().mockResolvedValue(mockStaff),
    remove: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        {
          provide: StaffService,
          useValue: mockStaffService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<StaffController>(StaffController);
    service = module.get<StaffService>(StaffService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of staff members', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockStaff]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single staff member', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockStaff);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new staff member', async () => {
      const createStaffDto: CreateStaffDto = {
        name: '山田 太郎',
        email: 'taro.yamada@example.com',
        phone: '090-1234-5678',
        status: '稼働中',
        skills: ['Java', 'Spring', 'SQL'],
        partner: { id: '1', name: 'テスト株式会社' } as any,
      };

      const result = await controller.create(createStaffDto);
      expect(result).toEqual(mockStaff);
      expect(service.create).toHaveBeenCalledWith(createStaffDto);
    });
  });

  describe('update', () => {
    it('should update a staff member', async () => {
      const updateStaffDto: UpdateStaffDto = {
        status: '待機中',
        skills: ['Java', 'Spring', 'SQL', 'AWS'],
      };

      const result = await controller.update('1', updateStaffDto);
      expect(result).toEqual(mockStaff);
      expect(service.update).toHaveBeenCalledWith('1', updateStaffDto);
    });
  });

  describe('remove', () => {
    it('should remove a staff member', async () => {
      const result = await controller.remove('1');
      expect(result).toBe(true);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
