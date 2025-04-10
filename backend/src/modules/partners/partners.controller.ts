import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from '../../dto/partners/create-partner.dto';
import { UpdatePartnerDto } from '../../dto/partners/update-partner.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('partners')
@UseGuards(JwtAuthGuard)
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @Public()
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnerDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.partnersService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const partner = await this.partnersService.findOne(id);
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
    return partner;
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnersService.update(id, updatePartnerDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}
