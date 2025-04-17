import { Test, TestingModule } from '@nestjs/testing';
import { ContractsService } from './contracts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contract } from '../../entities/contract.entity';
import { Repository } from 'typeorm';
import { CreateContractDto } from '../../dto/contracts/create-contract.dto';
import { UpdateContractDto } from '../../dto/contracts/update-contract.dto';

describe('ContractsService', () => {
  let service: ContractsService;
  let repo: Repository<Contract>;

  const mockContract = {
    id: '1',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    price: 800000,
    paymentTerms: '月額固定',
    status: '契約中',
    staff: { id: '1', name: '山田太郎' },
    project: { id: '1', name: 'テストプロジェクト' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue([mockContract]),
    findOne: jest.fn().mockResolvedValue(mockContract),
    create: jest.fn().mockReturnValue(mockContract),
    save: jest.fn().mockResolvedValue(mockContract),
    delete: jest.fn().mockResolvedValue({ affected: 1, raw: {} }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractsService,
        {
          provide: getRepositoryToken(Contract),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContractsService>(ContractsService);
    repo = module.get<Repository<Contract>>(getRepositoryToken(Contract));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of contracts with relations', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockContract]);
      expect(repo.find).toHaveBeenCalledWith({
        relations: ['staff', 'project'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single contract with relations', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockContract);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['staff', 'project'],
      });
    });
  });

  describe('create', () => {
    it('should successfully create a contract', async () => {
      const createContractDto: CreateContractDto = {
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        price: 800000,
        paymentTerms: '月額固定',
        status: '契約中',
        staff: { id: '1' } as any,
        project: { id: '1' } as any,
      };

      const result = await service.create(createContractDto);
      expect(result).toEqual(mockContract);
      expect(repo.create).toHaveBeenCalledWith(createContractDto);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a contract', async () => {
      const updateContractDto: UpdateContractDto = {
        price: 850000,
        status: '更新待ち',
      };

      const result = await service.update('1', updateContractDto);
      expect(result).toEqual(mockContract);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['staff', 'project'],
      });
      expect(repo.save).toHaveBeenCalled();
    });

    it('should return null if contract not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

      const updateContractDto: UpdateContractDto = {
        price: 850000,
      };

      const result = await service.update('999', updateContractDto);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should return true when successfully deleted', async () => {
      const result = await service.remove('1');
      expect(result).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('1');
    });

    it('should return false when no contract was deleted', async () => {
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
