import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../../entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from '../../dto/projects/create-project.dto';
import { UpdateProjectDto } from '../../dto/projects/update-project.dto';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repo: Repository<Project>;

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

  const mockRepository = {
    find: jest.fn().mockResolvedValue([mockProject]),
    findOne: jest.fn().mockResolvedValue(mockProject),
    create: jest.fn().mockReturnValue(mockProject),
    save: jest.fn().mockResolvedValue(mockProject),
    delete: jest.fn().mockResolvedValue({ affected: 1, raw: {} }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repo = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockProject]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single project', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockProject);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('create', () => {
    it('should successfully create a project', async () => {
      const createProjectDto: CreateProjectDto = {
        name: 'テストプロジェクト',
        description: 'テスト用プロジェクトの説明',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        status: '進行中',
        budget: '10000000',
        department: 'テスト部署', // 必須項目を追加
      };
      
      const result = await service.create(createProjectDto);
      expect(result).toEqual(mockProject);
      expect(repo.create).toHaveBeenCalledWith(createProjectDto);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateProjectDto: UpdateProjectDto = {
        name: '更新テストプロジェクト',
        status: '完了',
      };
      
      const result = await service.update('1', updateProjectDto);
      expect(result).toEqual(mockProject);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repo.save).toHaveBeenCalled();
    });

    it('should return null if project not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      
      const updateProjectDto: UpdateProjectDto = {
        name: '更新テストプロジェクト',
      };
      
      const result = await service.update('999', updateProjectDto);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should return true when successfully deleted', async () => {
      const result = await service.remove('1');
      expect(result).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('1');
    });

    it('should return false when no project was deleted', async () => {
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
