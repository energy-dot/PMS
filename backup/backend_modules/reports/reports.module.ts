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
import { ProjectStatusReportService } from './project-status-report.service';
import { PartnerReportService } from './partner-report.service';
import { ApplicationReportService } from './application-report.service';
import { EvaluationReportService } from './evaluation-report.service';
import { ContractReportService } from './contract-report.service';
import { DateUtilsService } from '../utils/date-utils.service';
import { FilterUtilsService } from '../utils/filter-utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Partner, Staff, Contract, Application, Evaluation])],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    ProjectStatusReportService,
    PartnerReportService,
    ApplicationReportService,
    EvaluationReportService,
    ContractReportService,
    DateUtilsService,
    FilterUtilsService
  ],
  exports: [ReportsService],
})
export class ReportsModule {}
