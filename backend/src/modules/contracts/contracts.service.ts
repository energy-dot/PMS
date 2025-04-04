import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from '../../entities/contract.entity';
import { CreateContractDto } from '../../dto/contracts/create-contract.dto';
import { UpdateContractDto } from '../../dto/contracts/update-contract.dto';
@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
  ) {}
  findAll(): Promise<Contract[]> {
    return this.contractsRepository.find({
      relations: ['staff', 'project'],
    });
  }
  async findOne(id: string): Promise<Contract | null> {
    return this.contractsRepository.findOne({
      where: { id },
      relations: ['staff', 'project'],
    });
  }
  create(createContractDto: CreateContractDto): Promise<Contract> {
    const contract = this.contractsRepository.create(createContractDto);
    return this.contractsRepository.save(contract);
  }
  async update(id: string, updateContractDto: UpdateContractDto): Promise<Contract | null> {
    const contract = await this.findOne(id);
    if (!contract) {
      return null;
    }
    
    Object.assign(contract, updateContractDto);
    return this.contractsRepository.save(contract);
  }
  async remove(id: string): Promise<boolean> {
    const result = await this.contractsRepository.delete(id);
    return result && result.affected ? result.affected > 0 : false;
  }
}
