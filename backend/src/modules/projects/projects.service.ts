import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { CreateProjectDto } from '../../dto/projects/create-project.dto';
import { UpdateProjectDto } from '../../dto/projects/update-project.dto';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}
  findAll(): Promise<Project[]> {
    return this.projectsRepository.find();
  }
  async findOne(id: string): Promise<Project | null> {
    return this.projectsRepository.findOne({ where: { id } });
  }
  create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(createProjectDto);
    return this.projectsRepository.save(project);
  }
  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project | null> {
    const project = await this.findOne(id);
    if (!project) {
      return null;
    }
    
    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }
  async remove(id: string): Promise<boolean> {
    const result = await this.projectsRepository.delete(id);
    return result && result.affected ? result.affected > 0 : false;
  }
}
