import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PartnersModule } from './modules/partners/partners.module';
import { StaffModule } from './modules/staff/staff.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { SectionsModule } from './modules/sections/sections.module';
import { EvaluationsModule } from './modules/evaluations/evaluations.module';
import { MasterDataModule } from './modules/master-data/master-data.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DATABASE_PATH', 'database.sqlite'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development', // 開発環境のみ
        autoLoadEntities: true,
        logging: configService.get('NODE_ENV') === 'development' ? ['error', 'warn'] : false,
      }),
    }),
    UsersModule,
    ProjectsModule,
    PartnersModule,
    StaffModule,
    ContractsModule,
    ApplicationsModule,
    NotificationsModule,
    WorkflowsModule,
    FileUploadModule,
    AuthModule,
    DepartmentsModule,
    SectionsModule,
    EvaluationsModule,
    MasterDataModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
