import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Contract } from './contract.entity';

@Entity('file_metadata')
export class FileMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column()
  mimetype: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'contract_id', nullable: true })
  contractId: string;

  @ManyToOne(() => Contract, contract => contract.documents, {
    onDelete: 'CASCADE',
    nullable: true
  })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
