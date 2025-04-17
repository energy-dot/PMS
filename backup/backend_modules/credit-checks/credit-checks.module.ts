import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditChecksService } from './credit-checks.service';
import { CreditChecksController } from './credit-checks.controller';
import { CreditCheck } from '../../entities/credit-check.entity';
import { Partner } from '../../entities/partner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreditCheck, Partner])],
  controllers: [CreditChecksController],
  providers: [CreditChecksService],
  exports: [CreditChecksService],
})
export class CreditChecksModule {}
