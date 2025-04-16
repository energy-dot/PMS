import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Project } from '../../entities/project.entity';
import { Partner } from '../../entities/partner.entity';
import { Staff } from '../../entities/staff.entity';
import { Contract } from '../../entities/contract.entity';
import { Application } from '../../entities/application.entity';
import { Evaluation } from '../../entities/evaluation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Partner, Staff, Contract, Application, Evaluation])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
