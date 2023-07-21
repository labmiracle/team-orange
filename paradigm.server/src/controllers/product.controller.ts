import { Action, ApiController, Controller } from "@miracledevs/paradigm-express-webapi";
import { Product, ProductDB } from "../models/product";
import { QueryError } from "mysql2";
import { ProductRepository } from "../repositories/product.repository";
import { ProductFilter } from "../filters/product.filter";
import { BrandRepository } from "../repositories/brand.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { SizeRepository } from "../repositories/size.repository";
import { ProductCategoryRepository } from "../repositories/productCategory.repository";
import { ProductSizeRepository } from "../repositories/productSize.repository";
import { ProductDBRepository } from "../repositories/productDB.repository";

@Controller({ route: "/api/shop/:storeId/product" })
export class ProductController extends ApiController {
    constructor(
        private productRepo: ProductRepository,
        private productDBRepo: ProductDBRepository,
        private brandRepo: BrandRepository,
        private categoryRepo: CategoryRepository,
        private sizeRepo: SizeRepository,
        private productCategoryRepo: ProductCategoryRepository,
        private productSizeRepo: ProductSizeRepository
    ) {
        super();
    }

    //@Action({ route: "/:id" })
    @Action({ route: "/" })
    async get(): Promise<Product[]> {
        try {
            const { storeId } = this.httpContext.request.params;
            const products = await this.productRepo.find("storeId", Number(storeId));
            return products;
        } catch (error) {
            const { name, message } = error as QueryError;
            console.error(name + message);
            throw new Error(name + ": " + message);
        }
    }

    @Action({ route: "/", filters: [ProductFilter], fromBody: true })
    async post(product: Product): Promise<void> {
        try {
            console.log(product);
            const { storeId } = this.httpContext.request.params;
            const brand = await this.brandRepo.find("name", product.brandName);
            console.log(brand);
            const result = await this.productDBRepo.insertOne({
                name: product.name,
                description: product.description,
                price: product.price,
                discountPercentage: product.discountPercentage,
                currentStock: product.currentStock,
                reorderPoint: product.reorderPoint,
                minimum: product.minimum,
                brandId: brand[0].id,
                storeId: Number(storeId),
            });
            try {
                for (const category of product.categories) {
                    const categoryResponse = await this.categoryRepo.find("name", category);
                    await this.productCategoryRepo.insertOne({
                        productId: result.insertId,
                        categoryId: categoryResponse[0].id,
                    });
                }
            } catch {
                throw new Error("Invalid category");
            }

            try {
                for (const size of product.sizes) {
                    const sizeResponse = await this.sizeRepo.find("name", size);

                    await this.productSizeRepo.insertOne({
                        productId: result.insertId,
                        sizeId: sizeResponse[0].id,
                    });
                }
            } catch {
                throw new Error("Invalid size");
            }
            if (result.insertId) return;
        } catch (error) {
            const { name, message } = error as QueryError;
            console.error(name + message);
            throw new Error(name + ": " + message);
        }
    }
}
