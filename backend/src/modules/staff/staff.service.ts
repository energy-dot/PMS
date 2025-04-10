import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Staff } from '../../entities/staff.entity';
import { CreateStaffDto } from '../../dto/staff/create-staff.dto';
import { UpdateStaffDto } from '../../dto/staff/update-staff.dto';
import { SearchStaffDto } from '../../dto/staff/search-staff.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async findAll(): Promise<Staff[]> {
    return this.staffRepository.find({
      relations: ['partner'],
      order: { updatedAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Staff> {
    return this.staffRepository.findOne({
      where: { id },
      relations: ['partner']
    });
  }

  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    const staff = new Staff();
    staff.id = uuidv4();
    
    // 基本情報
    staff.fullName = createStaffDto.fullName;
    staff.nameKana = createStaffDto.nameKana;
    staff.email = createStaffDto.email;
    staff.phone = createStaffDto.phone;
    staff.birthDate = createStaffDto.birthDate;
    staff.gender = createStaffDto.gender;
    
    // 所属情報
    if (createStaffDto.partnerId) {
      staff.partnerId = createStaffDto.partnerId;
    }
    
    // スキル情報
    staff.skills = createStaffDto.skills;
    staff.skillLevel = createStaffDto.skillLevel || 1;
    staff.yearsOfExperience = createStaffDto.yearsOfExperience || 0;
    
    // 契約情報
    staff.contractType = createStaffDto.contractType;
    staff.rate = createStaffDto.rate;
    staff.availability = createStaffDto.availability || 'available';
    
    // その他情報
    staff.notes = createStaffDto.notes;
    
    return this.staffRepository.save(staff);
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    const staff = await this.findOne(id);
    
    if (!staff) {
      throw new Error('要員が見つかりません');
    }
    
    // 基本情報
    if (updateStaffDto.fullName !== undefined) {
      staff.fullName = updateStaffDto.fullName;
    }
    
    if (updateStaffDto.nameKana !== undefined) {
      staff.nameKana = updateStaffDto.nameKana;
    }
    
    if (updateStaffDto.email !== undefined) {
      staff.email = updateStaffDto.email;
    }
    
    if (updateStaffDto.phone !== undefined) {
      staff.phone = updateStaffDto.phone;
    }
    
    if (updateStaffDto.birthDate !== undefined) {
      staff.birthDate = updateStaffDto.birthDate;
    }
    
    if (updateStaffDto.gender !== undefined) {
      staff.gender = updateStaffDto.gender;
    }
    
    // 所属情報
    if (updateStaffDto.partnerId !== undefined) {
      staff.partnerId = updateStaffDto.partnerId;
    }
    
    // スキル情報
    if (updateStaffDto.skills !== undefined) {
      staff.skills = updateStaffDto.skills;
    }
    
    if (updateStaffDto.skillLevel !== undefined) {
      staff.skillLevel = updateStaffDto.skillLevel;
    }
    
    if (updateStaffDto.yearsOfExperience !== undefined) {
      staff.yearsOfExperience = updateStaffDto.yearsOfExperience;
    }
    
    // 契約情報
    if (updateStaffDto.contractType !== undefined) {
      staff.contractType = updateStaffDto.contractType;
    }
    
    if (updateStaffDto.rate !== undefined) {
      staff.rate = updateStaffDto.rate;
    }
    
    if (updateStaffDto.availability !== undefined) {
      staff.availability = updateStaffDto.availability;
    }
    
    // その他情報
    if (updateStaffDto.notes !== undefined) {
      staff.notes = updateStaffDto.notes;
    }
    
    return this.staffRepository.save(staff);
  }

  async remove(id: string): Promise<void> {
    await this.staffRepository.delete(id);
  }

  async search(searchStaffDto: SearchStaffDto): Promise<Staff[]> {
    const where: FindOptionsWhere<Staff> = {};
    
    // 名前での検索
    if (searchStaffDto.fullName) {
      where.fullName = Like(`%${searchStaffDto.fullName}%`);
    }
    
    // 名前（カナ）での検索
    if (searchStaffDto.nameKana) {
      where.nameKana = Like(`%${searchStaffDto.nameKana}%`);
    }
    
    // パートナーIDでの検索
    if (searchStaffDto.partnerId) {
      where.partnerId = searchStaffDto.partnerId;
    }
    
    // スキルでの検索
    if (searchStaffDto.skills) {
      where.skills = Like(`%${searchStaffDto.skills}%`);
    }
    
    // スキルレベルでの検索
    if (searchStaffDto.skillLevelMin) {
      where.skillLevel = where.skillLevel || {};
      where.skillLevel = { ...where.skillLevel, gte: searchStaffDto.skillLevelMin };
    }
    
    if (searchStaffDto.skillLevelMax) {
      where.skillLevel = where.skillLevel || {};
      where.skillLevel = { ...where.skillLevel, lte: searchStaffDto.skillLevelMax };
    }
    
    // 経験年数での検索
    if (searchStaffDto.yearsOfExperienceMin) {
      where.yearsOfExperience = where.yearsOfExperience || {};
      where.yearsOfExperience = { ...where.yearsOfExperience, gte: searchStaffDto.yearsOfExperienceMin };
    }
    
    if (searchStaffDto.yearsOfExperienceMax) {
      where.yearsOfExperience = where.yearsOfExperience || {};
      where.yearsOfExperience = { ...where.yearsOfExperience, lte: searchStaffDto.yearsOfExperienceMax };
    }
    
    // 契約形態での検索
    if (searchStaffDto.contractType) {
      where.contractType = searchStaffDto.contractType;
    }
    
    // 単価での検索
    if (searchStaffDto.rateMin) {
      where.rate = where.rate || {};
      where.rate = { ...where.rate, gte: searchStaffDto.rateMin };
    }
    
    if (searchStaffDto.rateMax) {
      where.rate = where.rate || {};
      where.rate = { ...where.rate, lte: searchStaffDto.rateMax };
    }
    
    // アベイラビリティでの検索
    if (searchStaffDto.availability) {
      where.availability = searchStaffDto.availability;
    }
    
    return this.staffRepository.find({
      where,
      relations: ['partner'],
      order: { updatedAt: 'DESC' }
    });
  }
}
