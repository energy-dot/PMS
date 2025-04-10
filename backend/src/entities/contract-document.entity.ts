import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract.entity';

@Entity('contract_documents')
export class ContractDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Contract, contract => contract.documents)
  contract: Contract;

  @Column()
  name: string;

  @Column()
  filePath: string;

  @Column()
  fileType: string;

  @Column()
  fileSize: number;

  @Column({
    type: 'varchar',
    enum: ['契約書', '覚書', '変更依頼書', '請求書', 'その他'],
    default: 'その他',
  })
  documentType: string;

  @Column({ nullable: true })
  version: string;

  @Column({ nullable: true })
  remarks: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  uploadedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
