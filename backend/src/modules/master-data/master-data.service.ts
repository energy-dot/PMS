import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterData } from '../../entities/master-data.entity';
import { CreateMasterDataDto } from '../../dto/master-data/create-master-data.dto';
import { UpdateMasterDataDto } from '../../dto/master-data/update-master-data.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MasterDataService {
  constructor(
    @InjectRepository(MasterData)
    private masterDataRepository: Repository<MasterData>,
  ) {}

  async findAll(type?: string): Promise<MasterData[]> {
    const query = this.masterDataRepository.createQueryBuilder('masterData');
    
    if (type) {
      query.where('masterData.type = :type', { type });
    }
    
    query.orderBy('masterData.displayOrder', 'ASC');
    
    return query.getMany();
  }

  async findOne(id: string): Promise<MasterData> {
    return this.masterDataRepository.findOne({ where: { id } });
  }

  async create(createMasterDataDto: CreateMasterDataDto): Promise<MasterData> {
    const masterData = new MasterData();
    masterData.id = uuidv4();
    masterData.name = createMasterDataDto.name;
    masterData.description = createMasterDataDto.description;
    masterData.type = createMasterDataDto.type;
    masterData.category = createMasterDataDto.category;
    masterData.displayOrder = createMasterDataDto.displayOrder || 0;
    masterData.isActive = createMasterDataDto.isActive !== undefined ? createMasterDataDto.isActive : true;
    masterData.metadata = createMasterDataDto.metadata;
    
    return this.masterDataRepository.save(masterData);
  }

  async update(id: string, updateMasterDataDto: UpdateMasterDataDto): Promise<MasterData> {
    const masterData = await this.findOne(id);
    
    if (!masterData) {
      throw new Error('マスターデータが見つかりません');
    }
    
    if (updateMasterDataDto.name !== undefined) {
      masterData.name = updateMasterDataDto.name;
    }
    
    if (updateMasterDataDto.description !== undefined) {
      masterData.description = updateMasterDataDto.description;
    }
    
    if (updateMasterDataDto.category !== undefined) {
      masterData.category = updateMasterDataDto.category;
    }
    
    if (updateMasterDataDto.displayOrder !== undefined) {
      masterData.displayOrder = updateMasterDataDto.displayOrder;
    }
    
    if (updateMasterDataDto.isActive !== undefined) {
      masterData.isActive = updateMasterDataDto.isActive;
    }
    
    if (updateMasterDataDto.metadata !== undefined) {
      masterData.metadata = updateMasterDataDto.metadata;
    }
    
    return this.masterDataRepository.save(masterData);
  }

  async remove(id: string): Promise<void> {
    await this.masterDataRepository.delete(id);
  }

  async findByType(type: string): Promise<MasterData[]> {
    return this.masterDataRepository.find({
      where: { type, isActive: true },
      order: { displayOrder: 'ASC' }
    });
  }

  async findByTypeAndCategory(type: string, category: string): Promise<MasterData[]> {
    return this.masterDataRepository.find({
      where: { type, category, isActive: true },
      order: { displayOrder: 'ASC' }
    });
  }
}
