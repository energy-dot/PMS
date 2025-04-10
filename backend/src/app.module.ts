import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
