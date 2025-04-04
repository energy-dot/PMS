import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateContractDto } from '../../dto/contracts/create-contract.dto';
import { UpdateContractDto } from '../../dto/contracts/update-contract.dto';

describe('ContractsController', () => {
  let controller: ContractsController;
  let service: ContractsService;

  const mockContract = {
    id: '1',
    staff: { id: '1', name: '山田 太郎' },
    project: { id: '1', name: 'テストプロジェクト' },
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    price: 800000,
    paymentTerms: '月額固定',
    status: '契約中',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockContractsService = {
    findAll: jest.fn().mockResolvedValue([mockContract]),
    findOne: jest.fn().mockResolvedValue(mockContract),
    create: jest.fn().mockResolvedValue(mockContract),
    update: jest.fn().mockResolvedValue(mockContract),
    remove: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [
        {
          provide: ContractsService,
          useValue: mockContractsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ContractsController>(ContractsController);
    service = module.get<ContractsService>(ContractsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of contracts', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockContract]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single contract', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockContract);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new contract', async () => {
      const createContractDto: CreateContractDto = {
        staff: { id: '1', name: '山田 太郎' } as any,
        project: { id: '1', name: 'テストプロジェクト' } as any,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        price: 800000,
        paymentTerms: '月額固定',
        status: '契約中',
      };
      
      const result = await controller.create(createContractDto);
      expect(result).toEqual(mockContract);
      expect(service.create).toHaveBeenCalledWith(createContractDto);
    });
  });

  describe('update', () => {
    it('should update a contract', async () => {
      const updateContractDto: UpdateContractDto = {
        price: 850000,
        status: '更新待ち',
      };
      
      const result = await controller.update('1', updateContractDto);
      expect(result).toEqual(mockContract);
      expect(service.update).toHaveBeenCalledWith('1', updateContractDto);
    });
  });

  describe('remove', () => {
    it('should remove a contract', async () => {
      const result = await controller.remove('1');
      expect(result).toBe(true);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
