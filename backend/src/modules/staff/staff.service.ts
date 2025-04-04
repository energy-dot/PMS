import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../../entities/staff.entity';
import { CreateStaffDto } from '../../dto/staff/create-staff.dto';
import { UpdateStaffDto } from '../../dto/staff/update-staff.dto';
@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}
  findAll(): Promise<Staff[]> {
    return this.staffRepository.find({ relations: ['partner'] });
  }
  async findOne(id: string): Promise<Staff | null> {
    return this.staffRepository.findOne({
      where: { id },
      relations: ['partner'],
    });
  }
  create(createStaffDto: CreateStaffDto): Promise<Staff> {
    const staff = this.staffRepository.create(createStaffDto);
    return this.staffRepository.save(staff);
  }
  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff | null> {
    const staff = await this.findOne(id);
    if (!staff) {
      return null;
    }
    
    Object.assign(staff, updateStaffDto);
    return this.staffRepository.save(staff);
  }
  async remove(id: string): Promise<boolean> {
    const result = await this.staffRepository.delete(id);
    return result && result.affected ? result.affected > 0 : false;
  }
}
