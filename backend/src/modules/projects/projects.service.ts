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
      order: { updatedAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Project> {
    return this.projectsRepository.findOne({
      where: { id },
      relations: ['department', 'section']
    });
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = new Project();
    project.id = uuidv4();
    
    // 基本情報
    project.name = createProjectDto.name;
    project.description = createProjectDto.description;
    project.startDate = createProjectDto.startDate;
    project.endDate = createProjectDto.endDate;
    project.status = createProjectDto.status || 'draft';
    
    // 部署・セクション情報
    if (createProjectDto.departmentId) {
      project.departmentId = createProjectDto.departmentId;
    }
    
    if (createProjectDto.sectionId) {
      project.sectionId = createProjectDto.sectionId;
    }
    
    // 予算・人員情報
    project.budget = createProjectDto.budget;
    project.requiredHeadcount = createProjectDto.requiredHeadcount || 1;
    project.currentHeadcount = createProjectDto.currentHeadcount || 0;
    
    // スキル要件
    project.requiredSkills = createProjectDto.requiredSkills;
    
    // 契約情報
    project.contractType = createProjectDto.contractType;
    project.rateMin = createProjectDto.rateMin;
    project.rateMax = createProjectDto.rateMax;
    
    // 承認情報
    project.isApproved = false;
    project.approvedBy = null;
    project.approvedAt = null;
    
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
    if (searchProjectsDto.startDateFrom) {
      where.startDate = where.startDate || {};
      where.startDate = { ...where.startDate, gte: searchProjectsDto.startDateFrom };
    }
    
    if (searchProjectsDto.startDateTo) {
      where.startDate = where.startDate || {};
      where.startDate = { ...where.startDate, lte: searchProjectsDto.startDateTo };
    }
    
    // 終了日での範囲検索
    if (searchProjectsDto.endDateFrom) {
      where.endDate = where.endDate || {};
      where.endDate = { ...where.endDate, gte: searchProjectsDto.endDateFrom };
    }
    
    if (searchProjectsDto.endDateTo) {
      where.endDate = where.endDate || {};
      where.endDate = { ...where.endDate, lte: searchProjectsDto.endDateTo };
    }
    
    // 単価での範囲検索
    if (searchProjectsDto.rateMin) {
      where.rateMin = where.rateMin || {};
      where.rateMin = { ...where.rateMin, gte: searchProjectsDto.rateMin };
    }
    
    if (searchProjectsDto.rateMax) {
      where.rateMax = where.rateMax || {};
      where.rateMax = { ...where.rateMax, lte: searchProjectsDto.rateMax };
    }
    
    return this.projectsRepository.find({
      where,
      relations: ['department', 'section'],
      order: { updatedAt: 'DESC' }
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
    project.status = 'recruiting';
    
    return this.projectsRepository.save(project);
  }

  async reject(id: string, reason: string): Promise<Project> {
    const project = await this.findOne(id);
    
    if (!project) {
      throw new Error('案件が見つかりません');
    }
    
    project.status = 'rejected';
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
}
