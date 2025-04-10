import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from '../../entities/section.entity';
import { CreateSectionDto } from '../../dto/sections/create-section.dto';
import { UpdateSectionDto } from '../../dto/sections/update-section.dto';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,
  ) {}

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const section = this.sectionsRepository.create(createSectionDto);
    return this.sectionsRepository.save(section);
  }

  async findAll(): Promise<Section[]> {
    return this.sectionsRepository.find({
      relations: ['department'],
      order: {
        displayOrder: 'ASC',
        name: 'ASC',
      },
      where: {
        isActive: true,
      },
    });
  }

  async findByDepartment(departmentId: string): Promise<Section[]> {
    return this.sectionsRepository.find({
      where: { 
        departmentId,
        isActive: true
      },
      order: {
        displayOrder: 'ASC',
        name: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Section | null> {
    return this.sectionsRepository.findOne({
      where: { id },
      relations: ['department'],
    });
  }

  async update(id: string, updateSectionDto: UpdateSectionDto): Promise<Section | null> {
    const section = await this.findOne(id);
    if (!section) {
      return null;
    }
    
    Object.assign(section, updateSectionDto);
    return this.sectionsRepository.save(section);
  }

  async remove(id: string): Promise<boolean> {
    // 論理削除 - isActiveをfalseに設定
    const section = await this.findOne(id);
    if (!section) {
      return false;
    }
    
    section.isActive = false;
    await this.sectionsRepository.save(section);
    return true;
  }
}
