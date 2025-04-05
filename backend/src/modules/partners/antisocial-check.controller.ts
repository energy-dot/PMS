import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AntisocialCheckService } from './antisocial-check.service';
import { AntisocialCheckDto, UpdateAntisocialCheckDto } from '../../dto/partners/antisocial-check.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('antisocial-checks')
@UseGuards(JwtAuthGuard)
export class AntisocialCheckController {
  constructor(private readonly antisocialCheckService: AntisocialCheckService) {}

  @Post()
  create(@Body() antisocialCheckDto: AntisocialCheckDto) {
    return this.antisocialCheckService.create(antisocialCheckDto);
  }

  @Get()
  findAll() {
    return this.antisocialCheckService.findAll();
  }

  @Get('partner/:partnerId')
  findByPartnerId(@Param('partnerId') partnerId: string) {
    return this.antisocialCheckService.findByPartnerId(partnerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.antisocialCheckService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAntisocialCheckDto: UpdateAntisocialCheckDto) {
    return this.antisocialCheckService.update(id, updateAntisocialCheckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.antisocialCheckService.remove(id);
  }
}
