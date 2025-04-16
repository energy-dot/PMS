import { Test, TestingModule } from '@nestjs/testing';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePartnerDto } from '../../dto/partners/create-partner.dto';
import { UpdatePartnerDto } from '../../dto/partners/update-partner.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PartnersController', () => {
  let controller: PartnersController;
  let service: PartnersService;

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

  const mockPartnersService = {
    findAll: jest.fn().mockResolvedValue([mockPartner]),
    findOne: jest.fn().mockResolvedValue(mockPartner),
    create: jest.fn().mockResolvedValue(mockPartner),
    update: jest.fn().mockResolvedValue(mockPartner),
    remove: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnersController],
      providers: [
        {
          provide: PartnersService,
          useValue: mockPartnersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PartnersController>(PartnersController);
    service = module.get<PartnersService>(PartnersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of partners', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockPartner]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an empty array when no partners exist', async () => {
      mockPartnersService.findAll.mockResolvedValueOnce([]);
      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single partner', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockPartner);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when partner does not exist', async () => {
      mockPartnersService.findOne.mockResolvedValueOnce(null);
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('999');
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

      const result = await controller.create(createPartnerDto);
      expect(result).toEqual(mockPartner);
      expect(service.create).toHaveBeenCalledWith(createPartnerDto);
    });

    it('should throw BadRequestException when validation fails', async () => {
      const invalidDto = {
        // nameが欠けている
        address: '東京都渋谷区',
        phone: '03-1234-5678',
        email: 'invalid-email', // 無効なメールアドレス
      } as CreatePartnerDto;

      mockPartnersService.create.mockRejectedValueOnce(
        new BadRequestException('バリデーションエラー'),
      );
      await expect(controller.create(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a partner', async () => {
      const updatePartnerDto: UpdatePartnerDto = {
        name: '更新テスト株式会社',
      };

      const result = await controller.update('1', updatePartnerDto);
      expect(result).toEqual(mockPartner);
      expect(service.update).toHaveBeenCalledWith('1', updatePartnerDto);
    });

    it('should throw NotFoundException when partner to update does not exist', async () => {
      const updatePartnerDto: UpdatePartnerDto = {
        name: '更新テスト株式会社',
      };

      mockPartnersService.update.mockRejectedValueOnce(new NotFoundException());
      await expect(controller.update('999', updatePartnerDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a partner', async () => {
      const result = await controller.remove('1');
      expect(result).toBe(true);
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when partner to remove does not exist', async () => {
      mockPartnersService.remove.mockRejectedValueOnce(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
