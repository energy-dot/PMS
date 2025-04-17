import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactPerson } from '../../entities/contact-person.entity';
import { Partner } from '../../entities/partner.entity';
import { ContactPersonDto, UpdateContactPersonDto } from '../../dto/partners/contact-person.dto';

@Injectable()
export class ContactPersonService {
  constructor(
    @InjectRepository(ContactPerson)
    private contactPersonRepository: Repository<ContactPerson>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}

  async findAll(): Promise<ContactPerson[]> {
    return this.contactPersonRepository.find({
      relations: ['partner'],
    });
  }

  async findByPartnerId(partnerId: string): Promise<ContactPerson[]> {
    return this.contactPersonRepository.find({
      where: { partner: { id: partnerId } },
      relations: ['partner'],
      order: { type: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ContactPerson | null> {
    return this.contactPersonRepository.findOne({
      where: { id },
      relations: ['partner'],
    });
  }

  async create(contactPersonDto: ContactPersonDto): Promise<ContactPerson> {
    const partner = await this.partnerRepository.findOne({
      where: { id: contactPersonDto.partnerId },
    });

    if (!partner) {
      throw new Error('パートナーが見つかりません');
    }

    const contactPerson = this.contactPersonRepository.create({
      ...contactPersonDto,
      partner,
    });

    return this.contactPersonRepository.save(contactPerson);
  }

  async update(
    id: string,
    updateContactPersonDto: UpdateContactPersonDto,
  ): Promise<ContactPerson | null> {
    const contactPerson = await this.findOne(id);
    if (!contactPerson) {
      return null;
    }

    Object.assign(contactPerson, updateContactPersonDto);
    return this.contactPersonRepository.save(contactPerson);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.contactPersonRepository.delete(id);
    return result && result.affected ? result.affected > 0 : false;
  }
}
