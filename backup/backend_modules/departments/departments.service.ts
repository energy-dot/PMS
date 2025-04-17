import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../entities/department.entity';
import { Section } from '../../entities/section.entity';
import { CreateDepartmentDto } from '../../dto/departments/create-department.dto';
import { UpdateDepartmentDto } from '../../dto/departments/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentsRepository.create(createDepartmentDto);
    return this.departmentsRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentsRepository.find({
      order: {
        displayOrder: 'ASC',
        name: 'ASC',
      },
      where: {
        isActive: true,
      },
    });
  }

  async findAllWithSections(): Promise<Department[]> {
    return this.departmentsRepository.find({
      relations: ['sections'],
      order: {
        displayOrder: 'ASC',
        name: 'ASC',
      },
      where: {
        isActive: true,
      },
    });
  }

  async findOne(id: string): Promise<Department | null> {
    return this.departmentsRepository.findOne({
      where: { id },
      relations: ['sections'],
    });
  }

  async findSections(id: string): Promise<Section[]> {
    return this.sectionsRepository.find({
      where: { departmentId: id, isActive: true },
      order: {
        displayOrder: 'ASC',
        name: 'ASC',
      },
    });
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department | null> {
    const department = await this.findOne(id);
    if (!department) {
      return null;
    }

    Object.assign(department, updateDepartmentDto);
    return this.departmentsRepository.save(department);
  }

  async remove(id: string): Promise<boolean> {
    // 論理削除 - isActiveをfalseに設定
    const department = await this.findOne(id);
    if (!department) {
      return false;
    }

    department.isActive = false;
    await this.departmentsRepository.save(department);
    return true;
  }
}
