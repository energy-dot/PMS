import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ContactPersonService } from './contact-person.service';
import { ContactPersonDto, UpdateContactPersonDto } from '../../dto/partners/contact-person.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('contact-persons')
@UseGuards(JwtAuthGuard)
export class ContactPersonController {
  constructor(private readonly contactPersonService: ContactPersonService) {}

  @Post()
  create(@Body() contactPersonDto: ContactPersonDto) {
    return this.contactPersonService.create(contactPersonDto);
  }

  @Get()
  findAll() {
    return this.contactPersonService.findAll();
  }

  @Get('partner/:partnerId')
  findByPartnerId(@Param('partnerId') partnerId: string) {
    return this.contactPersonService.findByPartnerId(partnerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactPersonService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactPersonDto: UpdateContactPersonDto) {
    return this.contactPersonService.update(id, updateContactPersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactPersonService.remove(id);
  }
}
