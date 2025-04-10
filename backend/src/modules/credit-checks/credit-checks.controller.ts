import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreditChecksService } from './credit-checks.service';
import { CreateCreditCheckDto } from '../../dto/credit-checks/create-credit-check.dto';
import { UpdateCreditCheckDto } from '../../dto/credit-checks/update-credit-check.dto';

@Controller('credit-checks')
@UseGuards(JwtAuthGuard)
export class CreditChecksController {
  constructor(private readonly creditChecksService: CreditChecksService) {}

  @Post()
  create(@Body() createCreditCheckDto: CreateCreditCheckDto) {
    return this.creditChecksService.create(createCreditCheckDto);
  }

  @Get()
  findAll() {
    return this.creditChecksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditChecksService.findOne(id);
  }

  @Get('partner/:partnerId')
  findByPartnerId(@Param('partnerId') partnerId: string) {
    return this.creditChecksService.findByPartnerId(partnerId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreditCheckDto: UpdateCreditCheckDto) {
    return this.creditChecksService.update(id, updateCreditCheckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditChecksService.remove(id);
  }
}
