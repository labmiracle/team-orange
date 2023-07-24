import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { ProductI } from "../models/product";
import { ProductRepository } from "../repositories/product.repository";
import { ProductFilter } from "../filters/product.filter";
import { BrandRepository } from "../repositories/brand.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { SizeRepository } from "../repositories/size.repository";
import { ProductCategoryRepository } from "../repositories/productCategory.repository";
import { ProductSizeRepository } from "../repositories/productSize.repository";
import { ProductDBRepository } from "../repositories/productDB.repository";
import { Path, PathParam, GET, POST, DELETE, PUT } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import { ResponseMessage } from "../types/ResponseMessage";

@Path("/api/shop/:storeId/product")
@Tags("Products")
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

    /**
     * GET a specific product from it's id
     * @param productId
     * @returns
     */
    @GET
    @Path("/:productId")
    @Response<ResponseMessage>(201, "Retrieve a Product.", {
        message: "Product found",
        data: {
            id: 1,
            name: "Camiseta",
            description: "Camiseta de manga corta",
            price: 100.0,
            discountPercentage: 0.6,
            currentStock: 250,
            reorderPoint: 10,
            minimum: 5,
            storeId: 1,
            categories: ["Camiseta"],
            sizes: ["Hombre", "Mujer"],
            brand: "Nike",
            url_img: "/images/cammisa01.webp",
            status: 1,
        },
        error: true,
    })
    @Response<ResponseMessage>(404, "Product not found.", { message: "Product found", data: null, error: true })
    @Action({ route: "/:productId", method: HttpMethod.GET })
    async getById(@PathParam("productId") productId: number) {
        try {
            const product = await this.productRepo.getById(Number(productId));
            return this.httpContext.response.status(200).json({
                message: "Product found",
                data: product,
                error: false,
            });
        } catch (error) {
            console.error("Product" + error.message);
            return this.httpContext.response.status(500).json({
                message: "Product" + error.message,
                data: null,
                error: true,
            });
        }
    }

    /**
     * GET all products from a store id
     * @returns
     */
    @GET
    @Path("/")
    @Response<ResponseMessage>(201, "Retrieve a list of Products.", {
        message: "Products found",
        data: [
            {
                id: 1,
                name: "Camiseta",
                description: "Camiseta de manga corta",
                price: 100.0,
                discountPercentage: 0.6,
                currentStock: 250,
                reorderPoint: 10,
                minimum: 5,
                storeId: 1,
                categories: ["Camiseta"],
                sizes: ["Hombre", "Mujer"],
                brand: "Nike",
                url_img: "/images/cammisa01.webp",
                status: 1,
            },
        ],
        error: false,
    })
    @Response<ResponseMessage>(404, "Products not found.", { message: "Products not found", data: null, error: true })
    @Action({ route: "/", method: HttpMethod.GET })
    async getAll() {
        try {
            const { storeId } = this.httpContext.request.params;
            const products = await this.productRepo.find(["storeId"], [Number(storeId)]);
            return this.httpContext.response.status(200).json({
                message: "Products found",
                data: products,
                error: false,
            });
        } catch (error) {
            console.error("Products " + error.message);
            return this.httpContext.response.status(404).json({
                message: name + "Products " + error.message,
                data: null,
                error: true,
            });
        }
    }
    /**
     * CREATE a product on the database
     
     * @param product 
     * @returns {ResponseMessage}
     * 
     * @example 
     * ```
     * Product {
     *      name: "test",
     *      description: "description",
     *      price: 200.0,
     *      discountPercentage: 1,
     *      currentStock: 50,
     *      reorderPoint: 10,
     *      minimum: 10,
     *      brand: "Nike",
     *      storeId: 1,
     *      url_img: "/images/image01.jpg",
     *      categories: ["Chaqueta", "Zapatos"],
     *      sizes: ["Hombre", "Mujer"],
     *      }
     * ```
     */
    @POST
    @Path("/")
    @Response<ResponseMessage>(201, "Insert a Product on the Database.", {
        message: "Product created",
        data: {
            id: 1,
            name: "Camiseta",
            description: "Camiseta de manga corta",
            price: 100.0,
            discountPercentage: 0.6,
            currentStock: 250,
            reorderPoint: 10,
            minimum: 5,
            storeId: 1,
            categories: ["Camiseta"],
            sizes: ["Hombre", "Mujer"],
            brand: "Nike",
            url_img: "/images/cammisa01.webp",
        },
        error: false,
    })
    @Response<ResponseMessage>(500, "Product insert failed.", {
        message: "Product creation failed",
        data: null,
        error: true,
    })
    @Action({ route: "/", filters: [ProductFilter], fromBody: true, method: HttpMethod.POST })
    async post(product: ProductI) {
        try {
            const { categories, sizes, brand, ...rest } = product;
            const brandName = await this.brandRepo.find(["name"], [brand]);
            const result = await this.productDBRepo.insertOne({
                brandId: brandName[0].id,
                ...rest,
            });
            if (!result.insertId) throw new Error("Product creation failed");

            for (const category of categories) {
                const categoryResponse = await this.categoryRepo.find(["name"], [category]);
                if (categoryResponse.length) throw new Error("Invalid category");
                await this.productCategoryRepo.insertOne({
                    productId: result.insertId,
                    categoryId: categoryResponse[0].id,
                });
            }

            for (const size of sizes) {
                const sizeResponse = await this.sizeRepo.find(["name"], [size]);
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
                data: null,
                error: true,
            });
        }
    }
    @DELETE
    @Path("/:id")
    @Response<ResponseMessage>(200, "Delete a Product on the Database.", {
        message: "Product deleted successfully",
        data: {
            id: 1,
            name: "Camiseta",
            description: "Camiseta de manga corta",
            price: 100.0,
            discountPercentage: 0.6,
            currentStock: 250,
            reorderPoint: 10,
            minimum: 5,
            storeId: 1,
            brandId: 2,
            url_img: "/images/cammisa01.webp",
            status: 1,
        },
        error: false,
    })
    @Response<ResponseMessage>(404, "Product not found.", { message: "Product not found", data: null, error: true })
    @Action({ route: "/:id", method: HttpMethod.DELETE })
    async delete(@PathParam("id") id: number) {
        try {
            const product = await this.productDBRepo.getById(id);
            product.status = 0;
            const productDeleted = await this.productDBRepo.update(product);
            return this.httpContext.response.status(200).json({
                message: "Product deleted successfully",
                data: productDeleted,
                error: false,
            });
        } catch (error) {
            console.error("Product " + error.message);
            return this.httpContext.response.status(404).json({
                message: "Product " + error.message,
                data: null,
                error: true,
            });
        }
    }
    /**
     * UPDATE a product
     * @param product
     * @returns
     *
     * @example
     * ```
     * Product {
     *      name: "test updated",
     *      description: "description",
     *      price: 200.0,
     *      discountPercentage: 1,
     *      currentStock: 50,
     *      reorderPoint: 10,
     *      minimum: 10,
     *      brand: "Topper",
     *      storeId: 1,
     *      url_img: "/images/image01.jpg",
     *      categories: ["Chaqueta", "Zapatos"],
     *      sizes: ["Hombre", "Mujer"],
     *      }
     * ```
     */
    @PUT
    @Path("/")
    @Response<ResponseMessage>(200, "Update a Product on the Database. Except Categories and Sizes", {
        message: "Product updated",
        data: {
            id: 1,
            name: "Camiseta",
            description: "Camiseta de manga corta",
            price: 100.0,
            discountPercentage: 0.6,
            currentStock: 250,
            reorderPoint: 10,
            minimum: 5,
            storeId: 1,
            brandId: 2,
            url_img: "/images/cammisa01.webp",
            status: 1,
        },
        error: false,
    })
    @Response<ResponseMessage>(404, "Product not found.", { message: "Product not found", data: null, error: true })
    @Action({ route: "/", filters: [ProductFilter], fromBody: true, method: HttpMethod.PUT })
    async update(product: ProductI) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { categories, sizes, brand, ...rest } = product;
            const brandName = await this.brandRepo.find(["name"], [brand]);
            const result = await this.productDBRepo.update({ brandId: brandName[0].id, ...rest });

            return this.httpContext.response.status(200).json({
                message: "Product updated",
                data: result,
                error: false,
            });
        } catch (error) {
            console.error("Product " + error.message);
            return this.httpContext.response.status(404).json({
                message: "Product " + error.message,
                data: null,
                error: true,
            });
        }
    }
}
