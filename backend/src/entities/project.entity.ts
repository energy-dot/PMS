import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Contract } from './contract.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  department: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    // SQLiteはenum型をサポートしていないため、テスト用に変更
    // type: 'enum',
    type: 'varchar',
    enum: ['募集中', '選考中', '充足', '承認待ち', '差し戻し', '終了'],
    default: '承認待ち',
  })
  status: string;

  @Column({ nullable: true })
  requiredSkills: string;

  @Column({ nullable: true })
  requiredExperience: string;

  @Column({ nullable: true })
  requiredNumber: number;

  @Column({ nullable: true })
  budget: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  workingHours: string;

  @Column({ default: false })
  isRemote: boolean;

  @Column({ nullable: true })
  remarks: string;

  @OneToMany(() => Contract, contract => contract.project)
  contracts: Contract[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
