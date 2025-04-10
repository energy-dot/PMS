import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AntisocialCheck } from '../../entities/antisocial-check.entity';
import { Partner } from '../../entities/partner.entity';
import { AntisocialCheckDto, UpdateAntisocialCheckDto } from '../../dto/partners/antisocial-check.dto';

@Injectable()
export class AntisocialCheckService {
  constructor(
    @InjectRepository(AntisocialCheck)
    private antisocialCheckRepository: Repository<AntisocialCheck>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}

  async findAll(): Promise<AntisocialCheck[]> {
    return this.antisocialCheckRepository.find({
      relations: ['partner'],
    });
  }

  async findByPartnerId(partnerId: string): Promise<AntisocialCheck[]> {
    return this.antisocialCheckRepository.find({
      where: { partner: { id: partnerId } },
      relations: ['partner'],
      order: { checkDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<AntisocialCheck | null> {
    return this.antisocialCheckRepository.findOne({
      where: { id },
      relations: ['partner'],
    });
  }

  async create(antisocialCheckDto: AntisocialCheckDto): Promise<AntisocialCheck> {
    const partner = await this.partnerRepository.findOne({
      where: { id: antisocialCheckDto.partnerId },
    });

    if (!partner) {
      throw new Error('パートナーが見つかりません');
    }

    const antisocialCheck = this.antisocialCheckRepository.create({
      ...antisocialCheckDto,
      partner,
    });

    const savedCheck = await this.antisocialCheckRepository.save(antisocialCheck);

    // パートナーの反社チェックステータスを更新
    if (antisocialCheckDto.isCompleted) {
      partner.antisocialCheckCompleted = true;
      partner.antisocialCheckDate = antisocialCheckDto.checkDate;
      await this.partnerRepository.save(partner);
    }

    return savedCheck;
  }

  async update(id: string, updateAntisocialCheckDto: UpdateAntisocialCheckDto): Promise<AntisocialCheck | null> {
    const antisocialCheck = await this.findOne(id);
    if (!antisocialCheck) {
      return null;
    }

    Object.assign(antisocialCheck, updateAntisocialCheckDto);
    const updatedCheck = await this.antisocialCheckRepository.save(antisocialCheck);

    // パートナーの反社チェックステータスを更新
    if (updateAntisocialCheckDto.isCompleted !== undefined) {
      const partner = antisocialCheck.partner;
      partner.antisocialCheckCompleted = updateAntisocialCheckDto.isCompleted;
      if (updateAntisocialCheckDto.isCompleted && updateAntisocialCheckDto.checkDate) {
        partner.antisocialCheckDate = updateAntisocialCheckDto.checkDate;
      }
      await this.partnerRepository.save(partner);
    }

    return updatedCheck;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.antisocialCheckRepository.delete(id);
    return result && result.affected ? result.affected > 0 : false;
  }
}
