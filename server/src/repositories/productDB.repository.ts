import { ProductDB, Product } from "../models/product";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";
import { BrandRepository } from "../repositories/brand.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { SizeRepository } from "../repositories/size.repository";
import { ProductCategoryRepository } from "../repositories/productCategory.repository";
import { ProductSizeRepository } from "../repositories/productSize.repository";
import { InsertionResult } from "../core/repositories/commands/db.command";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductDBRepository extends EditRepositoryBase<ProductDB> {
    constructor(
        dependecyContainer: DependencyContainer,
        connection: MySqlConnection,
        private brandRepo: BrandRepository,
        private categoryRepo: CategoryRepository,
        private sizeRepo: SizeRepository,
        private productCategoryRepo: ProductCategoryRepository,
        private productSizeRepo: ProductSizeRepository
    ) {
        super(dependecyContainer, connection, ProductDB, "product");
    }

    async insertProduct(product: Product, id: number): Promise<InsertionResult<number>> {
        const { categories, sizes, brand, ...rest } = product;
        const brandName = await this.brandRepo.find({ name: brand });
        if (!brandName) throw new Error("No brand with that name");
        const result = await this.insertOne({
            ...rest,
            storeId: id,
            brandId: brandName[0].id,
        });
        if (!result.insertId) throw new Error("Product creation failed");
        for (const category of categories) {
            const categoryResponse = await this.categoryRepo.find({ name: category });
            if (categoryResponse.length < 1) throw new Error("Invalid category");
            await this.productCategoryRepo.insertOne({
                productId: result.insertId,
                categoryId: categoryResponse[0].id,
            });
        }
        for (const size of sizes) {
            const sizeResponse = await this.sizeRepo.find({ name: size });
            if (sizeResponse.length < 1) throw new Error("Invalid size");
            await this.productSizeRepo.insertOne({
                productId: result.insertId,
                sizeId: sizeResponse[0].id,
            });
        }
        return result;
    }
}
