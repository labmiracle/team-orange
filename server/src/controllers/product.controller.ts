import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { Product } from "../models/product";
import { QueryError } from "mysql2";
import { ProductRepository } from "../repositories/product.repository";
import { ProductFilter } from "../filters/product.filter";
import { BrandRepository } from "../repositories/brand.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { SizeRepository } from "../repositories/size.repository";
import { ProductCategoryRepository } from "../repositories/productCategory.repository";
import { ProductSizeRepository } from "../repositories/productSize.repository";
import { ProductDBRepository } from "../repositories/productDB.repository";
import { Response } from "express";

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

    @Action({ route: "/:productId" })
    async getById(productId: number): Promise<Response> {
        try {
            const product = await this.productRepo.getById(Number(productId));
            return this.httpContext.response.status(200).json({
                message: "Product found",
                data: product,
                error: false,
            });
        } catch (error) {
            const { name, message } = error as QueryError;
            console.error(name + ": " + message);
            return this.httpContext.response.status(500).json({
                message: name + ": " + message,
                data: null,
                error: true,
            });
        }
    }

    @Action({ route: "/" })
    async getAll(): Promise<Response> {
        try {
            const { storeId } = this.httpContext.request.params;
            const products = await this.productRepo.find("storeId", Number(storeId));
            return this.httpContext.response.status(200).json({
                message: "Product found",
                data: products,
                error: false,
            });
        } catch (error) {
            console.error("Products " + error.message);
            return this.httpContext.response.status(201).json({
                message: name + "Products " + error.message,
                data: null,
                error: true,
            });
        }
    }

    @Action({ route: "/", filters: [ProductFilter], fromBody: true })
    async post(product: Product): Promise<Response> {
        try {
            const { categories, sizes, brand, ...rest } = product;
            const brandName = await this.brandRepo.find("name", brand);
            const result = await this.productDBRepo.insertOne({
                brandId: brandName[0].id,
                ...rest,
            });
            if (!result.insertId) throw new Error("Product creation failed");

            for (const category of categories) {
                const categoryResponse = await this.categoryRepo.find("name", category);
                if (categoryResponse.length) throw new Error("Invalid category");
                await this.productCategoryRepo.insertOne({
                    productId: result.insertId,
                    categoryId: categoryResponse[0].id,
                });
            }

            for (const size of sizes) {
                const sizeResponse = await this.sizeRepo.find("name", size);
                if (sizeResponse.length) throw new Error("Invalid size");
                await this.productSizeRepo.insertOne({
                    productId: result.insertId,
                    sizeId: sizeResponse[0].id,
                });
            }

            if (result.insertId)
                return this.httpContext.response.status(201).json({
                    message: "Product created",
                    data: product,
                    error: false,
                });
        } catch (error) {
            console.error("Product " + error.message);
            return this.httpContext.response.status(500).json({
                message: "Product " + error.message,
                data: product,
                error: true,
            });
        }
    }

    @Action({ route: "/:id", method: HttpMethod.DELETE })
    async delete(id: number): Promise<Response> {
        try {
            const result = await this.productDBRepo.delete(id);
            return this.httpContext.response.status(200).json({
                message: "Product deleted successfully",
                data: result,
                error: false,
            });
        } catch (error) {
            console.error("Product " + error.message);
            return this.httpContext.response.status(500).json({
                message: "Product " + error.message,
                data: null,
                error: true,
            });
        }
    }

    @Action({ route: "/", filters: [ProductFilter], fromBody: true, method: HttpMethod.PUT })
    async update(product: Product): Promise<Response> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { categories, sizes, brand, ...rest } = product;
            const brandName = await this.brandRepo.find("name", brand);
            const result = await this.productDBRepo.update({ brandId: brandName[0].id, ...rest });

            return this.httpContext.response.status(200).json({
                message: "Product updated",
                data: result,
                error: false,
            });
        } catch (error) {
            console.error("Product " + error.message);
            return this.httpContext.response.status(500).json({
                message: "Product " + error.message,
                data: null,
                error: true,
            });
        }
    }
}
