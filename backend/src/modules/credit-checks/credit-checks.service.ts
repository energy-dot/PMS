import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditCheck } from '../../entities/credit-check.entity';
import { Partner } from '../../entities/partner.entity';
import { CreateCreditCheckDto } from '../../dto/credit-checks/create-credit-check.dto';
import { UpdateCreditCheckDto } from '../../dto/credit-checks/update-credit-check.dto';

@Injectable()
export class CreditChecksService {
  constructor(
    @InjectRepository(CreditCheck)
    private creditCheckRepository: Repository<CreditCheck>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}

  async findAll(): Promise<CreditCheck[]> {
    return this.creditCheckRepository.find({
      relations: ['partner'],
    });
  }

  async findOne(id: string): Promise<CreditCheck> {
    const creditCheck = await this.creditCheckRepository.findOne({
      where: { id },
      relations: ['partner'],
    });

    if (!creditCheck) {
      throw new NotFoundException(`信用調査ID ${id} は見つかりませんでした`);
    }

    return creditCheck;
  }

  async findByPartnerId(partnerId: string): Promise<CreditCheck[]> {
    return this.creditCheckRepository.find({
      where: { partner: { id: partnerId } },
      relations: ['partner'],
      order: { checkDate: 'DESC' },
    });
  }

  async create(createCreditCheckDto: CreateCreditCheckDto): Promise<CreditCheck> {
    const { partnerId, ...creditCheckData } = createCreditCheckDto;
    
    const partner = await this.partnerRepository.findOne({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException(`パートナーID ${partnerId} は見つかりませんでした`);
    }

    const creditCheck = this.creditCheckRepository.create({
      ...creditCheckData,
      partner,
    });

    const savedCreditCheck = await this.creditCheckRepository.save(creditCheck);

    // パートナーの信用調査完了フラグを更新
    if (creditCheck.isCompleted) {
      partner.creditCheckCompleted = true;
      partner.creditCheckDate = creditCheck.checkDate;
      await this.partnerRepository.save(partner);
    }

    return savedCreditCheck;
  }

  async update(id: string, updateCreditCheckDto: UpdateCreditCheckDto): Promise<CreditCheck> {
    const creditCheck = await this.findOne(id);
    
    const updatedCreditCheck = Object.assign(creditCheck, updateCreditCheckDto);
    const savedCreditCheck = await this.creditCheckRepository.save(updatedCreditCheck);

    // パートナーの信用調査完了フラグを更新
    if (updatedCreditCheck.isCompleted && updatedCreditCheck.partner) {
      const partner = await this.partnerRepository.findOne({
        where: { id: updatedCreditCheck.partner.id },
      });
      
      if (partner) {
        partner.creditCheckCompleted = true;
        partner.creditCheckDate = updatedCreditCheck.checkDate;
        await this.partnerRepository.save(partner);
      }
    }

    return savedCreditCheck;
  }

  async remove(id: string): Promise<void> {
    const creditCheck = await this.findOne(id);
    await this.creditCheckRepository.remove(creditCheck);
  }
}
