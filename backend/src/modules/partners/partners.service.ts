import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from '../../entities/partner.entity';
import { CreatePartnerDto } from '../../dto/partners/create-partner.dto';
import { UpdatePartnerDto } from '../../dto/partners/update-partner.dto';
@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private partnersRepository: Repository<Partner>,
  ) {}
  findAll(): Promise<Partner[]> {
    return this.partnersRepository.find();
  }
  async findOne(id: string): Promise<Partner | null> {
    return this.partnersRepository.findOne({ where: { id } });
  }
  create(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const partner = this.partnersRepository.create(createPartnerDto);
    return this.partnersRepository.save(partner);
  }
  async update(id: string, updatePartnerDto: UpdatePartnerDto): Promise<Partner | null> {
    const partner = await this.findOne(id);
    if (!partner) {
      return null;
    }
    
    Object.assign(partner, updatePartnerDto);
    return this.partnersRepository.save(partner);
  }
  async remove(id: string): Promise<boolean> {
    const result = await this.partnersRepository.delete(id);
    return result && result.affected ? result.affected > 0 : false;
  }
}
