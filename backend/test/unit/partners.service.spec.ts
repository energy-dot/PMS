import { Test, TestingModule } from '@nestjs/testing';
import { PartnersService } from '../../src/modules/partners/partners.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Partner } from '../../src/entities/partner.entity';

describe('PartnersService', () => {
  let service: PartnersService;
  let mockPartnersRepository;

  const mockPartners = [
    {
      id: '1',
      name: 'テストパートナー1',
      address: '東京都渋谷区1-1-1',
      phoneNumber: '03-1111-1111',
      email: 'partner1@example.com',
      contactPerson: '担当者1',
      contractType: '業務委託',
      notes: 'テスト備考1',
      createdAt: new Date(),
      updatedAt: new Date(),
      staff: [],
      projects: [],
    },
    {
      id: '2',
      name: 'テストパートナー2',
      address: '大阪府大阪市2-2-2',
      phoneNumber: '06-2222-2222',
      email: 'partner2@example.com',
      contactPerson: '担当者2',
      contractType: 'SES',
      notes: 'テスト備考2',
      createdAt: new Date(),
      updatedAt: new Date(),
      staff: [],
      projects: [],
    },
  ];

  beforeEach(async () => {
    mockPartnersRepository = {
      find: jest.fn().mockResolvedValue(mockPartners),
      findOne: jest.fn().mockImplementation(({ where }) => {
        const partner = mockPartners.find(p => p.id === where.id);
        return Promise.resolve(partner);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(partner => {
        if (!partner.id) {
          partner.id = String(Date.now());
        }
        return Promise.resolve(partner);
      }),
      merge: jest.fn().mockImplementation((partner, dto) => ({ ...partner, ...dto })),
      remove: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersService,
        {
          provide: getRepositoryToken(Partner),
          useValue: mockPartnersRepository,
        },
      ],
    }).compile();

    service = module.get<PartnersService>(PartnersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of partners', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockPartners);
      expect(mockPartnersRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a partner by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockPartners[0]);
      expect(mockPartnersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['staff', 'projects'],
      });
    });

    it('should throw error if partner not found', async () => {
      mockPartnersRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(
        'パートナーID 999 は見つかりませんでした',
      );
    });
  });

  describe('create', () => {
    it('should create a new partner', async () => {
      const createPartnerDto = {
        name: '新規パートナー',
        address: '東京都新宿区3-3-3',
        phoneNumber: '03-3333-3333',
        email: 'new@example.com',
        contactPerson: '新規担当者',
        contractType: '業務委託',
        notes: '新規備考',
      };

      const result = await service.create(createPartnerDto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe(createPartnerDto.name);
      expect(result.address).toBe(createPartnerDto.address);
      expect(result.phoneNumber).toBe(createPartnerDto.phoneNumber);
      expect(result.email).toBe(createPartnerDto.email);
      expect(result.contactPerson).toBe(createPartnerDto.contactPerson);
      expect(result.contractType).toBe(createPartnerDto.contractType);
      expect(result.notes).toBe(createPartnerDto.notes);

      expect(mockPartnersRepository.create).toHaveBeenCalledWith(createPartnerDto);
      expect(mockPartnersRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing partner', async () => {
      const updatePartnerDto = {
        name: '更新パートナー',
        email: 'updated@example.com',
      };

      const result = await service.update('1', updatePartnerDto);

      expect(result.id).toBe('1');
      expect(result.name).toBe('更新パートナー');
      expect(result.email).toBe('updated@example.com');
      expect(mockPartnersRepository.merge).toHaveBeenCalled();
      expect(mockPartnersRepository.save).toHaveBeenCalled();
    });

    it('should throw error if partner not found', async () => {
      mockPartnersRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.update('999', { name: 'テスト' })).rejects.toThrow(
        'パートナーID 999 は見つかりませんでした',
      );
    });
  });

  describe('remove', () => {
    it('should remove a partner', async () => {
      await service.remove('1');
      expect(mockPartnersRepository.remove).toHaveBeenCalled();
    });

    it('should throw error if partner not found', async () => {
      mockPartnersRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.remove('999')).rejects.toThrow(
        'パートナーID 999 は見つかりませんでした',
      );
    });
  });
});
