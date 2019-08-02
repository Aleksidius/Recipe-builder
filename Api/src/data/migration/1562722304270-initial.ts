import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1562722304270 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `measures` (`id` varchar(36) NOT NULL, `measure` varchar(255) NOT NULL, `gramsPerMeasure` int NOT NULL, `amount` int NOT NULL, `productCode` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `nutritions` (`id` varchar(36) NOT NULL, `PROCNT` text NOT NULL, `FAT` text NOT NULL, `CHOCDF` text NOT NULL, `ENERC_KCAL` text NOT NULL, `SUGAR` text NOT NULL, `FIBTG` text NOT NULL, `CA` text NOT NULL, `FE` text NOT NULL, `P` text NOT NULL, `K` text NOT NULL, `NA` text NOT NULL, `VITA_IU` text NOT NULL, `TOCPHA` text NOT NULL, `VITD` text NOT NULL, `VITC` text NOT NULL, `VITB12` text NOT NULL, `FOLAC` text NOT NULL, `CHOLE` text NOT NULL, `FATRN` text NOT NULL, `FASAT` text NOT NULL, `FAMS` text NOT NULL, `FAPU` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `foodGroup` (`foodcode` int NOT NULL, `description` varchar(255) NOT NULL, PRIMARY KEY (`foodcode`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `products` (`code` int NOT NULL, `description` varchar(255) NOT NULL, `foodGroupFoodcode` int NULL, `nutritionId` varchar(36) NULL, UNIQUE INDEX `REL_029502bbd9a8edca9ebb9ae652` (`nutritionId`), PRIMARY KEY (`code`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `igrendients` (`id` varchar(36) NOT NULL, `grams` int NOT NULL, `baseRecipeId` varchar(36) NULL, `complexRecipeId` varchar(36) NULL, `productCode` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Complex-recipes` (`id` varchar(36) NOT NULL, `title` varchar(255) NOT NULL, `category` varchar(255) NOT NULL, `created` date NOT NULL, `updatedOn` date NOT NULL, `isDeleted` tinyint NOT NULL DEFAULT 0, `authorId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users` (`id` varchar(36) NOT NULL, `username` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `joined` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `recipes` (`id` varchar(36) NOT NULL, `title` varchar(255) NOT NULL, `category` varchar(255) NOT NULL, `created` date NOT NULL, `updatedOn` date NOT NULL, `isDeleted` tinyint NOT NULL DEFAULT 0, `authorId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `complex-recipes_base_recipes_recipes` (`complexRecipesId` varchar(36) NOT NULL, `recipesId` varchar(36) NOT NULL, INDEX `IDX_68e2a87e3d7aa48d86d4c14e41` (`complexRecipesId`), INDEX `IDX_6dac87e199c86c57d6269e4f70` (`recipesId`), PRIMARY KEY (`complexRecipesId`, `recipesId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `measures` ADD CONSTRAINT `FK_db5edcd1328fb776774cc41420e` FOREIGN KEY (`productCode`) REFERENCES `products`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `products` ADD CONSTRAINT `FK_7e752bb8c002dd0660656644918` FOREIGN KEY (`foodGroupFoodcode`) REFERENCES `foodGroup`(`foodcode`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `products` ADD CONSTRAINT `FK_029502bbd9a8edca9ebb9ae652d` FOREIGN KEY (`nutritionId`) REFERENCES `nutritions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `igrendients` ADD CONSTRAINT `FK_c4f53f3de9ee6cf0b5e0559809a` FOREIGN KEY (`baseRecipeId`) REFERENCES `recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `igrendients` ADD CONSTRAINT `FK_d254a47426ae82c1a4e29f0ca64` FOREIGN KEY (`complexRecipeId`) REFERENCES `Complex-recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `igrendients` ADD CONSTRAINT `FK_857cde1432d0d6299e018d22fa8` FOREIGN KEY (`productCode`) REFERENCES `products`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `Complex-recipes` ADD CONSTRAINT `FK_4371e866a033a256461e13f008a` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipes` ADD CONSTRAINT `FK_afd4f74f8df44df574253a7f37b` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `complex-recipes_base_recipes_recipes` ADD CONSTRAINT `FK_68e2a87e3d7aa48d86d4c14e419` FOREIGN KEY (`complexRecipesId`) REFERENCES `Complex-recipes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `complex-recipes_base_recipes_recipes` ADD CONSTRAINT `FK_6dac87e199c86c57d6269e4f702` FOREIGN KEY (`recipesId`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `complex-recipes_base_recipes_recipes` DROP FOREIGN KEY `FK_6dac87e199c86c57d6269e4f702`");
        await queryRunner.query("ALTER TABLE `complex-recipes_base_recipes_recipes` DROP FOREIGN KEY `FK_68e2a87e3d7aa48d86d4c14e419`");
        await queryRunner.query("ALTER TABLE `recipes` DROP FOREIGN KEY `FK_afd4f74f8df44df574253a7f37b`");
        await queryRunner.query("ALTER TABLE `Complex-recipes` DROP FOREIGN KEY `FK_4371e866a033a256461e13f008a`");
        await queryRunner.query("ALTER TABLE `igrendients` DROP FOREIGN KEY `FK_857cde1432d0d6299e018d22fa8`");
        await queryRunner.query("ALTER TABLE `igrendients` DROP FOREIGN KEY `FK_d254a47426ae82c1a4e29f0ca64`");
        await queryRunner.query("ALTER TABLE `igrendients` DROP FOREIGN KEY `FK_c4f53f3de9ee6cf0b5e0559809a`");
        await queryRunner.query("ALTER TABLE `products` DROP FOREIGN KEY `FK_029502bbd9a8edca9ebb9ae652d`");
        await queryRunner.query("ALTER TABLE `products` DROP FOREIGN KEY `FK_7e752bb8c002dd0660656644918`");
        await queryRunner.query("ALTER TABLE `measures` DROP FOREIGN KEY `FK_db5edcd1328fb776774cc41420e`");
        await queryRunner.query("DROP INDEX `IDX_6dac87e199c86c57d6269e4f70` ON `complex-recipes_base_recipes_recipes`");
        await queryRunner.query("DROP INDEX `IDX_68e2a87e3d7aa48d86d4c14e41` ON `complex-recipes_base_recipes_recipes`");
        await queryRunner.query("DROP TABLE `complex-recipes_base_recipes_recipes`");
        await queryRunner.query("DROP TABLE `recipes`");
        await queryRunner.query("DROP TABLE `users`");
        await queryRunner.query("DROP TABLE `Complex-recipes`");
        await queryRunner.query("DROP TABLE `igrendients`");
        await queryRunner.query("DROP INDEX `REL_029502bbd9a8edca9ebb9ae652` ON `products`");
        await queryRunner.query("DROP TABLE `products`");
        await queryRunner.query("DROP TABLE `foodGroup`");
        await queryRunner.query("DROP TABLE `nutritions`");
        await queryRunner.query("DROP TABLE `measures`");
    }

}
