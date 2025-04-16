import { Controller, Get, Post, Body, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
// ExcelJS 型定義エラー回避用
interface Column {
  width?: number;
}

interface Workbook {
  addWorksheet(name: string): Worksheet;
  xlsx: {
    write(stream: any): Promise<void>;
  };
}

interface Cell {
  value: any;
  font?: any;
  fill?: any;
  border?: any;
  alignment?: any;
}

interface Row {
  eachCell(callback: (cell: Cell, colNumber: number) => void): void;
}

interface Worksheet {
  mergeCells(range: string): void;
  getCell(address: string): Cell;
  addRow(data?: any[]): Row;
  columns: Column[];
  rowCount: number;
}

// ExcelJS の代わりに独自の型定義を使用
const ExcelJS: { Workbook: new () => Workbook } = require('exceljs');

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('project_status')
  async getProjectStatusReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('department') department: string,
  ) {
    return this.reportsService.getProjectStatusReport(startDate, endDate, department);
  }

  @Get('partner_projects')
  async getPartnerProjectsReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('department') department: string,
  ) {
    return this.reportsService.getPartnerProjectsReport(startDate, endDate, department);
  }

  @Get('application_status')
  async getApplicationStatusReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('department') department: string,
  ) {
    return this.reportsService.getApplicationStatusReport(startDate, endDate, department);
  }

  @Get('staff_evaluation')
  async getStaffEvaluationReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('department') department: string,
  ) {
    return this.reportsService.getStaffEvaluationReport(startDate, endDate, department);
  }

  @Get('contract_summary')
  async getContractSummaryReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('department') department: string,
  ) {
    return this.reportsService.getContractSummaryReport(startDate, endDate, department);
  }

  @Get('monthly_project_trend')
  async getMonthlyProjectTrendReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('department') department: string,
  ) {
    return this.reportsService.getMonthlyProjectTrendReport(startDate, endDate, department);
  }

  @Get(':reportType/export')
  async exportReport(
    @Param('reportType') reportType: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('department') department: string,
    @Query('format') format: string,
    @Res() res: Response,
  ) {
    let reportData;

    // レポートタイプに応じたデータ取得
    switch (reportType) {
      case 'project_status':
        reportData = await this.reportsService.getProjectStatusReport(
          startDate,
          endDate,
          department,
        );
        break;
      case 'partner_projects':
        reportData = await this.reportsService.getPartnerProjectsReport(
          startDate,
          endDate,
          department,
        );
        break;
      case 'application_status':
        reportData = await this.reportsService.getApplicationStatusReport(
          startDate,
          endDate,
          department,
        );
        break;
      case 'staff_evaluation':
        reportData = await this.reportsService.getStaffEvaluationReport(
          startDate,
          endDate,
          department,
        );
        break;
      case 'contract_summary':
        reportData = await this.reportsService.getContractSummaryReport(
          startDate,
          endDate,
          department,
        );
        break;
      case 'monthly_project_trend':
        reportData = await this.reportsService.getMonthlyProjectTrendReport(
          startDate,
          endDate,
          department,
        );
        break;
      default:
        throw new Error('不明なレポートタイプです');
    }

    // Excelファイルの生成
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // レポートタイプに応じたExcelの設定
    const reportTitle = this.getReportTitle(reportType);
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = reportTitle;
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // フィルター条件の追加
    worksheet.getCell('A2').value = '期間:';
    worksheet.getCell('B2').value = `${startDate || '(制限なし)'} 〜 ${endDate || '(制限なし)'}`;
    worksheet.getCell('A3').value = '部署:';
    worksheet.getCell('B3').value = department === 'all' ? '全部署' : department;

    // テーブルヘッダーの設定
    const headers = this.getReportHeaders(reportType);
    worksheet.addRow([]);
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell: any) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // データの追加
    if (reportData.tableData && reportData.tableData.length > 0) {
      reportData.tableData.forEach(item => {
        const rowData = this.getRowData(reportType, item);
        const dataRow = worksheet.addRow(rowData);
        dataRow.eachCell((cell: any) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });
    }

    // 列幅の自動調整
    worksheet.columns.forEach((column: any) => {
      column.width = 20;
    });

    // サマリーセクションの追加（存在する場合）
    if (reportData.summary) {
      worksheet.addRow([]);
      worksheet.addRow(['サマリー']);
      worksheet.getCell(`A${worksheet.rowCount}`).font = { bold: true };

      Object.entries(reportData.summary).forEach(([key, value]) => {
        worksheet.addRow([key, value]);
      });
    }

    // ファイルのレスポンス設定
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${reportType}_report_${new Date().toISOString().split('T')[0]}.xlsx`,
    );

    // ファイルの書き出し
    await workbook.xlsx.write(res);
    res.end();
  }

  // レポートタイトルの取得
  private getReportTitle(reportType: string): string {
    switch (reportType) {
      case 'project_status':
        return '案件ステータス集計レポート';
      case 'partner_projects':
        return 'パートナー別案件数レポート';
      case 'application_status':
        return '応募状況集計レポート';
      case 'staff_evaluation':
        return '要員評価集計レポート';
      case 'contract_summary':
        return '契約状況サマリーレポート';
      case 'monthly_project_trend':
        return '月別案件推移レポート';
      default:
        return 'レポート';
    }
  }

  // レポートヘッダーの取得
  private getReportHeaders(reportType: string): string[] {
    switch (reportType) {
      case 'project_status':
        return ['ステータス', '案件数', '割合'];
      case 'partner_projects':
        return ['パートナー会社', '案件数', '要員数', '平均単価'];
      case 'application_status':
        return ['応募ステータス', '応募者数', '割合'];
      case 'staff_evaluation':
        return ['評価項目', '平均スコア', '最高スコア', '最低スコア'];
      case 'contract_summary':
        return ['契約タイプ', '契約数', '平均単価', '合計金額'];
      case 'monthly_project_trend':
        return ['月', '新規案件数', '終了案件数', '進行中案件数'];
      default:
        return [];
    }
  }

  // 行データの取得
  private getRowData(reportType: string, item: any): any[] {
    switch (reportType) {
      case 'project_status':
        return [item.status, item.count, `${item.percentage}%`];
      case 'partner_projects':
        return [item.partnerName, item.projectCount, item.staffCount, item.averageRate];
      case 'application_status':
        return [item.status, item.count, `${item.percentage}%`];
      case 'staff_evaluation':
        return [item.category, item.averageScore, item.maxScore, item.minScore];
      case 'contract_summary':
        return [item.contractType, item.count, item.averageRate, item.totalAmount];
      case 'monthly_project_trend':
        return [item.month, item.newProjects, item.endedProjects, item.activeProjects];
      default:
        return [];
    }
  }
}
