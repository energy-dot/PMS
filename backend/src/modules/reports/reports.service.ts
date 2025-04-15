import { Injectable } from '@nestjs/common';
import { ProjectStatusReportService } from './project-status-report.service';
import { PartnerReportService } from './partner-report.service';
import { ApplicationReportService } from './application-report.service';
import { EvaluationReportService } from './evaluation-report.service';
import { ContractReportService } from './contract-report.service';

/**
 * レポート機能のファサードサービス
 * 各種レポートサービスを統合して提供する
 */
@Injectable()
export class ReportsService {
  constructor(
    private projectStatusReportService: ProjectStatusReportService,
    private partnerReportService: PartnerReportService,
    private applicationReportService: ApplicationReportService,
    private evaluationReportService: EvaluationReportService,
    private contractReportService: ContractReportService
  ) {}

  /**
   * 案件ステータス集計レポートを生成
   */
  async getProjectStatusReport(startDate?: string, endDate?: string, department?: string) {
    return this.projectStatusReportService.getProjectStatusReport(startDate, endDate, department);
  }

  /**
   * パートナー別案件数レポートを生成
   */
  async getPartnerProjectsReport(startDate?: string, endDate?: string, department?: string) {
    return this.partnerReportService.getPartnerProjectsReport(startDate, endDate, department);
  }

  /**
   * 応募状況集計レポートを生成
   */
  async getApplicationStatusReport(startDate?: string, endDate?: string, department?: string) {
    return this.applicationReportService.getApplicationStatusReport(startDate, endDate, department);
  }

  /**
   * 要員評価集計レポートを生成
   */
  async getStaffEvaluationReport(startDate?: string, endDate?: string, department?: string) {
    return this.evaluationReportService.getStaffEvaluationReport(startDate, endDate, department);
  }

  /**
   * 契約状況サマリーレポートを生成
   */
  async getContractSummaryReport(startDate?: string, endDate?: string, department?: string) {
    return this.contractReportService.getContractSummaryReport(startDate, endDate, department);
  }

  /**
   * 月別案件推移レポートを生成
   */
  async getMonthlyProjectTrendReport(startDate?: string, endDate?: string, department?: string) {
    return this.projectStatusReportService.getMonthlyProjectTrendReport(startDate, endDate, department);
  }
}
