import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../../src/modules/reports/reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../../src/entities/project.entity';
import { Staff } from '../../src/entities/staff.entity';
import { Contract } from '../../src/entities/contract.entity';
import { Partner } from '../../src/entities/partner.entity';
import { Evaluation } from '../../src/entities/evaluation.entity';

describe('ReportsService', () => {
  let service: ReportsService;
  let mockProjectRepository;
  let mockStaffRepository;
  let mockContractRepository;
  let mockPartnerRepository;
  let mockEvaluationRepository;

  beforeEach(async () => {
    mockProjectRepository = {
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { month: '2025-01', count: 5, totalBudget: 50000000 },
          { month: '2025-02', count: 3, totalBudget: 30000000 },
        ]),
      }),
    };

    mockStaffRepository = {
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { partnerId: 'partner1', partnerName: 'テストパートナー1', count: 10 },
          { partnerId: 'partner2', partnerName: 'テストパートナー2', count: 5 },
        ]),
      }),
    };

    mockContractRepository = {
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { month: '2025-01', count: 8, totalRate: 6000000 },
          { month: '2025-02', count: 10, totalRate: 7500000 },
        ]),
      }),
    };

    mockPartnerRepository = {
      find: jest.fn(),
    };

    mockEvaluationRepository = {
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { rating: 5, count: 10 },
          { rating: 4, count: 15 },
          { rating: 3, count: 8 },
          { rating: 2, count: 3 },
          { rating: 1, count: 1 },
        ]),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepository,
        },
        {
          provide: getRepositoryToken(Staff),
          useValue: mockStaffRepository,
        },
        {
          provide: getRepositoryToken(Contract),
          useValue: mockContractRepository,
        },
        {
          provide: getRepositoryToken(Partner),
          useValue: mockPartnerRepository,
        },
        {
          provide: getRepositoryToken(Evaluation),
          useValue: mockEvaluationRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProjectTrends', () => {
    it('should return project trends data', async () => {
      const result = await service.getProjectTrends();
      
      expect(result).toEqual([
        { month: '2025-01', count: 5, totalBudget: 50000000 },
        { month: '2025-02', count: 3, totalBudget: 30000000 },
      ]);
      
      expect(mockProjectRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getStaffByPartner', () => {
    it('should return staff count by partner', async () => {
      const result = await service.getStaffByPartner();
      
      expect(result).toEqual([
        { partnerId: 'partner1', partnerName: 'テストパートナー1', count: 10 },
        { partnerId: 'partner2', partnerName: 'テストパートナー2', count: 5 },
      ]);
      
      expect(mockStaffRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getContractTrends', () => {
    it('should return contract trends data', async () => {
      const result = await service.getContractTrends();
      
      expect(result).toEqual([
        { month: '2025-01', count: 8, totalRate: 6000000 },
        { month: '2025-02', count: 10, totalRate: 7500000 },
      ]);
      
      expect(mockContractRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getActiveContractsByDepartment', () => {
    it('should return active contracts by department', async () => {
      mockContractRepository.createQueryBuilder().getRawMany.mockResolvedValueOnce([
        { departmentId: 'dept1', departmentName: '営業部', count: 12 },
        { departmentId: 'dept2', departmentName: '開発部', count: 20 },
      ]);
      
      const result = await service.getActiveContractsByDepartment();
      
      expect(result).toEqual([
        { departmentId: 'dept1', departmentName: '営業部', count: 12 },
        { departmentId: 'dept2', departmentName: '開発部', count: 20 },
      ]);
      
      expect(mockContractRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getEvaluationDistribution', () => {
    it('should return evaluation rating distribution', async () => {
      const result = await service.getEvaluationDistribution();
      
      expect(result).toEqual([
        { rating: 5, count: 10 },
        { rating: 4, count: 15 },
        { rating: 3, count: 8 },
        { rating: 2, count: 3 },
        { rating: 1, count: 1 },
      ]);
      
      expect(mockEvaluationRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getTopRatedStaff', () => {
    it('should return top rated staff', async () => {
      mockEvaluationRepository.createQueryBuilder().getRawMany.mockResolvedValueOnce([
        { staffId: 'staff1', staffName: 'テスト要員1', avgRating: 4.8 },
        { staffId: 'staff2', staffName: 'テスト要員2', avgRating: 4.5 },
        { staffId: 'staff3', staffName: 'テスト要員3', avgRating: 4.3 },
      ]);
      
      const result = await service.getTopRatedStaff(3);
      
      expect(result).toEqual([
        { staffId: 'staff1', staffName: 'テスト要員1', avgRating: 4.8 },
        { staffId: 'staff2', staffName: 'テスト要員2', avgRating: 4.5 },
        { staffId: 'staff3', staffName: 'テスト要員3', avgRating: 4.3 },
      ]);
      
      expect(mockEvaluationRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getProjectStatusSummary', () => {
    it('should return project status summary', async () => {
      mockProjectRepository.createQueryBuilder().getRawMany.mockResolvedValueOnce([
        { status: '進行中', count: 15 },
        { status: '計画中', count: 8 },
        { status: '完了', count: 12 },
        { status: '中止', count: 2 },
      ]);
      
      const result = await service.getProjectStatusSummary();
      
      expect(result).toEqual([
        { status: '進行中', count: 15 },
        { status: '計画中', count: 8 },
        { status: '完了', count: 12 },
        { status: '中止', count: 2 },
      ]);
      
      expect(mockProjectRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getStaffAvailabilitySummary', () => {
    it('should return staff availability summary', async () => {
      mockStaffRepository.createQueryBuilder().getRawMany.mockResolvedValueOnce([
        { status: '稼働中', count: 25 },
        { status: '待機中', count: 10 },
        { status: '研修中', count: 5 },
      ]);
      
      const result = await service.getStaffAvailabilitySummary();
      
      expect(result).toEqual([
        { status: '稼働中', count: 25 },
        { status: '待機中', count: 10 },
        { status: '研修中', count: 5 },
      ]);
      
      expect(mockStaffRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getDashboardSummary', () => {
    it('should return dashboard summary data', async () => {
      mockProjectRepository.find.mockResolvedValueOnce([{}, {}, {}]);
      mockStaffRepository.find.mockResolvedValueOnce([{}, {}, {}, {}]);
      mockContractRepository.find.mockResolvedValueOnce([{}, {}]);
      mockPartnerRepository.find.mockResolvedValueOnce([{}]);
      
      const result = await service.getDashboardSummary();
      
      expect(result).toEqual({
        totalProjects: 3,
        totalStaff: 4,
        totalContracts: 2,
        totalPartners: 1,
      });
      
      expect(mockProjectRepository.find).toHaveBeenCalled();
      expect(mockStaffRepository.find).toHaveBeenCalled();
      expect(mockContractRepository.find).toHaveBeenCalled();
      expect(mockPartnerRepository.find).toHaveBeenCalled();
    });
  });
});
