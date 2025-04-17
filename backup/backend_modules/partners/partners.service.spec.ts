import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { PartnersService } from './partners.service';
import { Partner } from '../../entities/partner.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePartnerDto } from '../../dto/partners/create-partner.dto';

describe('PartnersService', () => {
  let service: PartnersService;
  let repository: Repository<Partner>;

  // Partnerエンティティに合わせてmockPartnerを拡張
  const mockPartner = {
    id: '1',
    name: 'テスト株式会社',
    address: '東京都渋谷区',
    phone: '03-1234-5678',
    email: 'test@example.com',
    status: '取引中',
    website: '',
    businessCategory: '',
    establishedYear: 2000,
    employeeCount: 100,
    annualRevenue: '',
    antisocialCheckCompleted: false,
    antisocialCheckDate: new Date(),
    creditCheckCompleted: false,
    creditCheckDate: new Date(),
    remarks: '',
    staff: [],
    antisocialChecks: [],
    baseContracts: [],
    contactPersons: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Partner;

  const mockRepository = {
    find: jest.fn().mockResolvedValue([mockPartner]),
    findOne: jest.fn().mockResolvedValue(mockPartner),
    create: jest.fn().mockReturnValue(mockPartner),
    save: jest.fn().mockResolvedValue(mockPartner),
    delete: jest.fn().mockResolvedValue({ affected: 1, raw: {} } as DeleteResult),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersService,
        {
          provide: getRepositoryToken(Partner),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PartnersService>(PartnersService);
    repository = module.get<Repository<Partner>>(getRepositoryToken(Partner));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of partners', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockPartner]);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return an empty array when no partners exist', async () => {
      mockRepository.find.mockResolvedValueOnce([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single partner', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockPartner);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null when partner does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      const result = await service.findOne('999');
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });

  describe('create', () => {
    it('should create a new partner', async () => {
      const createPartnerDto: CreatePartnerDto = {
        name: 'テスト株式会社',
        address: '東京都渋谷区',
        phone: '03-1234-5678',
        email: 'test@example.com',
      };

      const result = await service.create(createPartnerDto);
      expect(result).toEqual(mockPartner);
      expect(repository.create).toHaveBeenCalledWith(createPartnerDto);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw error when validation fails', async () => {
      const invalidDto: CreatePartnerDto = {
        name: '', // 空の名前
        address: '東京都渋谷区',
        phone: '03-1234-5678',
        email: 'invalid-email', // 無効なメールアドレス
      };

      mockRepository.save.mockRejectedValueOnce(new Error('バリデーションエラー'));
      await expect(service.create(invalidDto)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a partner', async () => {
      const updatePartnerDto = {
        name: '更新テスト株式会社',
      };

      const result = await service.update('1', updatePartnerDto);
      expect(result).toEqual(mockPartner);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.save).toHaveBeenCalled();
    });

    it('should return null when partner to update does not exist', async () => {
      const updatePartnerDto = {
        name: '更新テスト株式会社',
      };

      // findOneがnullを返すようにモック
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const result = await service.update('999', updatePartnerDto);
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });

  describe('remove', () => {
    it('should remove a partner', async () => {
      const result = await service.remove('1');
      expect(result).toBe(true);
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should return false when delete operation affects no rows', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValueOnce({ affected: 0, raw: {} } as DeleteResult);

      const result = await service.remove('1');
      expect(result).toBe(false);
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should handle null affected value', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValueOnce({ affected: null, raw: {} } as any);

      const result = await service.remove('1');
      expect(result).toBe(false);
      expect(repository.delete).toHaveBeenCalledWith('1');
    });
  });
});
