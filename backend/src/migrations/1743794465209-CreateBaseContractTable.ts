import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateBaseContractTable1743794465209 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "base_contracts",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "partnerId",
                        type: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "startDate",
                        type: "timestamp",
                    },
                    {
                        name: "endDate",
                        type: "timestamp",
                    },
                    {
                        name: "status",
                        type: "varchar",
                        default: "'有効'"
                    },
                    {
                        name: "contractType",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "contractFile",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "terms",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "isAutoRenew",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "renewalNoticeDate",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "remarks",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()"
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "base_contracts",
            new TableForeignKey({
                columnNames: ["partnerId"],
                referencedColumnNames: ["id"],
                referencedTableName: "partners",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("base_contracts");
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("partnerId") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("base_contracts", foreignKey);
            }
        }
        await queryRunner.dropTable("base_contracts");
    }
}
