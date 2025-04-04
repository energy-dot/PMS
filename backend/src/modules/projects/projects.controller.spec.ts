import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from '../../dto/projects/create-project.dto';
import { UpdateProjectDto } from '../../dto/projects/update-project.dto';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  const mockProject = {
    id: '1',
    name: 'テストプロジェクト',
    description: 'テスト用プロジェクトの説明',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    status: '進行中',
    budget: '10000000',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProjectsService = {
    findAll: jest.fn().mockResolvedValue([mockProject]),
    findOne: jest.fn().mockResolvedValue(mockProject),
    create: jest.fn().mockResolvedValue(mockProject),
    update: jest.fn().mockResolvedValue(mockProject),
    remove: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockProject]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single project', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockProject);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createProjectDto: CreateProjectDto = {
        name: 'テストプロジェクト',
        department: '開発部',
        description: 'テスト用プロジェクトの説明',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        status: '進行中',
        budget: '10000000',
      };
      
      const result = await controller.create(createProjectDto);
      expect(result).toEqual(mockProject);
      expect(service.create).toHaveBeenCalledWith(createProjectDto);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateProjectDto: UpdateProjectDto = {
        name: '更新テストプロジェクト',
        status: '完了',
      };
      
      const result = await controller.update('1', updateProjectDto);
      expect(result).toEqual(mockProject);
      expect(service.update).toHaveBeenCalledWith('1', updateProjectDto);
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      const result = await controller.remove('1');
      expect(result).toBe(true);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
