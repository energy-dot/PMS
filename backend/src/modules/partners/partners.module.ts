import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { Partner } from '../../entities/partner.entity';
import { AntisocialCheck } from '../../entities/antisocial-check.entity';
import { AntisocialCheckService } from './antisocial-check.service';
import { AntisocialCheckController } from './antisocial-check.controller';
import { BaseContract } from '../../entities/base-contract.entity';
import { BaseContractService } from './base-contract.service';
import { BaseContractController } from './base-contract.controller';
import { ContactPerson } from '../../entities/contact-person.entity';
import { ContactPersonService } from './contact-person.service';
import { ContactPersonController } from './contact-person.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Partner, AntisocialCheck, BaseContract, ContactPerson])],
  controllers: [PartnersController, AntisocialCheckController, BaseContractController, ContactPersonController],
  providers: [PartnersService, AntisocialCheckService, BaseContractService, ContactPersonService],
  exports: [PartnersService, AntisocialCheckService, BaseContractService, ContactPersonService],
})
export class PartnersModule {}
