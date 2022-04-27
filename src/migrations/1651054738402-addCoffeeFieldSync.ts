import {MigrationInterface, QueryRunner} from "typeorm";

export class addCoffeeFieldSync1651054738402 implements MigrationInterface {
    name = 'addCoffeeFieldSync1651054738402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `coffee` ADD `num` int NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `coffee` DROP COLUMN `num`");
    }

}
