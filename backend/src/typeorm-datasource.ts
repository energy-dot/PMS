import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';

// エンティティをインポート
import { User } from './entities/user.entity';
import { Department } from './entities/department.entity';
import { Section } from './entities/section.entity';
import { Partner } from './entities/partner.entity';
import { Project } from './entities/project.entity';
import { Staff } from './entities/staff.entity';
import { Contract } from './entities/contract.entity';
import { AntisocialCheck } from './entities/antisocial-check.entity';
import { BaseContract } from './entities/base-contract.entity';
import { ContactPerson } from './entities/contact-person.entity';

// 環境変数を読み込む
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'sqlite',
  database: join(__dirname, '..', 'database.sqlite'),
  entities: [
    User,
    Department,
    Partner,
    Staff,
    AntisocialCheck,
    BaseContract,
    ContactPerson,
    Section,
    Project,
    Contract
  ],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false, // マイグレーション実行時は同期を無効化
  logging: true
});
