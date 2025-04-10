import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from '../../src/modules/projects/projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../../src/entities/project.entity';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockProjectsRepository;

  const mockProjects = [
    {
      id: '1',
      name: 'テストプロジェクト1',
      description: 'テスト案件の説明1',
      status: '進行中',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      budget: 10000000,
      departmentId: 'dept1',
      createdAt: new Date(),
      updatedAt: new Date(),
      contracts: [],
      applications: [],
    },
    {
      id: '2',
      name: 'テストプロジェクト2',
      description: 'テスト案件の説明2',
      status: '計画中',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-09-30'),
      budget: 5000000,
      departmentId: 'dept2',
      createdAt: new Date(),
      updatedAt: new Date(),
      contracts: [],
      applications: [],
    },
  ];

  beforeEach(async () => {
    mockProjectsRepository = {
      find: jest.fn().mockResolvedValue(mockProjects),
      findOne: jest.fn().mockImplementation(({ where }) => {
        const project = mockProjects.find(p => p.id === where.id);
        return Promise.resolve(project);
      }),
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(project => {
        if (!project.id) {
          project.id = String(Date.now());
        }
        return Promise.resolve(project);
      }),
      merge: jest.fn().mockImplementation((project, dto) => ({ ...project, ...dto })),
      remove: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectsRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockProjects);
      expect(mockProjectsRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockProjects[0]);
      expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['contracts', 'applications'],
      });
    });

    it('should throw error if project not found', async () => {
      mockProjectsRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(
        '案件ID 999 は見つかりませんでした',
      );
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createProjectDto = {
        name: '新規プロジェクト',
        description: '新規案件の説明',
        status: '計画中',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-10-31'),
        budget: 8000000,
        departmentId: 'dept3',
      };

      const result = await service.create(createProjectDto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe(createProjectDto.name);
      expect(result.description).toBe(createProjectDto.description);
      expect(result.status).toBe(createProjectDto.status);
      expect(result.startDate).toEqual(createProjectDto.startDate);
      expect(result.endDate).toEqual(createProjectDto.endDate);
      expect(result.budget).toBe(createProjectDto.budget);
      expect(result.departmentId).toBe(createProjectDto.departmentId);

      expect(mockProjectsRepository.create).toHaveBeenCalledWith(createProjectDto);
      expect(mockProjectsRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing project', async () => {
      const updateProjectDto = {
        name: '更新プロジェクト',
        budget: 12000000,
      };

      const result = await service.update('1', updateProjectDto);

      expect(result.id).toBe('1');
      expect(result.name).toBe('更新プロジェクト');
      expect(result.budget).toBe(12000000);
      expect(mockProjectsRepository.merge).toHaveBeenCalled();
      expect(mockProjectsRepository.save).toHaveBeenCalled();
    });

    it('should throw error if project not found', async () => {
      mockProjectsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.update('999', { name: 'テスト' })).rejects.toThrow(
        '案件ID 999 は見つかりませんでした',
      );
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      await service.remove('1');
      expect(mockProjectsRepository.remove).toHaveBeenCalled();
    });

    it('should throw error if project not found', async () => {
      mockProjectsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.remove('999')).rejects.toThrow(
        '案件ID 999 は見つかりませんでした',
      );
    });
  });

  describe('findByDepartment', () => {
    it('should return projects filtered by department', async () => {
      mockProjectsRepository.find.mockResolvedValueOnce([mockProjects[0]]);
      
      const result = await service.findByDepartment('dept1');
      
      expect(result).toEqual([mockProjects[0]]);
      expect(mockProjectsRepository.find).toHaveBeenCalledWith({
        where: { departmentId: 'dept1' },
        relations: ['contracts', 'applications'],
      });
    });
  });

  describe('findByStatus', () => {
    it('should return projects filtered by status', async () => {
      mockProjectsRepository.find.mockResolvedValueOnce([mockProjects[0]]);
      
      const result = await service.findByStatus('進行中');
      
      expect(result).toEqual([mockProjects[0]]);
      expect(mockProjectsRepository.find).toHaveBeenCalledWith({
        where: { status: '進行中' },
        relations: ['contracts', 'applications'],
      });
    });
  });
});
