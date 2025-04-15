import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from '../../entities/contract.entity';
import { DateUtilsService } from '../utils/date-utils.service';
import { FilterUtilsService } from '../utils/filter-utils.service';

/**
 * 契約に関するレポートを生成するサービス
 */
@Injectable()
export class ContractReportService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    private dateUtilsService: DateUtilsService,
    private filterUtilsService: FilterUtilsService
  ) {}

  /**
   * 契約状況サマリーレポートを生成
   */
  async getContractSummaryReport(startDate?: string, endDate?: string, department?: string) {
    // フィルター条件の構築
    const whereCondition: any = {};
    
    const dateFilter = this.dateUtilsService.getDateFilter(startDate, endDate);
    if (dateFilter) {
      whereCondition.startDate = dateFilter;
    }
    
    // プロジェクト経由で部署フィルターを適用
    if (department && department !== 'all') {
      whereCondition.project = {
        departmentId: department,
      };
    }
    
    // データ取得
    const contracts = await this.contractRepository.find({
      where: whereCondition,
      relations: ['project', 'staff'],
    });
    
    // 契約タイプ別に集計
    const typeCounts: Record<string, { count: number, totalRate: number, totalAmount: number }> = {};
    contracts.forEach(contract => {
      const type = contract.type || '未設定';
      
      if (!typeCounts[type]) {
        typeCounts[type] = {
          count: 0,
          totalRate: 0,
          totalAmount: 0,
        };
      }
      
      typeCounts[type].count += 1;
      typeCounts[type].totalRate += contract.monthlyRate || 0;
      
      // 契約金額の計算（単価 × 工数）
      const amount = (contract.monthlyRate || 0) * (contract.manMonth || 1);
      typeCounts[type].totalAmount += amount;
    });
    
    // テーブルデータの作成
    const tableData = Object.entries(typeCounts).map(([contractType, data]) => ({
      contractType,
      count: data.count,
      averageRate: data.count > 0 ? Math.round(data.totalRate / data.count) : 0,
      totalAmount: data.totalAmount,
    }));
    
    // チャートデータの作成
    const chartData = {
      labels: tableData.map(item => item.contractType),
      counts: tableData.map(item => item.count),
      averageRates: tableData.map(item => item.averageRate),
    };
    
    // サマリーデータの作成
    const totalContracts = contracts.length;
    const totalAmount = tableData.reduce((sum, item) => sum + item.totalAmount, 0);
    const averageRate = totalContracts > 0
      ? Math.round(contracts.reduce((sum, contract) => sum + (contract.monthlyRate || 0), 0) / totalContracts)
      : 0;
    
    const summary = {
      '契約総数': totalContracts,
      '平均単価': `¥${averageRate.toLocaleString()}`,
      '合計金額': `¥${totalAmount.toLocaleString()}`,
    };
    
    return {
      tableData,
      chartData,
      summary,
    };
  }
}
