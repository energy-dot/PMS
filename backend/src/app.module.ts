import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PartnersModule } from './modules/partners/partners.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { StaffModule } from './modules/staff/staff.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', 'database.sqlite'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    PartnersModule,
    ProjectsModule,
    StaffModule,
    ContractsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
