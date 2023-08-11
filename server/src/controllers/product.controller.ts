import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { ProductInterface } from "../models/product";
import { ProductRepository } from "../repositories/product.repository";
import { ProductFilter, authProductFilter } from "../filters/product.filter";
import { BrandRepository } from "../repositories/brand.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { SizeRepository } from "../repositories/size.repository";
import { ProductCategoryRepository } from "../repositories/productCategory.repository";
import { ProductSizeRepository } from "../repositories/productSize.repository";
import { ProductDBRepository } from "../repositories/productDB.repository";
import { Path, PathParam, GET, POST, DELETE, PUT, HeaderParam } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import { JWTAuthFilter, isManagerFilter } from "../filters/jwtAuth";
import { StoreRepository } from "../repositories/store.repository";
import { UserInterface } from "../models/user";

@Path("/api/product")
@Tags("Products")
@Controller({ route: "/api/product" })
export class ProductController extends ApiController {
    constructor(
        private productRepo: ProductRepository,
        private productDBRepo: ProductDBRepository,
        private brandRepo: BrandRepository,
        private categoryRepo: CategoryRepository,
        private sizeRepo: SizeRepository,
        private productCategoryRepo: ProductCategoryRepository,
        private productSizeRepo: ProductSizeRepository,
        private storeRepo: StoreRepository
    ) {
        super();
    }

    /**
     * Retrieve a products by category
     * Example
     * http:url/?category=Zapatos&size=Niños
     */
    @GET
    @Path("/q")
    @Response<ProductInterface>(200, "Retrieve a Product by categroy.")
    @Response(500, "Product not found.")
    @Action({ route: "/q", method: HttpMethod.GET })
    async getBySizeCategory() {
        const { size, category } = this.httpContext.request.query;
        const products = await this.productRepo.getFilteredProducts(size as string, category as string);
        return products;
    }

    /**
     * GET a specific product from it's id
     * @param productId
     * @returns
     */
    @GET
    @Path("/:productId")
    @Response<ProductInterface>(200, "Retrieve a Product.")
    @Response(500, "Product not found.")
    @Action({ route: "/:productId", method: HttpMethod.GET })
    async getById(@PathParam("productId") productId: number) {
        const product = await this.productRepo.getById(Number(productId));
        if (!product) throw new Error("Product not found");
        return product;
    }

    /**
     * GET all products from a store id
     * @returns
     */
    @GET
    @Path("/")
    @Response<ProductInterface[]>(201, "Retrieve a list of Products.")
    @Response(404, "Products not found.")
    @Action({ route: "/", method: HttpMethod.GET })
    async getAll() {
        const products = await this.productRepo.getAll();
        return products;
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
    @Response<ProductInterface>(201, "Insert a Product on the Database.")
    @Response(500, "Product insert failed.")
    @Action({ route: "/", filters: [ProductFilter, JWTAuthFilter, isManagerFilter], fromBody: true, method: HttpMethod.POST })
    async post(product: ProductInterface) {
        const { id: idManager } = JSON.parse(this.httpContext.request.header("x-auth"));
        const { categories, sizes, brand, ...rest } = product;
        const { id } = (await this.storeRepo.find({ managerId: idManager }))[0];
        if (!id) throw new Error("Manager not found");
        const brandName = await this.brandRepo.find({ name: brand });
        if (!brandName) throw new Error("No brand with that name");
        const result = await this.productDBRepo.insertOne({
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
        const newProduct = await this.productRepo.getById(result.insertId);
        if (newProduct) return newProduct;
    }

    /**
     * DELETE a product
     * @param param0 { id:number, storeId:number }
     * @returns
     */
    @DELETE
    @Path("/")
    @Response<ProductInterface>(200, "Disable a Product on the Database.")
    @Response(404, "Product not found.")
    @Action({ route: "/", method: HttpMethod.DELETE, fromBody: true, filters: [JWTAuthFilter, isManagerFilter, authProductFilter] })
    async delete(entity: ProductInterface) {
        await this.productDBRepo.update({ id: entity.id, status: 0 });
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
    @Response<ProductInterface>(200, "Update a Product on the Database. Except Categories and Sizes")
    @Response(404, "Product not found.")
    @Action({
        route: "/",
        filters: [ProductFilter, JWTAuthFilter, isManagerFilter, authProductFilter],
        fromBody: true,
        method: HttpMethod.PUT,
    })
    async update(entity: ProductInterface) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { categories, sizes, brand, ...rest } = entity;
        const brandName = await this.brandRepo.find({ name: brand });
        //prevent changing product store
        delete rest.storeId;
        await this.productDBRepo.update({ brandId: brandName[0].id, ...rest });
        const product = await this.productRepo.getById(entity.id);

        if (entity.categories.length !== product.categories.length || entity.categories.some((val, index) => val !== product.categories[index])) {
            await this.productCategoryRepo.delete({ productId: entity.id });
            for (const category of categories) {
                const categoryResponse = await this.categoryRepo.find({ name: category });
                if (categoryResponse.length < 1) throw new Error("Invalid category");
                await this.productCategoryRepo.insertOne({ productId: entity.id, categoryId: categoryResponse[0].id });
            }
        }

        if (entity.sizes.length !== product.sizes.length || entity.sizes.some((val, index) => val !== product.sizes[index])) {
            await this.productSizeRepo.delete({ productId: entity.id });
            for (const size of sizes) {
                const sizeResponse = await this.sizeRepo.find({ name: size });
                if (sizeResponse.length < 1) throw new Error("Invalid size");
                await this.productSizeRepo.insertOne({ productId: entity.id, sizeId: sizeResponse[0].id });
            }
        }

        const productR = await this.productRepo.getById(entity.id);
        return productR;
    }
}
