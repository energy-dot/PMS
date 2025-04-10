import { Test, TestingModule } from '@nestjs/testing';
import { ContractsService } from '../../src/modules/contracts/contracts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contract } from '../../src/entities/contract.entity';

describe('ContractsService', () => {
  let service: ContractsService;
  let mockContractsRepository;

  const mockContracts = [
    {
      id: '1',
      projectId: 'project1',
      staffId: 'staff1',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      monthlyRate: 800000,
      manMonth: 12,
      type: '業務委託',
      status: '有効',
      notes: 'テスト備考1',
      createdAt: new Date(),
      updatedAt: new Date(),
      project: { id: 'project1', name: 'テストプロジェクト1' },
      staff: { id: 'staff1', fullName: 'テスト要員1' },
    },
    {
      id: '2',
      projectId: 'project2',
      staffId: 'staff2',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-09-30'),
      monthlyRate: 750000,
      manMonth: 6,
      type: 'SES',
      status: '有効',
      notes: 'テスト備考2',
      createdAt: new Date(),
      updatedAt: new Date(),
      project: { id: 'project2', name: 'テストプロジェクト2' },
      staff: { id: 'staff2', fullName: 'テスト要員2' },
    },
  ];

  beforeEach(async () => {
    mockContractsRepository = {
      find: jest.fn().mockResolvedValue(mockContracts),
      findOne: jest.fn().mockImplementation(({ where }) => {
        const contract = mockContracts.find(c => c.id === where.id);
        return Promise.resolve(contract);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(contract => {
        if (!contract.id) {
          contract.id = String(Date.now());
        }
        return Promise.resolve(contract);
      }),
      merge: jest.fn().mockImplementation((contract, dto) => ({ ...contract, ...dto })),
      remove: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractsService,
        {
          provide: getRepositoryToken(Contract),
          useValue: mockContractsRepository,
        },
      ],
    }).compile();

    service = module.get<ContractsService>(ContractsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of contracts', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockContracts);
      expect(mockContractsRepository.find).toHaveBeenCalledWith({
        relations: ['project', 'staff'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a contract by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockContracts[0]);
      expect(mockContractsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['project', 'staff'],
      });
    });

    it('should throw error if contract not found', async () => {
      mockContractsRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(
        '契約ID 999 は見つかりませんでした',
      );
    });
  });

  describe('create', () => {
    it('should create a new contract', async () => {
      const createContractDto = {
        projectId: 'project3',
        staffId: 'staff3',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-10-31'),
        monthlyRate: 820000,
        manMonth: 6,
        type: '業務委託',
        status: '有効',
        notes: '新規備考',
      };

      const result = await service.create(createContractDto);

      expect(result).toHaveProperty('id');
      expect(result.projectId).toBe(createContractDto.projectId);
      expect(result.staffId).toBe(createContractDto.staffId);
      expect(result.startDate).toEqual(createContractDto.startDate);
      expect(result.endDate).toEqual(createContractDto.endDate);
      expect(result.monthlyRate).toBe(createContractDto.monthlyRate);
      expect(result.manMonth).toBe(createContractDto.manMonth);
      expect(result.type).toBe(createContractDto.type);
      expect(result.status).toBe(createContractDto.status);
      expect(result.notes).toBe(createContractDto.notes);

      expect(mockContractsRepository.create).toHaveBeenCalledWith(createContractDto);
      expect(mockContractsRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing contract', async () => {
      const updateContractDto = {
        monthlyRate: 850000,
        notes: '更新備考',
      };

      const result = await service.update('1', updateContractDto);

      expect(result.id).toBe('1');
      expect(result.monthlyRate).toBe(850000);
      expect(result.notes).toBe('更新備考');
      expect(mockContractsRepository.merge).toHaveBeenCalled();
      expect(mockContractsRepository.save).toHaveBeenCalled();
    });

    it('should throw error if contract not found', async () => {
      mockContractsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.update('999', { notes: 'テスト' })).rejects.toThrow(
        '契約ID 999 は見つかりませんでした',
      );
    });
  });

  describe('remove', () => {
    it('should remove a contract', async () => {
      await service.remove('1');
      expect(mockContractsRepository.remove).toHaveBeenCalled();
    });

    it('should throw error if contract not found', async () => {
      mockContractsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.remove('999')).rejects.toThrow(
        '契約ID 999 は見つかりませんでした',
      );
    });
  });

  describe('findByProject', () => {
    it('should return contracts filtered by project', async () => {
      mockContractsRepository.find.mockResolvedValueOnce([mockContracts[0]]);
      
      const result = await service.findByProject('project1');
      
      expect(result).toEqual([mockContracts[0]]);
      expect(mockContractsRepository.find).toHaveBeenCalledWith({
        where: { projectId: 'project1' },
        relations: ['project', 'staff'],
      });
    });
  });

  describe('findByStaff', () => {
    it('should return contracts filtered by staff', async () => {
      mockContractsRepository.find.mockResolvedValueOnce([mockContracts[0]]);
      
      const result = await service.findByStaff('staff1');
      
      expect(result).toEqual([mockContracts[0]]);
      expect(mockContractsRepository.find).toHaveBeenCalledWith({
        where: { staffId: 'staff1' },
        relations: ['project', 'staff'],
      });
    });
  });

  describe('findActiveContracts', () => {
    it('should return active contracts', async () => {
      mockContractsRepository.find.mockResolvedValueOnce(mockContracts);
      
      const result = await service.findActiveContracts();
      
      expect(result).toEqual(mockContracts);
      expect(mockContractsRepository.find).toHaveBeenCalledWith({
        where: { status: '有効' },
        relations: ['project', 'staff'],
      });
    });
  });
});
