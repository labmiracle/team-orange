import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { StoreRepository } from "../repositories/store.repository";
import { ProductRepository } from "../repositories/product.repository";
import { StoreColorRepository } from "../repositories/storeColor.repository";
import { StoreI, Color, StoreColorI } from "../models/store";
import { Path, PathParam, GET, DELETE } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import { ProductDBRepository } from "../repositories/productDB.repository";
import { BrandRepository } from "../repositories/brand.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { SizeRepository } from "../repositories/size.repository";
import { ProductCategoryRepository } from "../repositories/productCategory.repository";
import { ProductSizeRepository } from "../repositories/productSize.repository";

type Colors = {
    primary: Color;
    secondary: Color;
};

type Names = {
    /**@IsInt */
    id: number;
    name: string;
};

@Path("/api/shop")
@Tags("Stores")
@Controller({ route: "/api/shop" })
export class StoreController extends ApiController {
    constructor(
        private storeRepo: StoreRepository,
        private productRepo: ProductRepository,
        private productDBRepo: ProductDBRepository,
        private storeColorRepo: StoreColorRepository,
        private brandRepo: BrandRepository,
        private categoryRepo: CategoryRepository,
        private sizeRepo: SizeRepository,
        private productCategoryRepo: ProductCategoryRepository,
        private productSizeRepo: ProductSizeRepository
    ) {
        super();
    }

    /**
     * Return an array of each store id and name
     * @returns [{id: number, name: string}]
     */
    @Path("/names")
    @GET
    @Response<Array<Names>>(200, "Return an array of each store id and name", [{ id: 1, name: "Tienda" }])
    @Response(500, "Stores not found", null)
    @Action({ route: "/names", method: HttpMethod.GET })
    async getAll() {
        try {
            const stores = await this.storeRepo.getBy(["name"]);
            return this.httpContext.response.status(200).send(stores);
        } catch (err) {
            console.error(err);
            return this.httpContext.response.status(500).send(err.message);
        }
    }

    /**
     * Return a store data with a give id
     * @param storeId
     * @returns {any}
     */
    @Path("/:storeId")
    @GET
    @Response<StoreI>(200, "Return a store data")
    @Response(500, "Store not found", null)
    @Action({ route: "/:storeId", method: HttpMethod.GET })
    async getById(@PathParam("storeId") storeId: number) {
        try {
            const store = await this.storeRepo.getById(Number(storeId));
            const products = await this.productRepo.find({ storeId: Number(storeId), status: 1 });
            const colorsResponse = await this.storeColorRepo.find({ storeId: Number(storeId) });
            const colorsObj: Colors = {} as Colors;
            for (const color of colorsResponse) {
                const type = color.type.toLowerCase();
                colorsObj[type as keyof Colors] = { hue: color.hue, sat: color.sat, light: color.light };
            }
            return this.httpContext.response.status(200).send({ ...store, products: products, colors: colorsObj });
        } catch (err) {
            console.error(err);
            return this.httpContext.response.status(500).send(err.message);
        }
    }

    @Path("/:storeId")
    @DELETE
    @Action({ route: "/:storeId", method: HttpMethod.DELETE })
    async disableStore(@PathParam("storeId") storeId: number) {
        try {
            const store = await this.storeRepo.getById(storeId);
            delete store.colors;
            delete store.products;
            store.status = 0;
            await this.storeRepo.update(store);
            return this.httpContext.response.status(200).send("Store updated");
        } catch (err) {
            console.error(err);
            return this.httpContext.response.status(500).send(err.message);
        }
    }

    @Action({ route: "/", method: HttpMethod.POST, fromBody: true })
    async createStore(store: StoreI) {
        try {
            const colors = store.colors;
            const products = store.products;
            delete store.colors;
            delete store.products;
            const result = await this.storeRepo.insertOne(store);

            if (colors) {
                const primary: StoreColorI = { ...colors.primary, storeId: result.insertId, type: "PRIMARY" };
                const secondary: StoreColorI = { ...colors.secondary, storeId: result.insertId, type: "SECONDARY" };
                await this.storeColorRepo.insertOne(primary);
                await this.storeColorRepo.insertOne(secondary);
            }

            if (products.length > 0) {
                for (const product of products) {
                    const { categories, sizes, brand, ...rest } = product;
                    const brandName = await this.brandRepo.find({ name: brand });
                    const result = await this.productDBRepo.insertOne({
                        brandId: brandName[0].id,
                        ...rest,
                    });
                    if (!result.insertId) throw new Error("Product creation failed");

                    for (const category of categories) {
                        const categoryResponse = await this.categoryRepo.find({ name: category });
                        if (categoryResponse.length) throw new Error(`${category} is not a valid category`);
                        await this.productCategoryRepo.insertOne({
                            productId: result.insertId,
                            categoryId: categoryResponse[0].id,
                        });
                    }

                    for (const size of sizes) {
                        const sizeResponse = await this.sizeRepo.find({ name: size });
                        if (sizeResponse.length) throw new Error(`${size} is not a valid size`);
                        await this.productSizeRepo.insertOne({
                            productId: result.insertId,
                            sizeId: sizeResponse[0].id,
                        });
                    }
                }
            }

            return this.httpContext.response.status(200).send("Store created");
        } catch (err) {
            console.error(err);
            return this.httpContext.response.status(500).send(err.message);
        }
    }
}
