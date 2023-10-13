import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { ProductInterface, ProductForCreationInterface } from "../models/product";
import { ProductRepository } from "../repositories/product.repository";
import { ProductFilter, ProductForCreationFilter } from "../filters/product.filter";
import { ProductDBRepository } from "../repositories/productDB.repository";
import { Path, PathParam, GET, POST, DELETE, PUT } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import { JWTAuthFilter, isManagerFilter, authProductFilter } from "../filters/jwtAuth";
import { StoreRepository } from "../repositories/store.repository";
import { UnitOfWork } from "../core/unitofwork/unitofwork";
import { UserRepository } from "../repositories/user.repository";

@Path("/api/product")
@Tags("Products")
@Controller({ route: "/api/product" })
export class ProductController extends ApiController {
    constructor(
        private readonly productRepo: ProductRepository,
        private readonly productDBRepo: ProductDBRepository,
        private readonly storeRepo: StoreRepository,
        private readonly userRepo: UserRepository,
        private readonly unitOfWork: UnitOfWork
    ) {
        super();
    }

    /**
     * Retrieve products by category, size, limit or storeId
     * Example
     * http:url/?category=Zapatos&size=Niños&limit=10&store=1
     */
    @GET
    @Path("/store/:storeId/q")
    @Response<ProductInterface[]>(200, "Retrieve Products by storeId with filter of category, size.")
    @Response(500, "Product not found.")
    @Action({ route: "store/:storeId/q", method: HttpMethod.GET })
    async getByFilter(@PathParam("storeId") storeId: number) {
        const {
            page = 1,
            per_page = 12,
            size,
            category,
        }: {
            page?: number;
            per_page?: number;
            size?: string;
            category?: string;
        } = this.httpContext.request.query;
        const totalItems: number = await this.productRepo.getCountFilteredProducts(storeId, size, category);
        const totalPages = Math.ceil(totalItems / per_page);
        const products = await this.productRepo.getFilteredProducts(storeId, page, per_page, size, category);
        return {
            products,
            pagination: {
                page: page,
                perPage: per_page,
                totalPages: totalPages,
                totalItems,
                hasNextPage: page < totalPages,
            },
        };
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
     * CREATE a product on the database
     * @param product
     * @returns {ResponseMessage}
     */
    @POST
    @Path("/")
    @Response<ProductInterface>(201, "Insert a Product on the Database.")
    @Response(500, "Product insert failed.")
    @Action({ route: "/", filters: [ProductForCreationFilter, JWTAuthFilter, isManagerFilter], fromBody: true, method: HttpMethod.POST })
    async post(product: ProductForCreationInterface) {
        //image handling
        const file = this.httpContext.request.file;
        delete product.img_file;

        const productToCreate = {
            ...product,
            categories: typeof product.categories === "string" ? product.categories.split(",") : product.categories,
            sizes: typeof product.sizes === "string" ? product.sizes.split(",") : product.sizes,
            url_img: file ? `images/${file.originalname}` : "images/placeholder.jpg",
        } as ProductInterface;

        const { id: idManager } = this.userRepo.getAuth();
        const { id } = (await this.storeRepo.find({ managerId: idManager }))[0];
        if (!id) throw new Error("Store not found");
        const resultProducts = [] as ProductInterface[];
        this.unitOfWork.beginTransaction();
        try {
            const result = await this.productDBRepo.insertProduct(productToCreate, id);
            const newProduct = await this.productRepo.getById(result.insertId);
            resultProducts.push(newProduct);
        } catch (e) {
            this.unitOfWork.rollbackTransaction();
            this.unitOfWork.commitTransaction();
            throw Error(e);
        }
        this.unitOfWork.commitTransaction();
        return resultProducts;
    }

    /**
     * DELETE a product
     * @param param0 productId
     * @returns
     */
    @DELETE
    @Path("/:productId")
    @Response<ProductInterface>(200, "Disable a Product on the Database.")
    @Response(404, "Product not found.")
    @Action({ route: "/:productId", method: HttpMethod.DELETE, filters: [JWTAuthFilter, isManagerFilter, authProductFilter] })
    async delete(@PathParam("productId") productId: number) {
        await this.productDBRepo.update({ id: productId, status: 0 });
    }
    /**
     * UPDATE a product
     * @param product
     * @returns
     */
    @PUT
    @Path("/")
    @Response<ProductInterface>(200, "Update a Product on the Database.")
    @Response(404, "Product not found.")
    @Action({
        route: "/",
        filters: [ProductFilter, JWTAuthFilter, isManagerFilter, authProductFilter],
        fromBody: true,
        method: HttpMethod.PUT,
    })
    async update(entity: ProductInterface) {
        this.unitOfWork.beginTransaction();
        try {
            await this.productDBRepo.updateProduct(entity);
        } catch (e) {
            this.unitOfWork.rollbackTransaction();
            this.unitOfWork.commitTransaction();
            throw Error(e);
        }
        this.unitOfWork.commitTransaction();
        const product = await this.productRepo.getById(entity.id);
        return product;
    }
}
