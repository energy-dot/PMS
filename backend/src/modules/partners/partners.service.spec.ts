import { Test, TestingModule } from '@nestjs/testing';
import { PartnersService } from './partners.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Partner } from '../../entities/partner.entity';
import { Repository } from 'typeorm';
import { CreatePartnerDto } from '../../dto/partners/create-partner.dto';
import { UpdatePartnerDto } from '../../dto/partners/update-partner.dto';

describe('PartnersService', () => {
  let service: PartnersService;
  let repo: Repository<Partner>;

  const mockPartner = {
    id: '1',
    name: 'テスト株式会社',
    address: '東京都渋谷区',
    phone: '03-1234-5678',
    email: 'test@example.com',
    status: '取引中',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue([mockPartner]),
    findOne: jest.fn().mockResolvedValue(mockPartner),
    create: jest.fn().mockReturnValue(mockPartner),
    save: jest.fn().mockResolvedValue(mockPartner),
    delete: jest.fn().mockResolvedValue({ affected: 1, raw: {} }),
  };

  beforeEach(async () => {
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
    repo = module.get<Repository<Partner>>(getRepositoryToken(Partner));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of partners', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockPartner]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single partner', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockPartner);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('create', () => {
    it('should successfully create a partner', async () => {
      const createPartnerDto: CreatePartnerDto = {
        name: 'テスト株式会社',
        address: '東京都渋谷区',
        phone: '03-1234-5678',
        email: 'test@example.com',
      };
      
      const result = await service.create(createPartnerDto);
      expect(result).toEqual(mockPartner);
      expect(repo.create).toHaveBeenCalledWith(createPartnerDto);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a partner', async () => {
      const updatePartnerDto: UpdatePartnerDto = {
        name: '更新テスト株式会社',
      };
      
      const result = await service.update('1', updatePartnerDto);
      expect(result).toEqual(mockPartner);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repo.save).toHaveBeenCalled();
    });

    it('should return null if partner not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      
      const updatePartnerDto: UpdatePartnerDto = {
        name: '更新テスト株式会社',
      };
      
      const result = await service.update('999', updatePartnerDto);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should return true when successfully deleted', async () => {
      const result = await service.remove('1');
      expect(result).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('1');
    });

    it('should return false when no partner was deleted', async () => {
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
