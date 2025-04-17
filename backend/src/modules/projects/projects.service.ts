import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { CreateProjectDto } from '../../dto/projects/create-project.dto';
import { UpdateProjectDto } from '../../dto/projects/update-project.dto';
import { SearchProjectsDto } from '../../dto/projects/search-projects.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['department', 'section'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Project | null> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['department', 'section'],
    });
    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = new Project();
    project.id = uuidv4();

    // 基本情報
    project.name = createProjectDto.name;
    project.description = createProjectDto.description || '';
    project.startDate = createProjectDto.startDate;
    project.endDate = createProjectDto.endDate;
    project.status = createProjectDto.status || '承認待ち';

    // 部署・セクション情報 - 必須フィールドに変更
    project.departmentId = createProjectDto.departmentId;
    project.sectionId = createProjectDto.sectionId;

    // 予算・人員情報
    project.budget = createProjectDto.budget || '';
    project.requiredHeadcount = createProjectDto.requiredHeadcount || 1;
    project.currentHeadcount = createProjectDto.currentHeadcount || 0;

    // スキル要件
    project.requiredSkills = createProjectDto.requiredSkills || '';

    // 契約情報
    project.contractType = createProjectDto.contractType || '';
    project.rateMin = createProjectDto.rateMin || 0;
    project.rateMax = createProjectDto.rateMax || 0;

    // 承認情報
    project.isApproved = false;
    project.approvedBy = '';
    project.approvedAt = new Date(0); // 1970-01-01, エポックタイム

    // 要員割り当て情報の初期化
    project.assignedStaffs = [];

    return this.projectsRepository.save(project);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    if (!project) {
      throw new Error('案件が見つかりません');
    }

    // 基本情報
    if (updateProjectDto.name !== undefined) {
      project.name = updateProjectDto.name;
    }

    if (updateProjectDto.description !== undefined) {
      project.description = updateProjectDto.description;
    }

    if (updateProjectDto.startDate !== undefined) {
      project.startDate = updateProjectDto.startDate;
    }

    if (updateProjectDto.endDate !== undefined) {
      project.endDate = updateProjectDto.endDate;
    }

    if (updateProjectDto.status !== undefined) {
      project.status = updateProjectDto.status;
    }

    // 部署・セクション情報
    if (updateProjectDto.departmentId !== undefined) {
      project.departmentId = updateProjectDto.departmentId;
    }

    if (updateProjectDto.sectionId !== undefined) {
      project.sectionId = updateProjectDto.sectionId;
    }

    // 予算・人員情報
    if (updateProjectDto.budget !== undefined) {
      project.budget = updateProjectDto.budget;
    }

    if (updateProjectDto.requiredHeadcount !== undefined) {
      project.requiredHeadcount = updateProjectDto.requiredHeadcount;
    }

    if (updateProjectDto.currentHeadcount !== undefined) {
      project.currentHeadcount = updateProjectDto.currentHeadcount;
    }

    // スキル要件
    if (updateProjectDto.requiredSkills !== undefined) {
      project.requiredSkills = updateProjectDto.requiredSkills;
    }

    // 契約情報
    if (updateProjectDto.contractType !== undefined) {
      project.contractType = updateProjectDto.contractType;
    }

    if (updateProjectDto.rateMin !== undefined) {
      project.rateMin = updateProjectDto.rateMin;
    }

    if (updateProjectDto.rateMax !== undefined) {
      project.rateMax = updateProjectDto.rateMax;
    }

    return this.projectsRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    await this.projectsRepository.delete(id);
  }

  async search(searchProjectsDto: SearchProjectsDto): Promise<Project[]> {
    const where: FindOptionsWhere<Project> = {};

    // 案件名での検索
    if (searchProjectsDto.name) {
      where.name = Like(`%${searchProjectsDto.name}%`);
    }

    // ステータスでの検索
    if (searchProjectsDto.status) {
      where.status = searchProjectsDto.status;
    }

    // 部署IDでの検索
    if (searchProjectsDto.departmentId) {
      where.departmentId = searchProjectsDto.departmentId;
    }

    // セクションIDでの検索
    if (searchProjectsDto.sectionId) {
      where.sectionId = searchProjectsDto.sectionId;
    }

    // 契約形態での検索
    if (searchProjectsDto.contractType) {
      where.contractType = searchProjectsDto.contractType;
    }

    // 開始日での範囲検索
    if (searchProjectsDto.startDateFrom || searchProjectsDto.startDateTo) {
      const startDateFilter: any = {};
      if (searchProjectsDto.startDateFrom) {
        startDateFilter.gte = new Date(searchProjectsDto.startDateFrom);
      }
      if (searchProjectsDto.startDateTo) {
        startDateFilter.lte = new Date(searchProjectsDto.startDateTo);
      }
      where.startDate = startDateFilter;
    }

    // 終了日での範囲検索
    if (searchProjectsDto.endDateFrom || searchProjectsDto.endDateTo) {
      const endDateFilter: any = {};
      if (searchProjectsDto.endDateFrom) {
        endDateFilter.gte = new Date(searchProjectsDto.endDateFrom);
      }
      if (searchProjectsDto.endDateTo) {
        endDateFilter.lte = new Date(searchProjectsDto.endDateTo);
      }
      where.endDate = endDateFilter;
    }

    // 単価での範囲検索
    if (searchProjectsDto.rateMin) {
      where.rateMin = parseInt(searchProjectsDto.rateMin as any, 10);
    }

    if (searchProjectsDto.rateMax) {
      where.rateMax = parseInt(searchProjectsDto.rateMax as any, 10);
    }

    return this.projectsRepository.find({
      where,
      relations: ['department', 'section'],
      order: { updatedAt: 'DESC' },
    });
  }

  async approve(id: string, userId: string): Promise<Project> {
    const project = await this.findOne(id);

    if (!project) {
      throw new Error('案件が見つかりません');
    }

    project.isApproved = true;
    project.approvedBy = userId;
    project.approvedAt = new Date();
    project.status = '募集中';

    return this.projectsRepository.save(project);
  }

  async reject(id: string, reason: string): Promise<Project> {
    const project = await this.findOne(id);

    if (!project) {
      throw new Error('案件が見つかりません');
    }

    project.status = '差し戻し';
    project.rejectionReason = reason;

    return this.projectsRepository.save(project);
  }

  async updateStatus(id: string, status: string): Promise<Project> {
    const project = await this.findOne(id);

    if (!project) {
      throw new Error('案件が見つかりません');
    }

    project.status = status;

    return this.projectsRepository.save(project);
  }

  // 要員割り当て機能
  async assignStaff(id: string, staffIds: string[]): Promise<Project> {
    const project = await this.findOne(id);

    if (!project) {
      throw new Error('案件が見つかりません');
    }

    // 現在の割り当て要員リストを取得
    const currentStaffs = project.assignedStaffs || [];
    
    // 新しい要員を追加（重複を排除）
    const updatedStaffs = [...new Set([...currentStaffs, ...staffIds])];
    
    // 要員数を更新
    project.assignedStaffs = updatedStaffs;
    project.currentHeadcount = updatedStaffs.length;
    
    return this.projectsRepository.save(project);
  }

  // 要員削除機能
  async removeStaff(id: string, staffId: string): Promise<Project> {
    const project = await this.findOne(id);

    if (!project) {
      throw new Error('案件が見つかりません');
    }

    // 現在の割り当て要員リストを取得
    const currentStaffs = project.assignedStaffs || [];
    
    // 指定された要員を削除
    const updatedStaffs = currentStaffs.filter((sid: string) => sid !== staffId);
    
    // 要員数を更新
    project.assignedStaffs = updatedStaffs;
    project.currentHeadcount = updatedStaffs.length;
    
    return this.projectsRepository.save(project);
  }
}
