import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Between } from 'typeorm';
import { Staff } from '../../entities/staff.entity';
import { CreateStaffDto } from '../../dto/staff/create-staff.dto';
import { UpdateStaffDto } from '../../dto/staff/update-staff.dto';
import { SearchStaffDto } from '../../dto/staff/search-staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async findAll(): Promise<Staff[]> {
    return this.staffRepository.find({
      relations: ['partner', 'contracts'],
    });
  }

  async findOne(id: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['partner', 'contracts'],
    });
    
    if (!staff) {
      throw new Error(`要員ID ${id} は見つかりませんでした`);
    }
    
    return staff;
  }

  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    const staff = this.staffRepository.create(createStaffDto);
    return this.staffRepository.save(staff);
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    const staff = await this.findOne(id);
    const updatedStaff = this.staffRepository.merge(staff, updateStaffDto);
    return this.staffRepository.save(updatedStaff);
  }

  async remove(id: string): Promise<void> {
    const staff = await this.findOne(id);
    await this.staffRepository.remove(staff);
  }

  async search(searchStaffDto: SearchStaffDto): Promise<Staff[]> {
    const where: any = {};
    
    // 名前検索
    if (searchStaffDto.fullName) {
      where.fullName = Like(`%${searchStaffDto.fullName}%`);
    }
    
    // スキル検索
    if (searchStaffDto.skills) {
      where.skills = Like(`%${searchStaffDto.skills}%`);
    }
    
    // パートナー会社ID検索
    if (searchStaffDto.partnerId) {
      where.partner = { id: searchStaffDto.partnerId };
    }
    
    // 単価範囲検索
    if (searchStaffDto.rateMin !== undefined) {
      // TypeORMのBetweenを使用するように修正
      if (searchStaffDto.rateMax !== undefined) {
        // 最小値と最大値の両方が指定されている場合
        where.monthlyRate = Between(searchStaffDto.rateMin, searchStaffDto.rateMax);
      } else {
        // 最小値のみ指定されている場合
        where.monthlyRate = Between(searchStaffDto.rateMin, 9999999);
      }
    } else if (searchStaffDto.rateMax !== undefined) {
      // 最大値のみ指定されている場合
      where.monthlyRate = Between(0, searchStaffDto.rateMax);
    }
    
    // 稼働状況検索
    if (searchStaffDto.availability) {
      where.status = searchStaffDto.availability;
    }
    
    return this.staffRepository.find({
      where,
      relations: ['partner', 'contracts'],
    });
  }
}
