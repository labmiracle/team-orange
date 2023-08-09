import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { StoreRepository } from "../repositories/store.repository";
import { ProductRepository } from "../repositories/product.repository";
import { StoreColorRepository } from "../repositories/storeColor.repository";
import { StoreInterface, ColorInterface, StoreColorInterface } from "../models/store";
import { Path, PathParam, GET, DELETE } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import { JWTAuthFilter, isAdminFilter } from "../filters/jwtAuth";
import { StoreFilter } from "../filters/store.filter";
import { ProductInterface } from "../models/product";

type Colors = {
    primary: ColorInterface;
    secondary: ColorInterface;
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
    constructor(private storeRepo: StoreRepository, private productRepo: ProductRepository, private storeColorRepo: StoreColorRepository) {
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
        const stores = await this.storeRepo.getBy(["name"]);
        return stores;
    }

    /**
     * Return a store data with a give id
     * @param storeId
     * @returns {any}
     */
    @Path("/:storeId")
    @GET
    @Response<StoreInterface>(200, "Return a store data")
    @Response(500, "Store not found", null)
    @Action({ route: "/:storeId", method: HttpMethod.GET })
    async getById(@PathParam("storeId") storeId: number) {
        const store = await this.storeRepo.getById(Number(storeId));
        let products: ProductInterface[] = [];
        try {
            products = await this.productRepo.find({ storeId: Number(storeId), status: 1 });
            // eslint-disable-next-line no-empty
        } catch {}
        const colorsResponse = await this.storeColorRepo.find({ storeId: Number(storeId) });
        const colorsObj: Colors = {} as Colors;
        for (const color of colorsResponse) {
            const type = color.type.toLowerCase();
            colorsObj[type as keyof Colors] = { hue: color.hue, sat: color.sat, light: color.light };
        }
        return { ...store, products: products, colors: colorsObj };
    }

    @Path("/")
    @DELETE
    @Action({ route: "/", method: HttpMethod.DELETE, fromBody: true, filters: [JWTAuthFilter, isAdminFilter] })
    async disableStore({ entity }: { entity: StoreInterface }) {
        await this.storeRepo.update({ id: entity.id, status: 0 });
    }

    @Action({ route: "/", method: HttpMethod.POST, fromBody: true, filters: [StoreFilter, JWTAuthFilter, isAdminFilter] })
    async createStore({ entity: store }: { entity: StoreInterface }) {
        let colors = store.colors;
        delete store.colors;
        const result = await this.storeRepo.insertOne(store);

        if (!colors) {
            colors = {
                primary: { hue: 12, sat: 12, light: 12 } as ColorInterface,
                secondary: { hue: 240, sat: 240, light: 240 } as ColorInterface,
            };
        }

        const primary: StoreColorInterface = { ...colors.primary, storeId: result.insertId, type: "PRIMARY" };
        const secondary: StoreColorInterface = { ...colors.secondary, storeId: result.insertId, type: "SECONDARY" };
        await this.storeColorRepo.insertOne(primary);
        await this.storeColorRepo.insertOne(secondary);
        /* if (products.length > 0) {
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
            } */

        const newStore = await this.storeRepo.getById(result.insertId);
        return newStore;
    }
}
