import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BaseContractService } from './base-contract.service';
import { BaseContractDto, UpdateBaseContractDto } from '../../dto/partners/base-contract.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('base-contracts')
@UseGuards(JwtAuthGuard)
export class BaseContractController {
  constructor(private readonly baseContractService: BaseContractService) {}

  @Post()
  create(@Body() baseContractDto: BaseContractDto) {
    return this.baseContractService.create(baseContractDto);
  }

  @Get()
  findAll() {
    return this.baseContractService.findAll();
  }

  @Get('partner/:partnerId')
  findByPartnerId(@Param('partnerId') partnerId: string) {
    return this.baseContractService.findByPartnerId(partnerId);
  }

  @Get('upcoming-renewals')
  getUpcomingRenewals(@Query('days') days: number) {
    return this.baseContractService.getUpcomingRenewals(days);
  }

  @Get('expired')
  getExpiredContracts() {
    return this.baseContractService.getExpiredContracts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.baseContractService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBaseContractDto: UpdateBaseContractDto) {
    return this.baseContractService.update(id, updateBaseContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.baseContractService.remove(id);
  }
}
