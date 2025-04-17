import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { BaseContract } from '../../entities/base-contract.entity';
import { Partner } from '../../entities/partner.entity';
import { BaseContractDto, UpdateBaseContractDto } from '../../dto/partners/base-contract.dto';

@Injectable()
export class BaseContractService {
  constructor(
    @InjectRepository(BaseContract)
    private baseContractRepository: Repository<BaseContract>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}

  async findAll(): Promise<BaseContract[]> {
    return this.baseContractRepository.find({
      relations: ['partner'],
    });
  }

  async findByPartnerId(partnerId: string): Promise<BaseContract[]> {
    return this.baseContractRepository.find({
      where: { partner: { id: partnerId } },
      relations: ['partner'],
      order: { endDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<BaseContract | null> {
    return this.baseContractRepository.findOne({
      where: { id },
      relations: ['partner'],
    });
  }

  async create(baseContractDto: BaseContractDto): Promise<BaseContract> {
    const partner = await this.partnerRepository.findOne({
      where: { id: baseContractDto.partnerId },
    });

    if (!partner) {
      throw new Error('パートナーが見つかりません');
    }

    const baseContract = this.baseContractRepository.create({
      ...baseContractDto,
      partner,
    });

    return this.baseContractRepository.save(baseContract);
  }

  async update(
    id: string,
    updateBaseContractDto: UpdateBaseContractDto,
  ): Promise<BaseContract | null> {
    const baseContract = await this.findOne(id);
    if (!baseContract) {
      return null;
    }

    Object.assign(baseContract, updateBaseContractDto);
    return this.baseContractRepository.save(baseContract);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.baseContractRepository.delete(id);
    return result && result.affected ? result.affected > 0 : false;
  }

  async getUpcomingRenewals(days: number = 30): Promise<BaseContract[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return this.baseContractRepository.find({
      where: {
        endDate: Between(today, futureDate),
        status: '有効',
      },
      relations: ['partner'],
      order: { endDate: 'ASC' },
    });
  }

  async getExpiredContracts(): Promise<BaseContract[]> {
    const today = new Date();

    return this.baseContractRepository.find({
      where: {
        endDate: LessThan(today),
        status: '有効',
      },
      relations: ['partner'],
      order: { endDate: 'ASC' },
    });
  }
}
