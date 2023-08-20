import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { ProductInterface } from "../models/product";
import { ProductRepository } from "../repositories/product.repository";
import { ProductFilter, authProductFilter, ProductArrayFilter } from "../filters/product.filter";
import { ProductDBRepository } from "../repositories/productDB.repository";
import { Path, PathParam, GET, POST, DELETE, PUT } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import { JWTAuthFilter, isManagerFilter } from "../filters/jwtAuth";
import { StoreRepository } from "../repositories/store.repository";
import { UnitOfWork } from "../core/unitofwork/unitofwork";

@Path("/api/product")
@Tags("Products")
@Controller({ route: "/api/product" })
export class ProductController extends ApiController {
    constructor(
        private productRepo: ProductRepository,
        private productDBRepo: ProductDBRepository,
        private storeRepo: StoreRepository,
        private unitOfWork: UnitOfWork
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
     */
    @POST
    @Path("/")
    @Response<ProductInterface>(201, "Insert a Product on the Database.")
    @Response(500, "Product insert failed.")
    @Action({ route: "/", filters: [ProductArrayFilter, JWTAuthFilter, isManagerFilter], fromBody: true, method: HttpMethod.POST })
    async post(products: ProductInterface[]) {
        const { id: idManager } = JSON.parse(this.httpContext.request.header("x-auth"));
        const { id } = (await this.storeRepo.find({ managerId: idManager }))[0];
        if (!id) throw new Error("Store not found");
        const resultProducts = [] as ProductInterface[];
        this.unitOfWork.beginTransaction();
        try {
            for (const product of products) {
                const result = await this.productDBRepo.insertProduct(product, id);
                const newProduct = await this.productRepo.getById(result.insertId);
                resultProducts.push(newProduct);
            }
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
     * @param param0 { id:number, storeId:number }
     * @returns
     */
    @DELETE
    @Path("/")
    @Response<ProductInterface>(200, "Disable a Product on the Database.")
    @Response(404, "Product not found.")
    @Action({ route: "/", method: HttpMethod.DELETE, fromBody: true, filters: [JWTAuthFilter, isManagerFilter, authProductFilter] })
    async delete(product: ProductInterface) {
        await this.productDBRepo.update({ id: product.id, status: 0 });
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
