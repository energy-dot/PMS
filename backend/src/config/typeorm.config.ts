import { DataSource } from 'typeorm';
import { join } from 'path';
import { Partner } from '../entities/partner.entity';
import { Project } from '../entities/project.entity';
import { Staff } from '../entities/staff.entity';
import { Contract } from '../entities/contract.entity';
import { User } from '../entities/user.entity';
import { AntisocialCheck } from '../entities/antisocial-check.entity';
import { BaseContract } from '../entities/base-contract.entity';
import { ContactPerson } from '../entities/contact-person.entity';
import { Department } from '../entities/department.entity';
import { Section } from '../entities/section.entity';
import { CreateDepartmentSectionTables1743815123456 } from '../migrations/1743815123456-CreateDepartmentSectionTables';

const typeormConfig = new DataSource({
  type: 'sqlite',
  database: join(__dirname, '..', '..', 'database.sqlite'),
  entities: [
    // 依存関係のない基本エンティティを先に読み込む
    User,
    Department,
    Partner,
    Staff,
    AntisocialCheck,
    BaseContract,
    ContactPerson,
    // 依存関係のあるエンティティはその後に
    Section,
    Project,
    Contract
  ],
  migrations: [CreateDepartmentSectionTables1743815123456],
  synchronize: true, // 開発中は自動同期を有効にする
  logging: true, // ログを有効にする
});

export default typeormConfig;