import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractDocumentsService } from './contract-documents.service';
import { ContractDocumentsController } from './contract-documents.controller';
import { ContractDocument } from '../../entities/contract-document.entity';
import { Contract } from '../../entities/contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContractDocument, Contract])],
  controllers: [ContractDocumentsController],
  providers: [ContractDocumentsService],
  exports: [ContractDocumentsService],
})
export class ContractDocumentsModule {}
