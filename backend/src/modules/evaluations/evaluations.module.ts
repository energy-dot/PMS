import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsController } from './evaluations.controller';
import { EvaluationsService } from './evaluations.service';
import { Evaluation } from '../../entities/evaluation.entity';
import { EvaluationSkill } from '../../entities/evaluation-skill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation, EvaluationSkill]),
  ],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}
