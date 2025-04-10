import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PartnersModule } from './modules/partners/partners.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { StaffModule } from './modules/staff/staff.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { SectionsModule } from './modules/sections/sections.module';
import { Partner } from './entities/partner.entity';
import { Project } from './entities/project.entity';
import { Staff } from './entities/staff.entity';
import { Contract } from './entities/contract.entity';
import { User } from './entities/user.entity';
import { AntisocialCheck } from './entities/antisocial-check.entity';
import { BaseContract } from './entities/base-contract.entity';
import { ContactPerson } from './entities/contact-person.entity';
import { Department } from './entities/department.entity';
import { Section } from './entities/section.entity';
import { ValidatorsModule } from './validators/validators.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    process.env.NODE_ENV === 'test'
      ? TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            User,
            Department,
            Section,
            Partner,
            Project,
            Staff, 
            Contract, 
            AntisocialCheck, 
            BaseContract, 
            ContactPerson
          ],
          synchronize: true,
          dropSchema: true,
          autoLoadEntities: true,
        })
      : TypeOrmModule.forRoot({
          type: 'sqlite',
          database: join(__dirname, '..', 'database.sqlite'),
          entities: [
            User,
            Department,
            Section,
            Partner,
            Project,
            Staff, 
            Contract, 
            AntisocialCheck, 
            BaseContract, 
            ContactPerson
          ],
          synchronize: true,
          autoLoadEntities: true,
          logging: true
        }),
    AuthModule,
    PartnersModule,
    ProjectsModule,
    StaffModule,
    ContractsModule,
    DepartmentsModule,
    SectionsModule,
    ValidatorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}